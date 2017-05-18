import Node from '../Node.js';
import { UNKNOWN } from '../../utils/sentinels.js';

const invalidChars = /[a-zA-Z$_0-9/]/;

// TODO this whole thing is kinda messy... refactor it

function endsWithCurlyBraceOrSemicolon ( node ) {
	return (
		node.type === 'BlockStatement' ||
		node.type === 'SwitchStatement' ||
		node.type === 'TryStatement' ||
		node.type === 'EmptyStatement'
	);
}

export default class IfStatement extends Node {
	canSequentialise () {
		const testValue = this.test.getValue();

		if ( testValue === UNKNOWN ) {
			return this.consequent.canSequentialise() && ( !this.alternate || this.alternate.canSequentialise() );
		}

		if ( testValue ) {
			return this.consequent.canSequentialise();
		}

		return this.alternate ? this.alternate.canSequentialise() : false;
	}

	getLeftHandSide () {
		const testValue = this.test.getValue();

		if ( testValue === UNKNOWN ) {
			if ( this.canSequentialise() ) return ( this.inverted ? this.test.argument : this.test ).getLeftHandSide();
			return this;
		}

		if ( testValue ) return this.consequent.getLeftHandSide();
		return this.alternate.getLeftHandSide();
	}

	getRightHandSide () {
		const testValue = this.test.getValue();

		if ( testValue === UNKNOWN ) {
			if ( this.canSequentialise() ) return ( this.alternate ? ( this.inverted ? this.consequent : this.alternate ) : this.consequent ).getRightHandSide();
			return ( this.alternate || this.consequent ).getRightHandSide();
		}

		if ( testValue || !this.alternate ) return this.consequent.getRightHandSide();
		return this.alternate.getRightHandSide();
	}

	initialise ( program, scope ) {
		// TODO add 'if/else' to character frequency, but only if not rewriting as sequence

		this.skip = false; // TODO skip if known to be safe

		const testValue = this.test.getValue();

		if ( testValue === UNKNOWN ) {
			// initialise everything
			this.test.initialise( program, scope );
			this.consequent.initialise( program, scope );
			if ( this.alternate ) this.alternate.initialise( program, scope );
		}

		else if ( testValue ) { // if ( true ) {...}
			this.consequent.initialise( program, scope );

			if ( this.alternate && this.alternate.type === 'BlockStatement' ) {
				this.alternate.scope.varDeclarations.forEach( name => {
					scope.functionScope.hoistedVars.add( name );
				});
			}
		}

		else { // if ( false ) {...}
			if ( this.alternate ) {
				this.alternate.initialise( program, scope );
			} else {
				this.skip = true;
			}

			if ( this.consequent.type === 'BlockStatement' ) {
				this.consequent.scope.varDeclarations.forEach( name => {
					scope.functionScope.hoistedVars.add( name );
				});
			}
		}

		this.inverted = this.test.type === 'UnaryExpression' && this.test.operator === '!';
	}

