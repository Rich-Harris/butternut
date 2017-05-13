module.exports = [
	{
		description: 'removes whitespace between statements',

		input: `
			var a=1;
			console.log(a);    `,

		output: `var a=1;console.log(a)`
	},
	{
		description: 'removes whitespace between statements without semis',
		input: `a()\nb()`,
		output: `a(),b()`
	},

	{
		description: 'removes whitespace inside a function block',

		input: `
			function foo ( a, b ) {
				console.log(a);
				console.log(b);
			}`,

		output: `function foo(a,b){console.log(a);console.log(b)}`
	},
	{
		description: 'removes whitespace inside a function expression block',

		input: `
			var foo = function foo ( a, b ) {
				console.log(a);
				console.log(b);
			}`,

		output: `var foo=function c(a,b){console.log(a);console.log(b)}`
	},
	{
		description: 'removes superfluous semis',
		input: `console.log(1);;;console.log(2);`,
		output: `console.log(1);console.log(2)`
	},
	{
		description: 'does not insert semicolon after function declaration',

		input: `
			function foo () {
				// code goes here
			}

			function bar () {
				// code goes here
			}`,

		output: `function foo(){}function bar(){}`
	},
	{
		description: 'does not insert semicolon after class declaration',

		input: `
			class Foo {
				// code goes here
			}

			class Bar {
				// code goes here
			}`,

		output: `class Foo{}class Bar{}`
	},

	{
		description: 'collapses truthy if statement',
		input: `if ( true ) console.log( 'a' )`,
		output: `console.log('a')`
	},

	{
		description: 'collapses truthy if statement with else',

		input: `
			if ( true ) {
				console.log( 'a' );
			} else {
				console.log( 'b' );
			}`,

		output: `console.log('a')`
	},

	{
		description: 'collapses falsy if statement',
		input: `before(); if ( false ) console.log( 'a' ); after()`,
		output:`before(),after()`
	},

	{
		description: 'removes dead code after truthy if statement with return',
		input: `
			function foo () {
				if ( true ) {
					console.log( 'a' );
					if ( true ) {
						console.log( 'b' );
						return;
					}
				}
				console.log( 'c' );
			}
			foo();`,
		output: `function foo(){console.log('a');console.log('b')}foo()`
	},

	{
		description: 'minifies try-catch',

		input: `
			try {
				foo();
			} catch ( a ) {
				console.error( a );
			}`,

		output: `try{foo()}catch(a){console.error(a)}`
	},

	{
		description: 'minifies try-finally',

		input: `
			try {
				foo();
			} finally {
				bar();
			}`,

		output: `try{foo()}finally{bar()}`
	},

	{
		description: 'minifies try-catch-finally',

		input: `
			try {
				foo();
			} catch ( a ) {
				console.error( a );
			} finally {
				bar();
			}`,

		output: `try{foo()}catch(a){console.error(a)}finally{bar()}`
	},

	{
		description: 'removes everything in blocks without statements',
		input: `// nothing here`,
		output: ``
	}
];
