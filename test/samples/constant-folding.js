module.exports = [
	{
		description: 'folds exponentiation',
		input: `x = 2 ** 3`,
		output: `x=8`
	},

	{
		description: 'stringifies infinity',
		input: `x = 9e999 * 9e999;`,
		output: `x=1/0`
	},

	{
		description: 'stringifies negative infinity',
		input: `x = -9e999 * 9e999;`,
		output: `x=-1/0`
	},

	{
		description: 'only stringifies references',
		input: `
			obj = {
				undefined:1,
				Infinity:1
			};`,
		output: `obj={undefined:1,Infinity:1}`
	},

	{
		description: 'does not call unknown properties of strings',
		input: `x = "a"[ "b" ]( c ) ? any_value_1 : any_value_2`,
		output: `x="a".b(c)?any_value_1:any_value_2`
	}
];