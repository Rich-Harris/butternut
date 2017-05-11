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
	ForStatement: true,
	ForInStatement: true,
	ForOfStatement: true,
	IfStatement: true,
	WhileStatement: true
};

function endsWithCurlyBrace ( statement ) {
	if ( statement.type === 'IfStatement' ) {
		if ( statement.rewriteAsSequence ) return false;

		if ( statement.alternate ) {
			if ( statement.alternate.type === 'IfStatement' ) {
				return endsWithCurlyBrace( statement.alternate );
			}

			if ( statement.alternate.synthetic ) return false;
			if ( statement.alternate.removeCurlies ) return false;

			return true;
		}

		return !statement.consequent.synthetic && !statement.consequent.removeCurlies;
	}

	if ( /^(?:For(?:In|Of)?|While)Statement/.test( statement.type ) ) {
		return !statement.body.synthetic && !statement.body.removeCurlies;
	}

	return /(?:Class|Function)Declaration/.test( statement.type );
}

export default class BlockStatement extends Node {
	createScope ( parent ) {
		this.parentIsFunction = /Function/.test( this.parent.type );
		this.isFunctionBlock = this.parentIsFunction || this.parent.type === 'Root';

		this.scope = new Scope({
			block: !this.isFunctionBlock,
			parent: parent || this.parent.findScope( false ), // TODO always supply parent
			owner: this
		});

		const params = this.parent.params || ( this.parent.type === 'CatchClause' && [ this.parent.param ] );

		if ( params && params.length ) {
			params.forEach( node => {
				extractNames( node ).forEach( identifier => {
					this.scope.addDeclaration( identifier, 'param' );
				});
			});
		}
	}

	initialise () {
		// normally the scope gets created here, during initialisation,
		// but in some cases (e.g. `for` statements), we need to create
		// the scope early, as it pertains to both the init block and
		// the body of the statement
		if ( !this.scope ) this.createScope( this.parent.findScope( false ) );

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
					node.initialise();
				} else {
					node.skip = true;
				}

				continue;
			}

			maybeReturnNode = breaksExecution( node );
			if ( maybeReturnNode ) executionIsBroken = true;

			node.initialise();

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

		this.scope.consolidate();
	}

	findVarDeclarations ( varsToHoist ) {
		if ( !this.scope ) this.createScope( this.parent.findScope( false ) );

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

		this.scope.consolidate();
	}

	findLexicalBoundary () {
		if ( this.type === 'Program' ) return this;
		if ( /^Function/.test( this.parent.type ) ) return this;

		return this.parent.findLexicalBoundary();
	}

	findScope ( functionScope ) {
		if ( functionScope && !this.isFunctionBlock ) return this.parent.findScope( functionScope );
		return this.scope;
	}

	getLeftHandSide () {
		if ( this.removeCurlies || this.synthetic ) return this.body[0].getLeftHandSide();
		return this;
	}

	getRightHandSide () {
		if ( this.removeCurlies || this.synthetic ) return this.body[this.body.length - 1].getRightHandSide();
		return this;
	}

	minify ( code ) {
		if ( this.scope ) this.scope.mangle( code ); // class declarations do not create their own scope

		const statements = this.body.filter( statement => !statement.skip );

		// if ( this.collapseReturnStatements ) {
		// 	this.minifyWithCollapsedReturnStatements( code, statements );
		// } else {
		statements.forEach( statement => {
			statement.minify( code );
		});
		// }

		// TODO this is confusing
		const rewriteAsSequence = !this.parentIsFunction && statements.length > 0 && ( this.joinStatements || statements.every( statement => {
			return statement.type === 'ExpressionStatement' ||
			       statement.rewriteAsSequence;
		}) );

		const separator = rewriteAsSequence ? ',' : ';';

		// TODO this is confusing
		let removeCurlies = this.parent.type === 'Root' || !this.synthetic && (
			this.parent.type === 'IfStatement' ?
				this.removeCurlies :
				( allowsBlockLessStatement[ this.parent.type ] && rewriteAsSequence )
		);

		this.removeCurlies = removeCurlies;

		// remove leading whitespace
		let lastEnd = ( this.parent.type === 'Root' || removeCurlies ) ? this.start : this.start + 1;

		if ( statements.length ) {
			let nextSeparator = '';

			for ( let i = 0; i < statements.length; i += 1 ) {
				const statement = statements[i];

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

				// remove superfluous semis
				while ( code.original[ lastEnd - 1 ] === ';' ) lastEnd -= 1;

				if ( statement.removed ) {
					nextSeparator = '';
				}

				else {
					nextSeparator = endsWithCurlyBrace( statement ) ? '' : separator;
				}
			}

			const end = removeCurlies ? this.end : this.end - 1;
			if ( end > lastEnd ) code.remove( lastEnd, end );
		} else {
			// empty block
			if ( this.removeCurlies || this.parent.type === 'Root' ) {
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
