module.exports = [
	{
		description: 'removes whitespace in switch statement',
		input: `
			switch ( foo ) {
				case  bar :
					a();
					break;

				case  baz :
					b();
					break;

				default :
					c();
			}`,
		output: `switch(foo){case bar:a();break;case baz:b();break;default:c()}`
	},

	{
		solo: true,
		description: 'TK',
		input: `
			function foo () {
				switch (a) {
					case 0: while (++i < l) { b(); } return;
				}
			};`,
		output: `function foo(){switch(a){case 0:while(++i<l)b();return}}`
	}
];
