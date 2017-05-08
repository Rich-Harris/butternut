module.exports = [
	{
		description: 'removes whitespace from ternary expression',

		input: `
			var a = x ?
				y :
				z;`,

		output: `var a=x?y:z`
	},

	{
		description: 'collapses statement if truthy',
		input: `var a = 2 > 1 ? foo() : bar()`,
		output: `var a=foo()`
	},

	{
		description: 'collapses statement if falsy',
		input: `var a = 1 > 2 ? foo() : bar()`,
		output: `var a=bar()`
	}
];
