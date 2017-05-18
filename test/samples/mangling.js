module.exports = [
	{
		description: 'does not mangle top-level variables',
		input: `var longname;console.log(longname)`,
		output: `var longname;console.log(longname)`
	},

	{
		description: 'mangles variables declared in function',
		input: `fn=function(){var longname;console.log(longname)}`,
		output: `fn=function(){var n;console.log(n)}`
	},

	{
		description: 'mangles function parameters',
		input: `fn=function(longname){console.log(longname)}`,
		output: `fn=function(n){console.log(n)}`
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
		output: `function foo(n){console.log(n);return function(n){console.log(n)}}function bar(n){console.log(n)}foo();bar()`
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
		output: `function foo(n){return function(r){return n+r}}foo()`
	},

	{
		description: 'function expression IDs are mangled',
		input: `
			function foo () {
				return function baz (x) {
					if (x > 0) baz(x - 1);
				}
			}
			foo()`,
		output: `function foo(){return function n(t){t>0&&n(t-1)}}foo()`
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
		output: `!function(){function n(){c()}function c(){}n()}()`
	},

	{
		description: 'mangles catch clause argument',
		input: `
			try {
				foo();
			} catch ( err ) {
				console.error( err )
			}`,
		output: `try{foo()}catch(r){console.error(r)}`
	},

	{
		description: 'mangles function IDs consistently',
		input: `
			(function () {
				function Foo () {}
				function bar ( bar ) {}
				Foo.prototype.bar = bar;
			}());`,
		output: `!function(){function n(){}function o(n){}n.prototype.bar=o}()`
	},

	{
		description: 'does not mangle top-level function IDs',
		input: `
			function Foo () {}
			function bar ( bar ) {}
			Foo.prototype.bar = bar;`,
		output: `function Foo(){}function bar(n){}Foo.prototype.bar=bar`
	},

	{
		description: 'disregards unused vars for mangling',
		input: `
			function foo () {
				var bar = 1;
				var baz = 2;
				var bop = 3;

				console.log( bop );
			}`,
		output: `function foo(){var n=3;console.log(n)}`
	}
];
