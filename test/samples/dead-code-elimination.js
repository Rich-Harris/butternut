module.exports = [
	{
		description: 'removes statements after a return',
		input: `
			function foo () {
				console.log( 'a' );
				return;
				console.log( 'b' );
			}`,
		output: `function foo(){console.log('a')}`
	},

	{
		description: 'preserves variable declarations after a return',
		input: `
			function foo () {
				x = 42;
				console.log( x );
				return;
				console.log( 'b' );
				var x;
			}`,
		output: `function foo(){a=42;console.log(a);return;var a}`
	},

	{
		description: 'preserves function declarations after a return',
		input: `
			function foo () {
				bar();

				return;

				function bar () {
					console.log( 'bar' );
				}
			}`,
		output: `function foo(){a();return;function a(){console.log('bar')}}`
	},

	{
		description: 'removes unused vars from end of declaration',
		input: `
			function foo () {
				var a = 1, b = 2, c = 3;
				console.log( a, b );
			}`,
		output: `function foo(){var a=1,b=2;console.log(a,b)}`
	},

	{
		description: 'removes unused vars from middle of declaration',
		input: `
			function foo () {
				var a = 1, b = 2, c = 3;
				console.log( a, c );
			}`,
		output: `function foo(){var a=1,c=3;console.log(a,c)}`
	},

	{
		description: 'removes unused vars from start of declaration',
		input: `
			function foo () {
				var a = 1, b = 2, c = 3;
				console.log( b, c );
			}`,
		output: `function foo(){var b=2,c=3;console.log(b,c)}`
	},

	{
		description: 'removes unused declaration',
		input: `
			function foo () {
				var a = 1;
				console.log( 'hello' );
			}`,
		output: `function foo(){console.log('hello')}`
	},

	{
		description: 'unused function declaration is removed',
		input: `
			function foo () {
				before();
				var bar = 'x';
				function baz () {
					console.log( bar );
				}
				after();
			}`,
		output: `function foo(){before();after()}`
	},

	{
		description: 'removes curlies around else-block in if-statement with falsy condition',
		input: `
			if ( "development" === "production" ) {
				console.log( "running in development mode" );
			} else {
				console.log( "running in production mode" );
			}`,
		output: `console.log("running in production mode")`
	},

	{
		description: 'removes side-effect-free statement',
		input: `"use strict"; 1; "test"; foo(); null; bar();`,
		output: `"use strict";foo();bar()`
	}

	// TODO uncalled functions, unused variables...
];
