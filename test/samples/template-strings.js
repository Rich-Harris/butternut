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
	}
];
