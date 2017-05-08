module.exports = [
	{
		description: 'removes whitespace before and after parens',
		input: `function foo () {}`,
		output: `function foo(){}`
	},
	{
		description: 'removes whitespace inside parens',
		input: `function foo( a, b , c ){console.log(a,b,c)}`,
		output: `function foo(a,b,c){console.log(a,b,c)}`
	},
	{
		description: 'removes whitespace from anonymous function expression',
		input: `call(function ( a, b , c ){console.log(a,b,c)})`,
		output: `call(function(a,b,c){console.log(a,b,c)})`
	}
];
