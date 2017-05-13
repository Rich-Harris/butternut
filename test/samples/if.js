module.exports = [
	{
		description: 'replaces if with &&',
		input: `
			if ( foo ) {
				bar();
				baz();
			}`,
		output: `foo&&(bar(),baz())`
	},

	{
		description: 'replaces if with ||',
		input: `
			if ( !foo ) {
				bar();
				baz();
			}`,
		output: `foo||(bar(),baz())`
	},

	{
		description: 'replaces body-less if with &&',
		input: `if ( foo ) bar()`,
		output: `foo&&bar()`
	},

	{
		description: 'replaces if-else with ternary',
		input: `
			if ( foo ) {
				bar()
			} else {
				baz();
			}`,
		output: `foo?bar():baz()`
	},

	{
		description: 'replaces if-else with backwards ternary',
		input: `
			if ( !foo ) {
				bar()
			} else {
				baz();
			}`,
		output: `foo?baz():bar()`
	},

	{
		description: 'replaces if-else-if with ternaries',
		input: `
			if ( foo ) {
				bar()
			} else if ( baz ) {
				qux();
			} else {
				lol()
			}`,
		output: `foo?bar():baz?qux():lol()`
	},

	{
		description: 'does not rewrite as && if statement contains declaration',
		input: `
			if ( foo ) {
				var bar = 1;
				console.log( bar );
			}`,
		output: `if(foo){var bar=1;console.log(bar)}`
	},

	{
		description: 'does not rewrite as ternary if statement contains declaration',
		input: `
			if ( foo ) {
				var bar = 1;
				console.log( bar );
			} else {
				var baz = 2;
				console.log( baz );
			}`,
		output: `if(foo){var bar=1;console.log(bar)}else{var baz=2;console.log(baz)}`
	},

	{
		description: 'parenthesizes body of && statement',
		input: `if ( foo === bar ) { baz = 1 }`,
		output: `foo===bar&&(baz=1)`
	},

	{
		description: 'parenthesizes body of body-less && statement',
		input: `if ( foo === bar ) baz = 1`,
		output: `foo===bar&&(baz=1)`
	},

	{
		description: 'parenthesizes body of body-less && statement inside block',
		input: `
			function foo () {
				if ( lol ) wut = {};
			}
			foo()`,
		output: `function foo(){lol&&(wut={})}foo()`
	},

	{
		skip: true,
		description: 'collapses multiple return statements',
		input: `
			function foo ( a ) {
				if ( a > 1e6 ) return 'millions';
				if ( a > 1e3 ) return 'thousands';
				return 'ones';
			}
			foo()`,
		output: `function foo(a){return a>1e6?'millions':a>1e3?'thousands':'ones'}foo()`
	},

	{
		skip: true,
		description: 'collapses early return',
		input: `
			function foo () {
				if ( x ) return;
				console.log( 42 );
			}`,
		output: `function foo(){x||console.log(42)}`
	},

	{
		skip: true,
		description: 'collapses early return with sibling statement',
		input: `
			function foo () {
				if ( x ) {
					console.log( 'returning early' );
					return;
				}
				console.log( 42 );
			}`,
		output: `function foo(){x&&(console.log('returning early'),1)||console.log(42)}`
	},

	{
		description: 'parenthesizes both parts of a ternary, if necessary',
		input: `
			if ( foo ) {
				a = b;
			} else {
				a = c;
			}`,
		output: `foo?(a=b):(a=c)`
	},

	{
		description: 'parenthesizes both parts of an inverted ternary, if necessary',
		input: `
			if ( !foo ) {
				a = b;
			} else {
				a = c;
			}`,
		output: `foo?(a=c):(a=b)`
	},

	{
		description: 'removes empty if block',
		input: `if ( foo() ) {}`,
		output: `foo()`
	},

	{
		description: 'removes empty if block with removable test',
		input: `before(); if ( foo ) {} after();`,
		output: `before(),after()`
	},

	{
		description: 'removes empty if block in if-else',
		input: `if ( foo () ) {} else { bar() }`,
		output: `foo()||bar()`
	},

	{
		description: 'removes empty if block in complex if-else',
		input: `if ( foo () ) {} else { var bar = 'baz'; }`,
		output: `if(!foo())var bar='baz'`
	},

	{
		description: 'removes statement in empty if block if possible',
		input: `if ( foo ) {}`,
		output: ``
	},

	{
		description: 'removes empty else in if block',
		input: `
			if ( foo ) {
				bar();
			} else {
				// code goes here
			}`,
		output: `foo&&bar()`
	},

	{
		description: 'removes empty else in complex if block',
		input: `
			if ( foo ) {
				var bar = baz;
			} else {
				// code goes here
			}`,
		output: `if(foo)var bar=baz`
	},

	{
		description: 'removes unnecessary curlies with else block',
		input: `if ( foo ) { var x = y } else { z() }`,
		output: `if(foo)var x=y;else z()`
	},

	{
		description: 'removes unnecessary curlies with collapsed vars in else block',
		input: `if ( foo ) { var x = y; var z = x; } else { z() }`,
		output: `if(foo)var x=y,z=x;else z()`
	},

	{
		description: 'preserves necessary curlies with else block',
		input: `if ( foo ) { let answer = 42; console.log( answer ); } else { z() }`,
		output: `if(foo){let a=42;console.log(a)}else z()`
	},

	{
		description: 'removes semis from blockless bodies in ternaries',
		input: `
			if ( a() ) b();
			else if ( c() ) d();`,
		output: `a()?b():c()&&d()`
	},

	{
		description: 'removes semis from blockless bodies in inverted ternaries',
		input: `
			if ( !a() ) b();
			else if ( c() ) d();`,
		output: `a()?c()&&d():b()`
	},

	{
		description: 'removes semis from blockless bodies in else-if ternaries',
		input: `
			if ( a() ) b();
			else c();`,
		output: `a()?b():c()`
	},

	{
		description: 'omits semicolon after if block',
		input: `
			if ( x ) {
				var a = 1;
				console.log( a );
			}

			y();`,
		output: `if(x){var a=1;console.log(a)}y()`
	},

	{
		description: 'omits semicolon after else block',
		input: `
			if ( x ) {
				y();
			} else {
				var a = 1;
				console.log( a );
			}

			z();`,
		output: `if(x)y();else{var a=1;console.log(a)}z()`
	},

	{
		description: 'allows empty else block with parenthesised if block',
		input: `
			if ( foo ) {
				a = b;
			}

			else {
				// empty
			}`,
		output: `foo&&(a=b)`
	},

	{
		description: 'parenthesises consequent ternary with empty if block',
		input: `
			if ( foo ) {
				// empty
			} else if ( bar ) {
				baz();
			} else {
				qux();
			}`,
		output: `foo||(bar?baz():qux())`
	},

	{
		description: 'if inside else',
		input: `
			if ( a ) {
				foo();
			} else {
				if ( b ) {
					bar();
				} else {
					baz()
				}
			}`,
		output: `a?foo():b?bar():baz()`
	},

	{
		description: 'adds semi-colon after rewritten if block',
		input: `
			function foo ( x ) {
				if ( bar ) {
					baz( x );
				}

				return x;
			}

			foo( x );`,
		output: `function foo(a){bar&&baz(a);return a}foo(x)`
	},

	{
		description: 'adds semi after synthetic body',
		input: `
			function foo ( a, b, c ) {
				if ( a === b ) return null;

				if ( c ) {
					var d = c + 1;
					console.log( d );
				}
			}

			foo()`,
		output: `function foo(a,b,c){if(a===b)return null;if(c){var d=c+1;console.log(d)}}foo()`
	},

	{
		description: 'separates if from else',
		input: `
			if ( a ) {
				foo();
			} else if ( b ) {
				var x = y;
			}`,
		output: `if(a)foo();else if(b)var x=y`
	},

	{
		description: 'TK',
		input: `
			if ( a ) {
				if ( b ) {
					foo();
				} else {
					bar();
				}

				baz();
			}`,
		output: `a&&(b?foo():bar(),baz())`
	},

	{
		description: 'activates declaration from inside if block',
		input: `
			function x () {
				var getAnswer = function () {
					return 42;
				};

				if ( y ) {
					var answer = getAnswer();
					console.log( answer );
				}
			}`,
		output: `function x(){var a=function(){return 42};if(y){var b=a();console.log(b)}}`
	},

	{
		description: 'removes trailing curly and adds a semi if appropriate',
		input: `if(a){b=c}d=e`,
		output: `a&&(b=c),d=e`
	},

	{
		description: 'preserves consequent in inverted ternary if statement',
		input: `
			if (!a) b();
			else c();// }`,
		output: `a?c():b()`
	},

	{
		description: 'adds space after else if necessary',
		input: `
			function foo () {
				if (a) return b; else return c;
			}`,
		// TODO `function foo(){}{return a?b:c}`
		output: `function foo(){if(a)return b;else return c}`
	},

	{
		description: 'adds semi after empty block',
		input: `
			function foo () {
				if ( a ) {
					var b
				} else if ( c ) {
					d();
				}
			};`,
		// TODO `function foo(){a||(c&&d())}`
		output: `function foo(){if(a);else c&&d()}`
	},

	{
		description: 'adds semi after empty block',
		input: `
			function foo () {
				if ( a ) {
					a();
				} else if ( b ) {
					var c;
				} else {
					d();
				}

				if ( e ) {
					f();
				} else {
					g();
				}
			};`,
		// TODO `function foo(){a?a():b||d();e?f():g()}`
		output: `function foo(){if(a)a();else if(b);else d();e?f():g()}`
	},

	{
		description: 'adds semi after break statement',
		input: `
			function foo () {
				x: {
					if ( a ) {
						a();
					} else break x;

					b();
				}
			}`,
		output: `function foo(){x: {if(a)a();else break x;b()}}`
	},

	{
		description: 'adds closing paren to ternary if necessary',
		input: `if ('undefined' != typeof module) module.exports = foo; else self.foo = foo;`,
		output: `'undefined'!=typeof module?(module.exports=foo):(self.foo=foo)`
	},

	{
		description: 'TK',
		input: `
			while (a) {
				if (!b) c();
				else --d;
			}`,
		output: `while(a)b?--d:c()`
	},

	{
		description: 'TK',
		input: `
			if (!a)
				w();
			else if (b)
				x();
			else
				y();

			if (c) z();`,
		output: `a?b?x():y():w(),c&&z()`
	},

	{
		description: 'adds semi when both consequent and alternate are block-less',
		input: `
			function foo () {
				if (a)
					return b
				else
					return c
			}`,
		// TODO `function foo(){return a?b:c}`
		output: `function foo(){if(a)return b;else return c}`
	},

	{
		description: 'removes semi after block in consequent',
		input: `
			if (a)
				for (var i = 0; i < 10; ++i) {
					var x = 42;
					console.log(x);
					console.log(x);
				}
			else if (b)
				b()
			else if (c)
				c()`,
		output: `if(a)for(var i=0;i<10;++i){var x=42;console.log(x);console.log(x)}else b?b():c&&c()`
	},

	{
		description: 'preserves semi after consequent if-statement rewritten as expression',
		input: `
			if (a) {
				if (b) {
					c();
				}
			} else {
				var x = 42;
				console.log(x);
				console.log(x);
			}`,
		output: `if(a)b&&c();else{var x=42;console.log(x);console.log(x)}`
	}
];
