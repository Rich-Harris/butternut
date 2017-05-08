import Node from '../Node.js';
import getPrecedence from '../../utils/getPrecedence.js';

function shouldRemoveParens ( expression, parent ) {
	const expressionPrecedence = getPrecedence( expression );
	const parentPrecedence = getPrecedence( parent );

	if ( expression.type === 'FunctionExpression' ) {
		return (
			( parent.type === 'CallExpression' && parent.parent.type === 'ExpressionStatement' ) ||
			( parent.type === 'ExpressionStatement' && parent.parent.type === 'CallExpression' )
		);
	}

	if ( parentPrecedence > expressionPrecedence ) return false;
	if ( expressionPrecedence > parentPrecedence ) return true;

	if ( expression.type === 'UnaryExpression' ) return true;
	if ( expression.type === 'AssignmentExpression' ) return true;
	if ( expression.type === 'LogicalExpression' || expression.type === 'BinaryExpression' ) {
		return ( parent.operator === '**' ? parent.right : parent.left ).contains( expression );
	}
}

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
