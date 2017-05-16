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
		description: 'Separates statements in switch-case consequent',
		input: `
			function foo () {
				switch (a) {
					case 0: while (b) { c(); } return;
				}
			};`,
		output: `function foo(){switch(a){case 0:while(b)c();return}}`
	},

	{
		description: 'Separates statements in switch-case consequent with no characters originally between them',
		input: `
			function foo () {
				switch (a) {
					case 0: while (b) { c(); }return;
				}
			};`,
		output: `function foo(){switch(a){case 0:while(b)c();return}}`
	},

	{
		description: 'Removes empty switch statement',
		input: `switch (x) {}`,
		output: ``
	},

	{
		description: 'Preserves discriminant for empty switch statement',
		input: `switch (x()) {}`,
		output: `x()`
	}
];
