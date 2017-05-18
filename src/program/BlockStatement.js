import Node from './Node.js';
import Scope from './Scope.js';
import extractNames from './extractNames.js';
import breaksExecution from '../analysis/breaksExecution.js';

const shouldPreserveAfterReturn = {
	FunctionDeclaration: true,
	VariableDeclaration: true,
	ClassDeclaration: true
};

const allowsBlockLessStatement = {
	BlockStatement: true,
	ForStatement: true,
	ForInStatement: true,
	ForOfStatement: true,
	IfStatement: true,
	WhileStatement: true
};

function endsWithCurlyBrace ( statement ) { // TODO can we just use getRightHandSide?
	if ( statement.type === 'IfStatement' ) {
		if ( statement.rewriteAsSequence ) return false;

		if ( statement.alternate ) {
			if ( statement.alternate.type === 'IfStatement' ) {
				return endsWithCurlyBrace( statement.alternate );
			}

			if ( statement.alternate.type !== 'BlockStatement' ) return false;
			if ( statement.alternate.canRemoveCurlies() ) return false;

			return true;
		}

		return statement.consequent.type === 'BlockStatement' && !statement.consequent.canRemoveCurlies();
	}

	if ( /^(?:For(?:In|Of)?|While)Statement/.test( statement.type ) ) {
		return statement.body.type === 'BlockStatement' && !statement.body.canRemoveCurlies();
	}

	if ( statement.type === 'SwitchStatement' ) return true;

	return /(?:Class|Function)Declaration/.test( statement.type );
}

function isVarDeclaration ( node ) {
	return node.kind === 'var';
}

export default class BlockStatement extends Node {
	attachScope ( program, parent ) {
		this.parentIsFunction = /Function/.test( this.parent.type );

		if ( this.parentIsFunction ) {
			this.scope = parent;
		} else {
			this.scope = new Scope({
				block: true,
				parent
			});
		}

		for ( let i = 0; i < this.body.length; i += 1 ) {
			this.body[i].attachScope( program, this.scope );
		}
	}

	canRemoveCurlies () {
		return allowsBlockLessStatement[ this.parent.type ] && ( this.canSequentialise() || ( this.body.length > 0 && this.body.every( isVarDeclaration ) ) );
	}

	// TODO memoize
	canSequentialise () {
		for ( let i = 0; i < this.body.length; i += 1 ) {
			const node = this.body[i];
			if ( !node.skip && !node.canSequentialise() ) return false; // TODO what if it's a block with a late-activated declaration...
		}

		return true;
	}

	// TODO what is this about?
	findVarDeclarations ( varsToHoist ) {
		this.body.forEach( node => {
			if ( node.type === 'VariableDeclaration' && node.kind === 'var' ) {
				node.declarations.forEach( declarator => {
					extractNames( declarator.id ).forEach( identifier => {
						varsToHoist[ identifier.name ] = true;
					});
				});
			} else {
				node.findVarDeclarations( varsToHoist );
			}
		});
	}

	getLeftHandSide () {
		if ( this.body.length > 0 && ( this.canSequentialise() || this.body.every( isVarDeclaration ) ) ) {
			return this.body[0].getLeftHandSide();
		}
		return this;
	}

	getRightHandSide () {
		if ( this.body.length > 0 && ( this.canSequentialise() || this.body.every( isVarDeclaration ) ) ) {
			return this.body[this.body.length - 1].getRightHandSide();
		}
		return this;
	}

	initialise ( program, scope ) {
		let executionIsBroken = false;
		let maybeReturnNode;
		let hasDeclarationsAfterBreak = false;

		let canCollapseReturns = this.parentIsFunction;
		let returnStatements = [];

		for ( let i = 0; i < this.body.length; i += 1 ) {
			const node = this.body[i];

			if ( executionIsBroken ) {
				if ( shouldPreserveAfterReturn[ node.type ] ) {
					hasDeclarationsAfterBreak = true;
					node.initialise( program, this.scope || scope );
				}

				continue;
			}

			maybeReturnNode = breaksExecution( node );
			if ( maybeReturnNode ) executionIsBroken = true;

			node.initialise( program, this.scope || scope );

			if ( canCollapseReturns ) {
				if ( node.preventsCollapsedReturns( returnStatements ) ) {
					canCollapseReturns = false;
				} else {
					// console.log( `${node.type} preventsCollapsedReturns`)
				}
			}
		}

		this.collapseReturnStatements = canCollapseReturns && returnStatements.length;
		this.returnStatements = returnStatements;

		// if `return` is the last line of a function, remove it
		if ( maybeReturnNode && this.parentIsFunction && !hasDeclarationsAfterBreak ) {
			// TODO also capture `return undefined` and `return void 0` etc?
			if ( !maybeReturnNode.argument ) {
				maybeReturnNode.skip = true;
			}
		}
	}

