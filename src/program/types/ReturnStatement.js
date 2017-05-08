import Node from '../Node.js';
import shouldRemoveParens from '../../utils/shouldRemoveParens.js';

const invalidChars = /[a-zA-Z$_0-9/]/;

function getLeftHandSide ( node ) {
	if ( node.left ) return getLeftHandSide( node.left );
	if ( node.type === 'ConditionalExpression' ) return getLeftHandSide( node.test );

	const parent = node.parent;

	while ( node.type === 'ParenthesizedExpression' ) {
		node = node.expression;
	}

	if ( node.type === 'ParenthesizedExpression' ) {
		if ( shouldRemoveParens( node.expression, parent ) ) return getLeftHandSide( node.expression );
		return node;
	}

	return node;
}

export default class ReturnStatement extends Node {
	minify ( code ) {
		if ( !this.argument ) return;

		const expression = getLeftHandSide( this.argument );

		const needsTrailingWhitespace = invalidChars.test( code.original[ expression.start ] );

		if ( needsTrailingWhitespace && this.argument.start === this.start + 6 ) {
			// ensure that parenthesized expression isn't too close
			code.appendLeft( this.start + 6, ' ' );
		}

		let c = this.start + ( needsTrailingWhitespace ? 7 : 6 );
		if ( this.argument.start > c ) {
			code.remove( c, this.argument.start );
		}

		this.argument.minify( code );
	}
}
