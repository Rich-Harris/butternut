module.exports = [
	{
		description: 'removes whitespace from assignment expressions',
		input: `a = 1`,
		output: `a=1`
	},

	{
		description: 'assigns binary expression to variable',
		input: `a = b !== c`,
		output: `a=b!==c`
	},

	{
		description: 'removes whitespace from logical expressions',
		input: `a = b || c`,
		output: `a=b||c`
	},

	{
		description: 'preserves whitespace around in',
		input: `var a = b in c`,
		output: `var a=b in c`
	},

	{
		description: 'preserves whitespace around instanceof',
		input: `var a = b instanceof c`,
		output: `var a=b instanceof c`
	},

	{
		description: 'rewrites && expression if value is known',
		input: `var a = false && true`,
		output: `var a=!1`
	},

	{
		description: 'rewrites || expression if value is known',
		input: `var a = false || true`,
		output: `var a=!0`
	}
];
