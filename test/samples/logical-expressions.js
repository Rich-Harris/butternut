module.exports = [
	{
		description: 'rewrites && expression if value is known',
		input: `var a = false && true`,
		output: `var a=!1`
	},

	{
		description: 'rewrites && expression if left value is known',
		input: `var a = true && false`,
		output: `var a=!1`
	},

	{
		description: 'rewrites && expression if left value is known and right is not minified',
		input: `var a = true && 0`,
		output: `var a=0`
	},

	{
		description: 'rewrites && expression if left value is truthy and right is unknown',
		input: `var a = true && b`,
		output: `var a=b`
	},

	{
		description: 'rewrites && expression if left value is falsy and right is unknown',
		input: `var a = false && b`,
		output: `var a=!1`
	},

	{
		description: 'rewrites || expression if value is known',
		input: `var a = false || true`,
		output: `var a=!0`
	},

	{
		description: 'rewrites || expression if left value is truthy',
		input: `var a = true || false`,
		output: `var a=!0`
	},

	{
		description: 'rewrites || expression if left value is truthy but not true',
		input: `var a = 1 || false`,
		output: 'var a=1'
	},

	{
		description: 'rewrites || expression if left value is truthy and right is unknown',
		input: `var a = true || b`,
		output: `var a=!0`
	},

	{
		description: 'rewrites || expression if left value is falsy and right is unknown',
		input: `var a = false || b`,
		output: `var a=b`
	}
];
