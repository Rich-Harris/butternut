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
	},

	{
		description: 'preserves shorthand property names',
		input: `
			function foo () {
				var longname = 1;
				var obj = {
					longname
				};

				console.log( obj );
			}`,
		output: `function foo(){var a=1,b={longname:a};console.log(b)}`
	},

	{
		description: 'removes whitespace around shorthand methods',
		input: `var obj = { foo () {} };`,
		output: `var obj={foo(){}}`
	}
];
