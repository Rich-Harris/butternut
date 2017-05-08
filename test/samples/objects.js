module.exports = [
	{
		description: 'removes whitespace in object literals',

		input: `
			var obj = {
				foo: bar,
				baz: { lol: 'wut' }
			};`,

		output: `var obj={foo:bar,baz:{lol:'wut'}}`
	},
	{
		description: 'removes whitespace inside computed property brackets',
		input: `var obj = { [ foo ] : bar }`,
		output: `var obj={[foo]:bar}`
	}
];
