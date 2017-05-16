module.exports = [
	{
		description: 'rewrites `a = a + 1` as `a+=1`',
		input: `a = a + 1`,
		output: `a+=1`
	},

	{
		description: 'rewrites `a = a + a` as `a+=a`',
		input: `a = a + a`,
		output: `a+=a`
	},

	{
		description: 'does not rewrite `a = 1 + a` as `a+=1`, because it\'s not commutative',
		input: `a = 1 + a`,
		output: `a=1+a`
	},

	{
		description: 'rewrites `a = a - 1` as `a-=1`',
		input: `a = a - 1`,
		output: `a-=1`
	},

	{
		description: 'does not rewrite `a = 1 - a` as `a-=1`',
		input: `a = 1 - a`,
		output: `a=1-a`
	},

	{
		description: 'does not rewrite `a = a !== false` as `a!===!1`',
		input: `a = a !== false`,
		output: `a=a!==!1`
	},

	{
		description: 'rewrites arithmetic expression with value',
		input: `a = 1 + 2 * 3`,
		output: `a=7`
	},

	{
		description: 'rewrites arithmetic with non-simple values',
		input: `a = [ 1 ] + 2`,
		output: `a="12"`
	},

	{
		description: 'does not rewrite arithmetic with unknown but truthy values',
		input: `a = [ b ] + 2`,
		output: `a=[b]+2`
	},

	{
		description: 'preserves space before --x expression',
		input: `Math.sqrt(1 - --t * t)`,
		output: `Math.sqrt(1- --t*t)`
	},

	{
		description: 'preserves space before parenthesised --x expression',
		input: `Math.sqrt(1 - ((--t)) * t)`,
		output: `Math.sqrt(1- --t*t)`
	},

	{
		description: 'preserves space before parenthesised rewritten ternary --x expression',
		input: `Math.sqrt(1 - (true ? --t : t) * t)`,
		output: `Math.sqrt(1- --t*t)`
	},

	{
		description: 'preserves parens around unary expression on left hand side of exponentiation operator',
		input: `x = (-2) ** y`,
		output: `x=(-2)**y`
	}
];
