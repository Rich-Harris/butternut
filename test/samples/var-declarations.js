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
		idempotent: false,
		input: `
			var x = function thing ( scope ) {
				var thing = fn();
				return thing;
			};`,
		output: `var x=function(b){var a=fn();return a}`
	},

	{
		description: 'preserves var declarations in removed blocks',
		input: `
			function foo () {
				if(false) {
					var x = 1;
				}
				console.log(x);
				console.log(x);
			}`,
		output: `function foo(){var a;console.log(a);console.log(a)}`
	},

	{
		description: 'merges var declarations in removed blocks with non-removed declarations',
		input: `
			function foo () {
				var x = 1;
				if(false) {
					var y = 2;
					var z = 3; // unused, should be removed
				}
				console.log(x, y);
				console.log(x, y);
			}`,
		output: `function foo(){var a=1,b;console.log(a,b);console.log(a,b)}`
	},

	{
		description: 'preserves var declarations in removed blocks at top level',
		input: `
			if(false) {
				var x = 1;
			}
			console.log(x);
			console.log(x);`,
		output: `var x;console.log(x),console.log(x)`
	},

	{
		description: 'merges var declarations in removed blocks with non-removed declarations at top level',
		input: `
			var x = 1;
			if(false) {
				var y = 2;
				var z = 3; // unused, but is top-level so should be preserved
			}
			console.log(x, y);
			console.log(x, y);`,
		output: `var x=1,y,z;console.log(x,y);console.log(x,y)`
	}
];
