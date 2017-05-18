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
		output: `var x=function(r){var n=fn();return n}`
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
		output: `function foo(){var o;console.log(o);console.log(o)}`
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
		output: `function foo(){var o=1,g;console.log(o,g);console.log(o,g)}`
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
	},

	{
		description: 'inits with potential side-effects are preserved',
		input: `
			function foo () {
				var unused = mightHaveSideEffects()
			}`,
		output: `function foo(){mightHaveSideEffects()}`
	},

	{
		description: 'first declaration is unused',
		input: `
			function foo () {
				var unused = mightHaveSideEffects();
				var a = x();
				var b = y();
				console.log(a, b);
				console.log(a, b);
			}`,
		output: `function foo(){mightHaveSideEffects();var o=x(),g=y();console.log(o,g);console.log(o,g)}`
	},

	{
		description: 'middle declaration is unused',
		input: `
			function foo () {
				var a = x();
				var unused = mightHaveSideEffects();
				var b = y();
				console.log(a, b);
				console.log(a, b);
			}`,
		output: `function foo(){var o=x();mightHaveSideEffects();var g=y();console.log(o,g);console.log(o,g)}`
	},

	{
		description: 'last declaration is unused',
		input: `
			function foo () {
				var a = x();
				var b = y();
				var unused = mightHaveSideEffects();
				console.log(a, b);
				console.log(a, b);
			}`,
		output: `function foo(){var o=x(),g=y();mightHaveSideEffects();console.log(o,g);console.log(o,g)}`
	},

	{
		description: 'don\'t turn unused function expression into an illegal declaration',
		input: `
			function any_fn () {
				var any_value_1 = function(d) {}
				console.log(1);
			}`,
		output: `function any_fn(){console.log(1)}`
	}
];
