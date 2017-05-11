module.exports = [
	{
		description: 'removes whitespace before parens',
		input: `new Foo ()`,
		output: `new Foo()`
	},

	{
		description: 'removes whitespace inside parens',
		input: `new Foo( a, b , c )`,
		output: `new Foo(a,b,c)`
	}
];
