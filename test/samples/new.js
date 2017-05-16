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
	},

	{
		description: 'preserves parens around improbable callee',
		input: `new (-1 / 2)`,
		output: `new(-0.5)`
	}
];
