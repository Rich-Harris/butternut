module.exports = [
	{
		description: 'does not mangle top-level variables',
		input: `var longname;console.log(longname)`,
		output: `var longname;console.log(longname)`
	},

	{
		description: 'mangles variables declared in function',
		input: `fn=function(){var longname;console.log(longname)}`,
		output: `fn=function(){var a;console.log(a)}`
	},

	{
		description: 'mangles function parameters',
		input: `fn=function(longname){console.log(longname)}`,
		output: `fn=function(a){console.log(a)}`
	},

	{
		description: 'reuses short names',
		input: `
			function foo ( first ) {
				console.log( first );
				return function ( second ) {
					console.log( second );
				};
			}

			function bar ( third ) {
				console.log( third );
			}

			foo();
			bar();`,
		output: `function foo(a){console.log(a);return function(a){console.log(a)}}function bar(a){console.log(a)}foo();bar()`
	},

	{
		description: 'mangled names do not shadow each other',
		input: `
			function foo ( first ) {
				return function ( second ) {
					return first + second;
				};
			}
			foo()`,
		output: `function foo(a){return function(b){return a+b}}foo()`
	},

	{
		description: 'function expression IDs are mangled',
		input: `
			function foo () {
				return function baz () {
					// code goes here
				}
			}
			foo()`,
		output: `function foo(){return function a(){}}foo()`
	},

	{
		description: 'function names are mangled in call expressions',
		input: `
			(function () {
				function foo () {
					bar();
				}

				function bar() {}

				foo();
			}());`,
		output: `!function(){function a(){b()}function b(){}a()}()`
	},

	{
		description: 'mangles catch clause argument',
		input: `
			try {
				foo();
			} catch ( err ) {
				console.error( err )
			}`,
		output: `try{foo()}catch(a){console.error(a)}`
	},

	{
		description: 'mangles function IDs consistently',
		input: `
			(function () {
				function Foo () {}
				function bar ( bar ) {}
				Foo.prototype.bar = bar;
			}());`,
		output: `!function(){function a(){}function b(a){}a.prototype.bar=b}()`
	},

	{
		description: 'does not mangle top-level function IDs',
		input: `
			function Foo () {}
			function bar ( bar ) {}
			Foo.prototype.bar = bar;`,
		output: `function Foo(){}function bar(a){}Foo.prototype.bar=bar`
	}
	// {
	// 	solo: true,
	// 	description: 'function expression IDs are mangled',
	//
	// 	input: `
	// 		function foo () {
	// 			return function baz ( i ) {
	// 				if ( i-- ) baz( i );
	// 			}
	// 		}`,
	//
	// 	output: `function foo(){return function a(b){b--&&a(b)}}`
	// },
	// {
	// 	description: 'mangled function declarations can still be called',
	//
	// 	input: `
	// 		function foo () {
	// 			function bar () {
	// 				// code goes here
	// 			}
	//
	// 			return function baz () {
	// 				bar();
	// 			}
	// 		}`,
	//
	// 	output: `function foo(){function a(){}return function b(){a()}}`
	// }
];
