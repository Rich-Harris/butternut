module.exports = [
	{
		description: 'removes whitespace before parens',
		input: `new Foo (bar)`,
		output: `new Foo(bar)`
	},

	{
		description: 'removes whitespace inside parens',
		input: `new Foo( a, b , c )`,
		output: `new Foo(a,b,c)`
	},

	{
		description: 'preserves parens around improbable callee',
		input: `new (-1 / 2)`,
		// TODO remove space
		output: `new (-.5)`
	},

	{
		description: 'removes parens from new expression without params',
		input: `x = new Foo()`,
		output: `x=new Foo`
	}
];
