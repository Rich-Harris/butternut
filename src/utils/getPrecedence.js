let binaryExpressionPrecedence = {};
[
	[  3, '= += -= **= *= /= %= <<= >>= >>>= &= ^= |=' ],
	[  5, '||' ],
	[  6, '&&' ],
	[  7, '|' ],
	[  8, '^' ],
	[  9, '&' ],
	[ 10, '!== === != ==' ],
	[ 11, 'instanceof in >= > <= <' ],
	[ 12, '>>> >> <<' ],
	[ 13, '- +' ],
	[ 14, '% / * **' ]
].forEach( ([ precedence, operators ]) => {
	operators.split( ' ' ).forEach( operator => binaryExpressionPrecedence[ operator ] = precedence );
});

export default function getPrecedence ( node ) {
	if ( node.type === 'ExpressionStatement' ) node = node.expression;

	if ( node.type === 'Literal' || node.type === 'Identifier' || node.type === 'FunctionExpression' ) return 20;

	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence
	if ( node.type === 'MemberExpression' ) return 18;
	if ( node.type === 'NewExpression' ) return node.end > node.callee.end ? 18 : 17;
	if ( node.type === 'CallExpression' ) return 17;
	if ( node.type === 'UpdateExpression' ) return node.prefix ? 15 : 16;
	if ( node.type === 'UnaryExpression' ) return 15;
	if ( node.type === 'BinaryExpression' || node.type === 'LogicalExpression' ) return binaryExpressionPrecedence[ node.operator ];
	if ( node.type === 'ConditionalExpression' ) return 4;
	if ( node.type === 'YieldExpression' ) return 2;
	if ( node.type === 'SpreadElement' ) return 1;
	if ( node.type === 'SequenceExpression' ) return 0;

	// throw new Error( 'Unhandled parenthesized expression' );
	return 0;
}
