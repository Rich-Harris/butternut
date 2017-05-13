module.exports = [
	{
		description: 'removes whitespace at start of declaration',
		input: `var   a = 1`,
		output: `var a=1`
	},

	{
		description: 'removes whitespace inside declarators',
		input: `var  a = 1, b = 2; console.log( a, b )`,
		output: `var a=1,b=2;console.log(a,b)`
	},

	{
		description: 'combines adjacent var declarations',
		input: `
			var a = 1;
			var  b = 2;
			var c = 3;
			console.log( a, b, c );`,
		output: `var a=1,b=2,c=3;console.log(a,b,c)`
	},

	{
		description: 'combines adjacent const declarations (as let)',
		input: `
			const a = 1;
			const b =  2;
			const  c = 3;
			console.log( a, b, c );`,
		output: `let a=1,b=2,c=3;console.log(a,b,c)`
	},

	{
		skip: true,
		description: 'removes unused var in destructured declaration',
		input: `
			function x () {
				var { foo, bar } = baz;
				console.log( foo );
			}`,
		output: `function x(){var{foo:a}=baz;console.log(a)}`
	},

	{
		description: 'variable names that clash with function names are not considered duplicates',
		input: `
			var x = function thing ( scope ) {
				var thing = fn();
				return thing;
			};`,
		output: `var x=function(b){var a=fn();return a}`
	}
];
