module.exports = [
	{
		description: 'minifies template string elements',
		input: 'var str = `foo${  bar  }baz${  qux  }lol`;',
		output: 'var str=`foo${bar}baz${qux}lol`'
	},

	{
		description: 'minifies template string element at start',
		input: 'var str = `${  bar  }baz${  qux  }lol`;',
		output: 'var str=`${bar}baz${qux}lol`'
	},

	{
		description: 'minifies template string element at end',
		input: 'var str = `foo${  bar  }baz${  qux  }`;',
		output: 'var str=`foo${bar}baz${qux}`'
	},

	{
		description: 'minifies expressions in template string elements',
		input: '`${a  +  b}`',
		output: '`${a+b}`'
	},

	{
		description: 'minifies expressions in tagged template string elements',
		input: 'x`${  a  +  b  }`',
		output: 'x`${a+b}`'
	},

	{
		description: 'folds in known values',
		input: '`3 * 3 = ${3 * 3}, x * x = ${x * x}`',
		output: '`3 * 3 = 9, x * x = ${x*x}`'
	},

	{
		description: 'folds in known values at start',
		input: '`${3 * 3} = 3 * 3, x * x = ${x * x}`',
		output: '`9 = 3 * 3, x * x = ${x*x}`'
	},

	{
		description: 'folds in known values at end',
		input: '`x * x = ${x * x}, 3 * 3 = ${3 * 3}`',
		output: '`x * x = ${x*x}, 3 * 3 = 9`'
	},

	{
		description: 'does not fold tagged template literals',
		input: 'foo`bar`',
		output: 'foo`bar`'
	},

	{
		description: 'minifies tagged template literals',
		input: 'foo   `bar`',
		output: 'foo`bar`'
	}
];
