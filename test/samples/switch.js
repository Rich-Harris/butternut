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
	}
];
