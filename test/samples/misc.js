module.exports = [
	{
		description: 'removes empty statements',
		input: 'foo();;;',
		output: 'foo()'
	},

	{
		description: 'prints negative zero correctly',
		input: 'var a=-0',
		output: 'var a=-0'
	},

	{
		description: 'handles weird \u2028 and \u2029 characters',
		input: `var ws = '\\u2028' + '\\u2029';`,
		output: `var ws="\\u2028\\u2029"`
	},

	{
		description: 'allows reserved words',
		input: `
			var obj = {
				await: function await () {}
			};`,
		output: `var obj={await:function(){}}`
	},

	{
		description: 'rewrites undefined',
		input: `x = undefined`,
		output: `x=void 0`
	},

	{
		description: 'rewrites infinity',
		input: `x = Infinity`,
		output: `x=1/0`
	},

	{
		description: 'rewrites negative infinity',
		input: `x = -Infinity`,
		output: `x=-1/0`
	}
];
