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
	},

	{
		description: 'minifies async method',
		input: `
			var obj = {
				async   foo  () {

				}
			}`,
		output: `var obj={async foo(){}}`
	},

	{
		description: 'preserves parens around object literals',
		input: `
			if (true && {}.foo) {
				bar();
			}`,
		output: `({}.foo)&&bar()`
	},

	{
		description: 'preserves parens around object patterns',
		input: `({ foo, bar, baz } = obj);`,
		output: `({foo,bar,baz}=obj)`
	},

	{
		description: 'minifies getters and setters',
		input: `
			obj = {
				get  bar  () {},
				set  bar  (val) {}
			}`,
		output: `obj={get bar(){},set bar(a){}}`
	}
];
