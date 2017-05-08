module.exports = [
	{
		description: 'removes whitespace after return if possible',
		input: `
			function foo () {
				return 'foo';
			}`,
		output: `function foo(){return'foo'}`
	},

	{
		description: 'enforces whitespace before no-longer-parenthesized expression',
		input: `
			function foo () {
				return(x);
			}`,
		output: `function foo(){return x}`
	}
];
