module.exports = [
	{
		description: 'removes whitespace around arrow',
		input: `var x = y => y + 1`,
		output: `var x=a=>a+1`
	},

	{
		description: 'removes whitespace around parens if no params',
		input: `var x = (  )  =>  z`,
		output: `var x=()=>z`
	},

	{
		description: 'removes parens if only one param',
		input: `var x = ( y ) => y + 1`,
		output: `var x=a=>a+1`
	},

	{
		description: 'preserves parens if single param is not identifier',
		input: `var x = ( [ y ] ) => y + 1`,
		output: `var x=([a])=>a+1`
	},

	{
		description: 'removes whitespace around parens if many params',
		input: `var x = ( a, b, c )  =>  a + b + c`,
		output: `var x=(a,b,c)=>a+b+c`
	}
];
