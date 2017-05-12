import Node from '../Node.js';
import { UNKNOWN } from '../../utils/sentinels.js';

const invalidChars = /[a-zA-Z$_0-9/]/;

function canRewriteBlockAsSequence ( body ) {
	let i = body.length;
	while ( i-- ) {
		const child = body[i];
		if ( child.type !== 'ExpressionStatement' /*&& child.type !== 'ReturnStatement'*/ ) {
			if ( child.type !== 'IfStatement' ) return false;
			if ( !canRewriteIfStatementAsSequence( child ) ) return false;
		}
	}

	return true;
}

function canRewriteIfStatementAsSequence ( node ) {
	if ( !canRewriteBlockAsSequence( node.consequent.body ) ) return false;

	if ( node.alternate ) {
		if ( node.alternate.type === 'IfStatement' ) {
			return canRewriteIfStatementAsSequence( node.alternate );
		}

		if ( node.alternate.type === 'BlockStatement' ) {
			if ( !canRewriteBlockAsSequence( node.alternate.body ) ) return false;
			return true;
		}

		return node.alternate.type === 'ExpressionStatement';
	}

	return true;
}

function isVarDeclaration ( node ) {
	return node.kind === 'var';
}

// TODO this whole thing is kinda messy... refactor it

export default class IfStatement extends Node {
	getRightHandSide () {
		// TODO what if we know the test value?
		if ( this.alternate ) return this.alternate.getRightHandSide();
		return this.consequent.getRightHandSide();
	}

	initialise () {
		this.rewriteConsequentAsSequence = canRewriteBlockAsSequence( this.consequent.body );
		this.rewriteAlternateAsSequence = !this.alternate ||
			( this.alternate.type === 'ExpressionStatement' ) ||
			( this.alternate.type === 'IfStatement' && canRewriteIfStatementAsSequence( this.alternate ) ) ||
			( this.alternate.type === 'BlockStatement' ) && canRewriteBlockAsSequence( this.alternate.body );

		this.rewriteAsSequence = this.rewriteConsequentAsSequence && this.rewriteAlternateAsSequence;

		const testValue = this.test.getValue();

		if ( testValue === UNKNOWN ) {
			// initialise everything
			this.test.initialise();
			this.consequent.initialise();
			if ( this.alternate ) this.alternate.initialise();

			if ( this.rewriteConsequentAsSequence || this.consequent.body.every( isVarDeclaration ) ) {
				this.consequent.removeCurlies = true;
			}

			if ( this.alternate ) {
				if ( this.rewriteAlternateAsSequence || isVarDeclaration( this.alternate ) || ( this.alternate.type === 'BlockStatement' && this.alternate.body.every( isVarDeclaration ) ) ) {
					this.alternate.removeCurlies = true;
				}
			}
		}

		else if ( testValue ) { // if ( true ) {...}
			this.consequent.initialise();

			// hoist any var declarations in the alternate, so we can
			// discard the whole thing
			if ( this.alternate ) {
				let varsToHoist = {};
				this.alternate.findVarDeclarations( varsToHoist );

				// TODO do something with varsToHoist
			}

			// TODO does this apply equally to else blocks?
			if ( !this.consequent.synthetic ) {
				// if there are no let/const/class/function declarations, we can
				// remove the curlies
				let removeCurlies = true;
				let i = this.consequent.body.length;
				while ( i-- ) {
					const node = this.consequent.body[i];
					if ( /Declaration/.test( node.type ) && node.kind !== 'var' ) {
						removeCurlies = false;
						break;
					}
				}

				this.consequent.removeCurlies = removeCurlies;
			}
		}

		else { // if ( false ) {...}
			if ( this.alternate ) {
				this.alternate.removeCurlies = this.rewriteAlternateAsSequence;
				this.alternate.initialise();
			} else {
				this.skip = true;
			}

			let varsToHoist = {};
			this.consequent.findVarDeclarations( varsToHoist );

			// TODO do something with varsToHoist
		}
	}

