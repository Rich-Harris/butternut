module.exports = [
	{
		description: 'removes whitespace in unary expression',
		input: `! x`,
		output: `!x`
	},

	{
		description: 'only removes excess whitespace in typeof expression',
		input: `typeof  banana`,
		output: `typeof banana`
	}
];
