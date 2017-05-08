import Node from '../Node.js';
import shouldRemoveParens from '../../utils/shouldRemoveParens.js';

export default class ParenthesizedExpression extends Node {
	getValue () {
		return this.expression.getValue();
	}

	minify ( code ) {
		let parent = this.parent;

		let expression = this.expression;
		while ( expression.type === 'ParenthesizedExpression' ) {
			code.remove( this.start, expression.start );
			code.remove( expression.end, this.end );
			expression = expression.expression;
		}

		if ( shouldRemoveParens( expression, parent ) ) {
			code.remove( this.start, expression.start );
			code.remove( expression.end, this.end );
		} else {
			if ( expression.start > this.start + 1 ) code.remove( this.start + 1, expression.start );
			if ( this.end > expression.end + 1 ) code.remove( expression.end, this.end - 1 );
		}

		// special case (?) – IIFE
		if (
			(
				this.parent.type === 'CallExpression' &&
				this.parent.parent.type === 'ExpressionStatement' &&
				/FunctionExpression/.test( expression.type )
			) ||
			(
				this.parent.type === 'ExpressionStatement' &&
				expression.type === 'CallExpression' &&
				/FunctionExpression/.test( expression.callee.type )
			)
		) {
			code.prependRight( this.start, '!' ); // could be any unary operator – uglify uses !
		}

		expression.minify( code );
	}
}
