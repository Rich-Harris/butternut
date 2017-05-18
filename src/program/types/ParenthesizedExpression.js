import Node from '../Node.js';

function shouldRemoveParens ( expression, parent ) {
	if ( /^Object/.test( expression.getLeftHandSide().type ) || /^Object/.test( expression.getRightHandSide().type ) ) {
		return false;
	}

	if ( expression.type === 'CallExpression' ) {
		return expression.callee.type === 'FunctionExpression' && parent.type === 'ExpressionStatement';
	}

	if ( expression.type === 'FunctionExpression' ) {
		return (
			( parent.type === 'CallExpression' && parent.parent.type === 'ExpressionStatement' ) ||
			( parent.type === 'ExpressionStatement' && parent.parent.type === 'CallExpression' )
		);
	}

	// special case — `(-x)**y`
	if ( expression.type === 'UnaryExpression' && parent.type === 'BinaryExpression' && parent.operator === '**' ) {
		if ( parent.left.contains( expression ) ) return false;
	}

	const expressionPrecedence = expression.getPrecedence();
	const parentPrecedence = parent.getPrecedence();

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

	getRightHandSide () {
		let node = this;

		while ( node.type === 'ParenthesizedExpression' ) {
			node = node.expression;
		}

		if ( shouldRemoveParens( node, this.parent ) ) return node.getRightHandSide();
		return node.parent;
	}

	getPrecedence () {
		return 20;
	}

	getValue () {
		return this.expression.getValue();
	}

	minify ( code, chars ) {
		let start = this.start;
		let end = this.end;
		let parent = this.parent;

		let expression = this.expression;
		while ( expression.type === 'ParenthesizedExpression' ) expression = expression.expression;

		if ( shouldRemoveParens( expression, parent ) ) {
			code.remove( start, expression.start );
			code.remove( expression.end, end );
		} else {
			if ( expression.start > this.start + 1 ) code.remove( this.start + 1, expression.start );
			if ( this.end > expression.end + 1 ) code.remove( expression.end, this.end - 1 );
		}

		// special case (?) – IIFE
		if (
			(
				this.parent.type === 'CallExpression' &&
				this.parent.parent.type === 'ExpressionStatement' &&
				expression.type === 'FunctionExpression'
			) ||
			(
				this.parent.type === 'ExpressionStatement' &&
				expression.type === 'CallExpression' &&
				expression.callee.type === 'FunctionExpression'
			)
		) {
			expression.prepend( code, '!' ); // could be any unary operator – uglify uses !
		}

		expression.minify( code, chars );
	}
}