	minify ( code, chars ) {
		const testValue = this.test.getValue();

		if ( testValue !== UNKNOWN ) {
			if ( testValue ) { // if ( true ) {...}
				if ( this.alternate ) {
					// TODO handle var declarations in alternate
					code.remove( this.consequent.end, this.end );
				}

				code.remove( this.start, this.consequent.start );
				this.consequent.minify( code, chars );
			} else { // if ( false ) {...}
				// we know there's an alternate, otherwise we wouldn't be here
				this.alternate.minify( code, chars );
				code.remove( this.start, this.alternate.start );
			}

			return;
		}

		this.test.minify( code, chars );

		// if we're rewriting as &&, test must be higher precedence than 6
		// to avoid being wrapped in parens. If ternary, 4
		const targetPrecedence = this.alternate ? 4 : this.inverted ? 5 : 6;
		const test = this.inverted ? this.test.argument : this.test;

		const shouldParenthesiseTest = (
			test.getPrecedence() < targetPrecedence ||
			test.getLeftHandSide().type === 'ObjectExpression' ||
			test.getRightHandSide().type === 'ObjectExpression'
		);

		// TODO what if nodes in the consequent are skipped...
		const shouldParenthesiseConsequent = this.consequent.type === 'BlockStatement' ?
			( this.consequent.body.length === 1 ? this.consequent.body[0].getPrecedence() < targetPrecedence : true ) :
			this.consequent.getPrecedence() < targetPrecedence;

		// special case – empty consequent
		if ( this.consequent.isEmpty() ) {
			const canRemoveTest = this.test.type === 'Identifier' || this.test.getValue() !== UNKNOWN; // TODO can this ever happen?

			if ( this.alternate && !this.alternate.isEmpty() ) {
				this.alternate.minify( code, chars );

				if ( this.alternate.type === 'BlockStatement' && this.alternate.body.length === 0 ) {
					if ( canRemoveTest ) {
						code.remove( this.start, this.end );
						this.removed = true;
					} else {
						code.remove( this.start, this.test.start );
						code.remove( this.test.end, this.end );
					}
				} else if ( this.alternate.canSequentialise() ) {
					let alternatePrecedence;
					if ( this.alternate.type === 'IfStatement' ) {
						alternatePrecedence = this.alternate.alternate ?
							4 : // will rewrite as ternary
							5;
					} else if ( this.alternate.type === 'BlockStatement' ) {
						alternatePrecedence = this.alternate.body.length === 1 ?
							this.alternate.body[0].getPrecedence() :
							0; // sequence
					} else {
						alternatePrecedence = 0; // err on side of caution
					}

					const shouldParenthesiseAlternate = alternatePrecedence < ( this.inverted ? 6 : 5 );
					if ( shouldParenthesiseAlternate ) this.alternate.parenthesize( code );

					code.remove( this.start, this.inverted ? this.test.argument.start : this.test.start );
					code.overwrite( this.test.end, this.alternate.start, this.inverted ? '&&' : '||' );
				} else {
					let before = '(';
					let after = ')';

					let start = this.test.start;

					if ( this.inverted ) {
						start = this.test.argument.start;
					} else {
						before += '!';

						if ( this.test.getPrecedence() < 16 ) { // 16 is the precedence of unary expressions
							before += '(';
							after += ')';
						}
					}

					code.overwrite( this.start + 2, start, before );
					code.overwrite( this.test.end, this.alternate.start, after );
				}
			} else {
				// TODO is `removed` still used?
				if ( canRemoveTest ) {
					code.remove( this.start, this.end );
					this.removed = true;
				} else {
					code.remove( this.start, this.test.start );
					code.remove( this.test.end, this.end );
				}
			}

			return;
		}

		// special case - empty alternate
		if ( this.alternate && this.alternate.isEmpty() ) {
			// don't minify alternate
			this.consequent.minify( code, chars );
			code.remove( this.consequent.end, this.end );

			if ( this.consequent.canSequentialise() ) {
				if ( shouldParenthesiseTest ) this.test.parenthesize( code );
				if ( shouldParenthesiseConsequent ) this.consequent.parenthesize( code );

				code.remove( this.start, ( this.inverted ? this.test.argument.start : this.test.start ) );
				code.remove( this.consequent.getRightHandSide().end, this.end );
				code.overwrite( this.test.end, this.consequent.start, this.inverted ? '||' : '&&' );
			}

			else {
				if ( this.test.start > this.start + 3 ) code.overwrite( this.start, this.test.start, 'if(' );

				if ( this.consequent.start > this.test.end + 1 ) code.overwrite( this.test.end, this.consequent.start, ')' );
				if ( this.end > this.consequent.end + 1 ) code.remove( this.consequent.end, this.end - 1 );
			}

			return;
		}

		this.consequent.minify( code, chars );
		if ( this.alternate ) this.alternate.minify( code, chars );

		if ( this.canSequentialise() ) {
			if ( this.inverted ) code.remove( this.test.start, this.test.start + 1 );

			if ( this.alternate ) {
				this.rewriteAsTernaryExpression( code, shouldParenthesiseTest, shouldParenthesiseConsequent );
			} else {
				this.rewriteAsLogicalExpression( code, shouldParenthesiseTest, shouldParenthesiseConsequent );
			}
		}

		else {
			if ( this.test.start > this.start + 3 ) code.overwrite( this.start + 2, this.test.start, '(' );
			if ( this.consequent.start > this.test.end + 1 ) code.overwrite( this.test.end, this.consequent.start, ')' );

			if ( this.alternate ) {
				const lastNodeOfConsequent = this.consequent.getRightHandSide();
				const firstNodeOfAlternate = this.alternate.getLeftHandSide();

				let gap = ( endsWithCurlyBraceOrSemicolon( lastNodeOfConsequent ) ? '' : ';' ) + 'else';
				if ( invalidChars.test( code.original[ firstNodeOfAlternate.start ] ) ) gap += ' ';

				let c = this.consequent.end;
				while ( code.original[ c - 1 ] === ';' ) c -= 1;

				code.overwrite( c, this.alternate.start, gap );
			}
		}
	}