	// TODO remove block.isEmpty() in favour of block.skip — this is a hangover from
	// when variables could get activated after we'd finished initialising a block
	isEmpty () {
		for ( let i = 0; i < this.body.length; i += 1 ) {
			const node = this.body[i];
			if ( !node.skip ) return false;
		}

		return true;
	}

	minify ( code, chars ) {
		if ( this.scope ) {
			this.scope.mangle( code, chars );
		}

		let insertedVarDeclaration = '';

		if ( this.parentIsFunction || this.parent.type === 'Root' ) {
			// if there are any vars inside removed blocks, they need
			// to be declared here
			const hoisted = [];
			this.scope.hoistedVars.forEach( name => {
				const hoistedVar = this.scope.declarations[name];
				if ( hoistedVar.activated ) {
					hoisted.push( hoistedVar.alias || hoistedVar.name );
				}
			});

			if ( hoisted.length ) {
				// see if there's an existing var declaration we can glom these onto
				const varDeclaration = this.scope.varDeclarationNodes.find( node => {
					while ( node !== this ) {
						if ( node.skip ) return false;
						node = node.parent;
					}

					return true;
				});

				if ( varDeclaration ) {
					varDeclaration.rideAlongs = hoisted;
				} else {
					insertedVarDeclaration = `var ${hoisted.join(',')};`;
				}
			}
		}

		const sequentialise = !this.parentIsFunction && this.canSequentialise();
		const removeCurlies = this.canRemoveCurlies();
		const separator = sequentialise ? ',' : ';';

		// remove leading whitespace
		let lastEnd = ( this.parent.type === 'Root' || removeCurlies ) ? this.start : this.start + 1;
		const end = ( this.parent.type === 'Root' || removeCurlies ) ? this.end : this.end - 1;

		const statements = this.body.filter( statement => !statement.skip );
		let lastStatement;

		if ( statements.length ) {
			let nextSeparator = ( ( this.scope && this.scope.useStrict && ( !this.scope.parent || !this.scope.parent.useStrict ) ) ?
				'"use strict";' :
				'' ) + insertedVarDeclaration;

			for ( let i = 0; i < statements.length; i += 1 ) {
				const statement = statements[i];

				statement.minify( code, chars );

				if ( !statement.collapsed ) {
					if ( statement.start > lastEnd ) code.remove( lastEnd, statement.start );

					if ( nextSeparator ) {
						code.appendLeft( lastStatement ? lastStatement.getRightHandSide().end : lastEnd, nextSeparator );
					}

					if ( statement.removed ) {
						nextSeparator = '';
					} else {
						nextSeparator = endsWithCurlyBrace( statement ) ? '' : separator;
					}
				}

				lastEnd = statement.end;

				// remove superfluous semis (TODO is this necessary?)
				while ( code.original[ lastEnd - 1 ] === ';' ) lastEnd -= 1;

				if ( statement.removed ) {
					nextSeparator = '';
				} else {
					nextSeparator = endsWithCurlyBrace( statement ) ? '' : separator;
				}

				lastStatement = statement;
			}

			if ( end > lastEnd ) code.remove( lastEnd, end );
		} else {
			// empty block
			if ( removeCurlies || this.parent.type === 'Root' ) {
				code.remove( this.start, this.end );
			} else if ( this.end > this.start + 2 ) {
				code.remove( this.start + 1, this.end - 1 );
			}
		}
	}

	// TODO make this work!
	// minifyWithCollapsedReturnStatements ( code, statements ) {
	// 	if ( this.returnStatements.length === 1 ) {
	// 		const returnStatement = this.returnStatements[0];

	// 		if ( returnStatement.parent === this ) {
	// 			// case 1 – a single top-level return with no argument
	// 			if ( !returnStatement.argument ) {
	// 				// does this already get skipped above?
	// 				throw new Error( 'TODO single return statement without arg' );
	// 			}

	// 			// case 2 – a single top-level return with an argument
	// 			else {
	// 				throw new Error( 'TODO single return statement with arg' );
	// 			}
	// 		}

	// 		else {
	// 			// case 3 – a single conditional return with no argument
	// 			if ( !returnStatement.argument ) {
	// 				returnStatement.skip = true;
	// 			}

	// 			// case 4 – a single conditional return with an argument
	// 			else {
	// 				throw new Error( 'TODO single return statement with arg' );
	// 			}
	// 		}
	// 	}

	// 	else {
	// 		throw new Error( 'TODO multiple return statements' );
	// 	}

	// 	statements.forEach( statement => {
	// 		statement.minify( code, chars );
	// 	});
	// }
}
