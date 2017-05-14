import Node from './Node.js';
import Scope from './Scope.js';
import extractNames from './extractNames.js';
import breaksExecution from '../analysis/breaksExecution.js';

function compatibleDeclarations ( a, b ) {
	if ( a === b ) return true;
	if ( a === 'var' || b === 'var' ) return false;
	return true;
}

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

	return /(?:Class|Function)Declaration/.test( statement.type );
}

function isVarDeclaration ( node ) {
	return node.kind === 'var';
}

export default class BlockStatement extends Node {
	attachScope ( parent ) {
		this.scope = new Scope({
			block: true,
			parent
		});

		for ( let i = 0; i < this.body.length; i += 1 ) {
			this.body[i].attachScope( this.scope );
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
		if ( this.canSequentialise() || this.body.length > 0 && this.body.every( isVarDeclaration ) ) {
			return this.body[0].getLeftHandSide();
		}
		return this;
	}

	getRightHandSide () {
		if ( this.canSequentialise() || this.body.length > 0 && this.body.every( isVarDeclaration ) ) {
			return this.body[this.body.length - 1].getRightHandSide();
		}
		return this;
	}

	initialise ( scope ) {
		this.parentIsFunction = /Function/.test( this.parent.type );

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
					node.initialise( this.scope || scope );
				}

				continue;
			}

			maybeReturnNode = breaksExecution( node );
			if ( maybeReturnNode ) executionIsBroken = true;

			node.initialise( this.scope || scope );

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

	isEmpty () {
		for ( let i = 0; i < this.body.length; i += 1 ) {
			const node = this.body[i];
			if ( !node.skip ) return false;
		}

		return true;
	}

	minify ( code ) {
		if ( this.scope ) this.scope.mangle( code );

		const sequentialise = !this.parentIsFunction && this.canSequentialise();
		const removeCurlies = this.canRemoveCurlies();
		const separator = sequentialise ? ',' : ';';

		// remove leading whitespace
		let lastEnd = ( this.parent.type === 'Root' || removeCurlies ) ? this.start : this.start + 1;
		const end = ( this.parent.type === 'Root' || removeCurlies ) ? this.end : this.end - 1;

		const statements = this.body.filter( statement => !statement.skip );

		if ( statements.length ) {
			let nextSeparator = ( this.scope && this.scope.useStrict && ( !this.scope.parent || !this.scope.parent.useStrict ) ) ?
				'"use strict";' :
				'';

			for ( let i = 0; i < statements.length; i += 1 ) {
				const statement = statements[i];
				statement.minify( code );

				if ( nextSeparator === '' ) {
					if ( statement.start > lastEnd ) code.remove( lastEnd, statement.start );
				} else {
					if ( statement.start === lastEnd ) {
						code.appendLeft( lastEnd, separator );
					} else {
						if ( code.original.slice( lastEnd, statement.start ) !== nextSeparator ) {
							code.overwrite( lastEnd, statement.start, nextSeparator );
						}
					}
				}

				lastEnd = statement.end;

				// remove superfluous semis (TODO is this necessary?)
				while ( code.original[ lastEnd - 1 ] === ';' ) lastEnd -= 1;

				if ( statement.removed ) {
					nextSeparator = '';
				}

				else {
					nextSeparator = endsWithCurlyBrace( statement ) ? '' : separator;
				}
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

		// combine adjacent var declarations
		let lastStatement;
		for ( let statement of statements ) {
			if ( lastStatement && lastStatement.type === 'VariableDeclaration' && statement.type === 'VariableDeclaration' ) {
				// are they compatible?
				if ( compatibleDeclarations( lastStatement.kind, statement.kind ) ) {
					const lastDeclarator = lastStatement.declarations[ lastStatement.declarations.length - 1 ];
					code.overwrite( lastDeclarator.end, statement.declarations[0].start, ',' );

					statement.collapsed = true;
				}
			}

			if ( !statement.collapsed && statement.kind === 'const' && ( !lastStatement || lastStatement.kind !== 'VariableDeclaration' ) ) {
				code.overwrite( statement.start, statement.start + 5, 'let' );
			}

			lastStatement = statement;
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
	// 		statement.minify( code );
	// 	});
	// }
}