	preventsCollapsedReturns ( returnStatements ) {
		// TODO make this a method of nodes
		if ( this.consequent.type === 'BlockStatement' ) {
			for ( let statement of this.consequent.body ) {
				if ( statement.skip ) continue;
				if ( statement.preventsCollapsedReturns( returnStatements ) ) return true;
			}
		} else {
			if ( this.consequent.preventsCollapsedReturns( returnStatements ) ) return true;
		}

		if ( this.alternate ) {
			if ( this.alternate.type === 'ExpressionStatement' ) return false;
			if ( this.alternate.type === 'ReturnStatement' ) return returnStatements.push( this.alternate ), false;
			if ( this.alternate.type === 'IfStatement' ) return this.alternate.preventsCollapsedReturns( returnStatements );

			if ( this.alternate.type === 'BlockStatement' ) {
				for ( let statement of this.alternate.body ) {
					if ( statement.skip ) continue;
					if ( statement.preventsCollapsedReturns( returnStatements ) ) return true;
				}
			}

			else {
				if ( this.alternate.preventsCollapsedReturns( returnStatements ) ) return true;
			}
		}
	}

	rewriteAsLogicalExpression ( code, shouldParenthesiseTest, shouldParenthesiseConsequent ) {
		code.remove( this.start, this.test.start );

		if ( shouldParenthesiseTest ) this.test.parenthesize( code );
		if ( shouldParenthesiseConsequent ) this.consequent.parenthesize( code );

		code.overwrite( this.test.end, this.consequent.start, this.inverted ? '||' : '&&' );
	}

	rewriteAsTernaryExpression ( code, shouldParenthesiseTest, shouldParenthesiseConsequent ) {
		this.rewriteAsSequence = true;

		let shouldParenthesiseAlternate = false;
		// TODO simplify this
		if ( this.alternate.type === 'IfStatement' ) {
			shouldParenthesiseAlternate = false;
		} else if ( this.alternate.type === 'BlockStatement' ) {
			shouldParenthesiseAlternate = this.alternate.body.length > 1 || this.alternate.body[0].getPrecedence() < 4;
		} else {
			shouldParenthesiseAlternate = this.alternate.getPrecedence() < 4;
		}

		// if ( this.alternate.type === 'BlockStatement' ) {
		// 	if ( this.alternate.body.length > 1 ) {
		// 		shouldParenthesiseAlternate = true;
		// 	} else if ( this.alternate.body[0].type !== 'IfStatement' ) {
		// 		shouldParenthesiseAlternate = this.alternate.body[0].getPrecedence() < 4;
		// 	}
		// }

		// const shouldParenthesiseAlternate = this.alternate.type === 'BlockStatement' ?
		// 	( this.alternate.body.length === 1 ? getPrecedence( this.alternate.body[0] ) < 4 : true ) :
		// 	false; // TODO <-- is this right? Ternaries are r-to-l, so... maybe?

		if ( shouldParenthesiseTest ) this.test.parenthesize( code );
		if ( shouldParenthesiseConsequent ) this.consequent.parenthesize( code );
		if ( shouldParenthesiseAlternate ) this.alternate.parenthesize( code );

		code.remove( this.start, this.test.start );
		code.overwrite( this.test.end, this.consequent.start, '?' );

		let consequentEnd = this.consequent.end;
		while ( code.original[ consequentEnd - 1 ] === ';' ) consequentEnd -= 1;
		code.remove( consequentEnd, this.alternate.start );

		let alternateEnd = this.alternate.end;
		while ( code.original[ alternateEnd - 1 ] === ';' ) alternateEnd -= 1;

		if ( this.inverted ) {
			code.move( this.alternate.start, alternateEnd, this.consequent.start );
			code.move( this.consequent.start, consequentEnd, alternateEnd );

			code.prependRight( this.consequent.getLeftHandSide().start, ':' );
		} else {
			code.appendLeft( this.alternate.getLeftHandSide().start, ':' );
		}
	}
}
