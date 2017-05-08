module.exports = [
	{
		description: 'removes whitespace in arrays',
		input: `var a = [ b, c, d, e, f ]`,
		output: `var a=[b,c,d,e,f]`
	},

	{
		description: 'removes whitespace in empty array',
		input: `var a = [ ]`,
		output: `var a=[]`
	}
];
