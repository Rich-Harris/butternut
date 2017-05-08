import shouldRemoveParens from './shouldRemoveParens.js';

export default function getLeftHandSide ( node ) {
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