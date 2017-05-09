import Node from '../Node.js';

function shouldRemoveParens ( expression, parent ) {
	const expressionPrecedence = expression.getPrecedence();
	const parentPrecedence = parent.getPrecedence();

	if ( expression.type === 'CallExpression' ) {
		return expression.callee.type === 'FunctionExpression'; // TODO is this right?
	}

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
	getLeftHandSide () {
		let node = this;

		while ( node.type === 'ParenthesizedExpression' ) {
			node = node.expression;
		}

		if ( shouldRemoveParens( node, this.parent ) ) return node.getLeftHandSide();
		return node.parent;
	}

	getValue () {
		return this.expression.getValue();
	}

	minify ( code ) {
		let parent = this.parent;

		// TODO we can do two remove operations — one at the start, one at the
		// end. don't need to do it on each descent

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
