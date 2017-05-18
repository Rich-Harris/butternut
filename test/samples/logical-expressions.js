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
	},

	{
		description: 'does not consider environment-specific methods when folding',
		input: `var includes = [].includes || function(x) { return this.indexOf(x) !== -1; };`,
		output: `var includes=[].includes||function(n){return this.indexOf(n)!==-1}`
	},

	{
		description: 'stringifies `null && ...` correctly',
		input: `var x = null && y`,
		output: `var x=null`
	}
];
