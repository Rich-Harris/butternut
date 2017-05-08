module.exports = [
	{
		description: 'removes whitespace in dot notation',

		input: `
			get('file.json')
				.then( JSON.parse )
				.then( log );`,

		output: `get('file.json').then(JSON.parse).then(log)`
	},

	{
		description: 'removes whitespace in array notation',
		input: `var a = foo [ bar ]`,
		output: `var a=foo[bar]`
	},

	{
		description: 'rewrites array notation as dot notation if possible',
		input: `var a = foo[ 'bar' ]`,
		output: `var a=foo.bar`
	},

	{
		description: 'rewrites array notation as dot notation if possible, with expressions',
		input: `var a = foo[ false || 'baz' ]`,
		output: `var a=foo.baz`
	},

	{
		description: 'rewrites array notation with numbers',
		input: `var a = foo[ '9' + '9' ]`,
		output: `var a=foo[99]`
	},

	{
		description: 'gets named property of string',
		input: `var chars = 'hello'.length`,
		output: `var chars=5`
	},

	{
		description: 'gets numeric property of string',
		input: `var char = 'hello'[0]`,
		output: `var char="h"`
	},

	{
		description: 'gets numeric property of array',
		input: `var char = [ 'h', 'e', 'l', 'l', 'o' ][0]`,
		output: `var char="h"`
	}

	// TODO computed properties, literals
];