	minify ( code ) {
		const testValue = this.test.getValue();

		if ( testValue !== UNKNOWN ) {
			if ( testValue ) { // if ( true ) {...}
				if ( this.alternate ) {
					// TODO handle var declarations in alternate
					code.remove( this.consequent.end, this.end );
				}

				code.remove( this.start, this.consequent.start );
				this.consequent.minify( code );
			} else { // if ( false ) {...}
				// we know there's an alternate, otherwise we wouldn't be here
				this.alternate.minify( code );
				code.remove( this.start, this.alternate.start );
			}

			return;
		}

		this.test.minify( code );

		const inverted = this.test.type === 'UnaryExpression' && this.test.operator === '!';

		// if we're rewriting as &&, test must be higher precedence than 6
		// to avoid being wrapped in parens. If ternary, 4
		const targetPrecedence = this.alternate ? 4 : inverted ? 5 : 6;

		const shouldParenthesiseTest = this.test.getPrecedence() < targetPrecedence;
		const shouldParenthesiseConsequent = this.consequent.body.length === 1 ?
			this.consequent.body[0].getPrecedence() < targetPrecedence :
			true;

		// special case – empty if block
		if ( this.consequent.body.length === 0 ) {
			const canRemoveTest = this.test.type === 'Identifier' || this.test.getValue() !== UNKNOWN; // TODO can this ever happen?

			if ( this.alternate ) {
				this.alternate.minify( code );

				if ( this.alternate.type === 'BlockStatement' && this.alternate.body.length === 0 ) {
					if ( canRemoveTest ) {
						code.remove( this.start, this.end );
						this.removed = true;
					}
				} else if ( canRewriteIfStatementAsSequence( this ) ) {
					this.alternate.joinStatements = true;

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

					const shouldParenthesiseAlternate = alternatePrecedence < ( inverted ? 6 : 5 );
					if ( shouldParenthesiseAlternate ) {
						code.prependRight( this.alternate.start, '(' ).appendLeft( this.alternate.end, ')' );
					}

					if ( inverted ) code.remove( this.test.start, this.test.argument.start );
					code.remove( this.start, this.test.start );
					code.overwrite( this.test.end, this.alternate.start, inverted ? '&&' : '||' );
				} else {
					if ( inverted ) {
						code.overwrite( this.start + 2, this.test.argument.start, '(' );
					} else {
						code.overwrite( this.start + 2, this.test.start, '(!' );
					}

					code.overwrite( this.test.end, this.alternate.start, ')' );
				}
			} else {
				// TODO is `removed` still used?
				if ( canRemoveTest ) {
					code.remove( this.start, this.end );
					this.removed = true;
				} else {
					code.remove( this.start, this.test.start );
					code.remove( this.test.end, this.consequent.end );
				}
			}

			return;
		}

		// special case - empty else block
		if ( this.alternate && this.alternate.type === 'BlockStatement' && this.alternate.body.length === 0 ) {
			code.remove( this.consequent.end, this.end );

			if ( canRewriteIfStatementAsSequence( this ) ) {
				this.consequent.joinStatements = true;

				code.overwrite( this.start, ( inverted ? this.test.argument.start : this.test.start ), shouldParenthesiseTest ? '(' : '' );

				let replacement = shouldParenthesiseTest ? ')' : '';
				replacement += inverted ? '||' : '&&';
				if ( shouldParenthesiseConsequent ) replacement += '(';

				code.overwrite( this.test.end, this.consequent.start, replacement );

				if ( shouldParenthesiseConsequent ) code.appendRight( this.consequent.end, ')' );
			} else {
				if ( this.test.start > this.start + 3 ) code.overwrite( this.start, this.test.start, 'if(' );

				if ( this.consequent.start > this.test.end + 1 ) code.overwrite( this.test.end, this.consequent.start, ')' );
				if ( this.end > this.consequent.end + 1 ) code.remove( this.consequent.end, this.end - 1 );
			}

			// don't minify alternate
			this.consequent.minify( code );
			return;
		}

		this.consequent.minify( code );
		if ( this.alternate ) this.alternate.minify( code );

		if ( canRewriteIfStatementAsSequence( this ) ) {
			this.consequent.joinStatements = true;

			if ( inverted ) code.remove( this.test.start, this.test.start + 1 );

			if ( this.alternate ) {
				this.rewriteAsTernaryExpression( code, inverted, shouldParenthesiseTest, shouldParenthesiseConsequent );
			} else {
				this.rewriteAsLogicalExpression( code, inverted, shouldParenthesiseTest, shouldParenthesiseConsequent );
			}
		}

		else {
			if ( this.test.start > this.start + 3 ) code.overwrite( this.start + 2, this.test.start, '(' );
			if ( this.consequent.start > this.test.end + 1 ) code.overwrite( this.test.end, this.consequent.start, ')' );

			if ( this.alternate ) {
				const lastNodeOfConsequent = this.consequent.getRightHandSide();

				const firstNodeOfAlternate = ( this.alternate.type === 'BlockStatement' && this.alternate.removeCurlies ?
					this.alternate.body[0] :
					this.alternate ).getLeftHandSide();

				let gap = ( lastNodeOfConsequent.type === 'BlockStatement' ? '' : ';' ) + 'else';
				if ( invalidChars.test( code.original[ firstNodeOfAlternate.start ] ) ) gap += ' ';

				let c = this.consequent.end;
				while ( code.original[ c - 1 ] === ';' ) c -= 1;

				code.overwrite( c, this.alternate.start, gap );
			}
		}
	}

