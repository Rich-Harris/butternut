module.exports = [
	{
		description: 'removes whitespace in unary expression',
		input: `foo = ! x`,
		output: `foo=!x`
	},

	{
		description: 'only removes excess whitespace in typeof expression',
		input: `foo = typeof  banana`,
		output: `foo=typeof banana`
	},

	{
		description: 'inserts whitespace after typeof with parenthesized argument',
		input: `foo = typeof(x)`,
		output: `foo=typeof x`
	}
];
