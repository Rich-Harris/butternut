module.exports = [
	{
		description: 'folds exponentiation',
		input: `x = 2 ** 3`,
		output: `x=8`
	},

	{
		description: 'stringifies infinity',
		input: `x = 9e999 * 9e999;`,
		output: `x=Infinity`
	},

	{
		description: 'stringifies negative infinity',
		input: `x = -9e999 * 9e999;`,
		output: `x=-Infinity`
	}
];