module.exports = [
	{
		description: 'removes whitespace in for loop head',
		input: `
			for ( var i = 0; i < 10; i += 1 ) console.log( i );`,
		output: `for(var i=0;i<10;i+=1)console.log(i)`
	},

	{
		description: 'removes whitespace in for loop head missing init',
		input: `
			for ( ; i < 10; i += 1 ) console.log( i );`,
		output: `for(;i<10;i+=1)console.log(i)`
	},

	{
		description: 'removes whitespace in for-in loop head',
		input: `
			for ( var i in j ) console.log( i, j );`,
		output: `for(var i in j)console.log(i,j)`
	},

	{
		description: 'removes whitespace in for-of loop head',
		input: `
			for ( var i of j ) console.log( i, j );`,
		output: `for(var i of j)console.log(i,j)`
	},

	{
		description: 'removes whitespace in while loop head',
		input: `
			while ( i-- ) console.log( i );`,
		output: `while(i--)console.log(i)`
	},

	{
		description: 'removes whitespace in do-while loop head',
		input: `
			do { console.log( i ) } while ( i-- );`,
		output: `do{console.log(i)}while(i--)`
	},

	{
		description: 'allows statement after do-while loop',
		input: `
			do foo();
			while ( bar );

			baz();`,
		output: `do{foo()}while(bar);baz()`
	},

	{
		description: 'ensures semi after synthetic while loop body',
		input: `
			while ( i-- ) foo();
			bar()`,
		output: `while(i--)foo();bar()`
	},

	{
		description: 'TK',
		input: `
			function foo ( len ) {
				let i = len;
				while ( i-- ) {
					bar( i );
				}

				for ( ; i < len; i+=1 ) {
					bar( i );
				}
			}

			foo();`,
		output: `function foo(a){let b=a;while(b--)bar(b);for(;b<a;b+=1)bar(b)}foo()`
	},

	{
		description: 'preserves var declaration in for-loop head',
		input: `for(var i=0;i<10;i++)console.log(i);`,
		output: `for(var i=0;i<10;i++)console.log(i)`
	},

	{
		description: 'generates valid code from do-while containing if block',
		input: `
			do if (a) {
				b();
			} while (a = a.next);`,
		output: `do{a&&b()}while(a=a.next)`
	},

	{
		description: 'removes unnecessary curlies from do-while body',
		input: `
			do {
				if (a) {
					b();
				}
			} while (a = a.next);`,
		output: `do{a&&b()}while(a=a.next)`
	},

	{
		description: 'preserves curlies around do-while body',
		input: `
			do {
				a();
			} while (b);`,
		output: `do{a()}while(b)`
	},

	{
		description: 'handles duplicate var declarations in for-loop head',
		input: `
			function x () {
				for ( var i = 0; i < 10; i += 1 ) {
					console.log(i);
				}

				for ( var i = 0; i < 10; i += 1 ) {
					console.log(i);
				}
			}`,
		output: `function x(){for(var a=0;a<10;a+=1)console.log(a);for(a=0;a<10;a+=1)console.log(a)}`
	},

	{
		description: 'removes unnecessary curlies from for-loop body',
		input: `
			if (a)
				for (var i = 0; i < 10; ++i) {
					if (whatever) b()
				}
			else
				c()`,
		output: `if(a)for(var i=0;i<10;++i)whatever&&b();else c()`
	},

	{
		description: 'handles empty while loop body',
		input: `while ( x() ) {}`,
		output: `while(x());`
	},

	{
		description: 'handles empty do-while loop body',
		input: `do {} while ( x() );`,
		output: `do;while(x())`
	},

	{
		description: 'handles empty for loop body',
		input: `for ( ; ; x() ) {}`,
		output: `for(;;x());`
	},

	{
		description: 'handles duplicate let declarations in for-of loop head',
		input: `
			for (let x of a) {
				console.log(x);
			}
			for (let x of a) {
				console.log(x);
			}`,
		output: `for(let b of a)console.log(b);for(let b of a)console.log(b)`
	},

	{
		description: 'expression-less loop head does not bork up scopes',
		input: `
			(() => {
				let foo = 0;
				for (;;) {
					f(foo);
				}
			})();`,
		output: `!(()=>{let a=0;for(;;)f(a)})()`
	},

	{
		description: 'preserves semi-colon for body-less while loop at end of body',
		input: `
			function f() {
				while (g());
			}`,
		output: `function f(){while(g());}`
	},

	{
		description: 'preserves semi-colon for body-less while loop at end of body',
		input: `
			function f() {
				while (g()) {}
			}`,
		output: `function f(){while(g());}`
	},

	{
		description: 'handles empty statement as first item in body',
		input: `while (a) { ; b(); }`,
		output: `while(a)b()`
	}
];
