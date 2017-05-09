export default function shouldRemoveParens ( expression, parent ) {
	const expressionPrecedence = expression.getPrecedence();
	const parentPrecedence = parent.getPrecedence();

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