	preventsCollapsedReturns ( returnStatements ) {
		for ( let statement of this.consequent.body ) {
			if ( statement.skip ) continue;
			if ( statement.preventsCollapsedReturns( returnStatements ) ) return true;
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
		}
	}

	rewriteAsLogicalExpression ( code, inverted, shouldParenthesiseTest, shouldParenthesiseConsequent ) {
		this.rewriteAsSequence = true;

		code.overwrite( this.start, this.test.start, shouldParenthesiseTest ? '(' : '' );

		let replacement = ( shouldParenthesiseTest ? ')' : '' ) + ( inverted ? '||' : '&&' ) + ( shouldParenthesiseConsequent ? '(' : '' );
		code.overwrite( this.test.end, this.consequent.start, replacement );

		if ( shouldParenthesiseConsequent ) {
			let c = this.consequent.end;
			while ( code.original[ c - 1 ] === ';' ) c -= 1;
			code.appendLeft( c, ')' );
		}
	}

	rewriteAsTernaryExpression ( code, inverted, shouldParenthesiseTest, shouldParenthesiseConsequent ) {
		this.rewriteAsSequence = true;

		this.alternate.joinStatements = true;

		let shouldParenthesiseAlternate = false;
		if ( this.alternate.type === 'BlockStatement' ) {
			if ( this.alternate.body.length > 1 ) {
				shouldParenthesiseAlternate = true;
			} else if ( this.alternate.body[0].type !== 'IfStatement' ) {
				shouldParenthesiseAlternate = this.alternate.body[0].getPrecedence() < 4;
			}
		}
		// const shouldParenthesiseAlternate = this.alternate.type === 'BlockStatement' ?
		// 	( this.alternate.body.length === 1 ? getPrecedence( this.alternate.body[0] ) < 4 : true ) :
		// 	false; // TODO <-- is this right? Ternaries are r-to-l, so... maybe?

		code.overwrite( this.start, this.test.start, shouldParenthesiseTest ? '(' : '' );

		let replacement = shouldParenthesiseTest ? ')?' : '?';
		if ( inverted && shouldParenthesiseAlternate ) replacement += '(';
		if ( !inverted && shouldParenthesiseConsequent ) replacement += '(';

		code.overwrite( this.test.end, this.consequent.start, replacement );

		let consequentEnd = this.consequent.end;
		while ( code.original[ consequentEnd - 1 ] === ';' ) consequentEnd -= 1;

		let alternateEnd = this.alternate.end;
		while ( code.original[ alternateEnd - 1 ] === ';' ) alternateEnd -= 1;

		code.remove( consequentEnd, this.alternate.start );

		if ( inverted ) {
			let alternateEnd = this.alternate.end;
			while ( code.original[ alternateEnd - 1 ] === ';' ) alternateEnd -= 1;

			let consequentEnd = this.consequent.end;
			while ( code.original[ consequentEnd - 1 ] === ';' ) consequentEnd -= 1;

			code.move( this.alternate.start, alternateEnd, this.consequent.start );
			code.move( this.consequent.start, consequentEnd, alternateEnd );

			let replacement = shouldParenthesiseAlternate ? '):' : ':';
			if ( shouldParenthesiseConsequent ) replacement += '(';

			code.prependRight( this.consequent.start, replacement );

			if ( shouldParenthesiseConsequent ) code.appendLeft( consequentEnd, ')' );
		} else {
			let replacement = shouldParenthesiseConsequent ? '):' : ':';
			if ( shouldParenthesiseAlternate ) replacement += '(';

			code.appendLeft( this.consequent.end, replacement );

			let c = this.alternate.end;
			while ( code.original[ c - 1 ] === ';' ) c -= 1;
			if ( shouldParenthesiseAlternate ) code.appendLeft( c, ')' );
		}
	}
}
