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
	},

	{
		description: 'async arrow function with no params',
		input: `var x = async () => y`,
		output: `var x=async()=>y`
	},

	{
		description: 'async arrow function with one param',
		input: `var x = async y => y + 1`,
		output: `var x=async a=>a+1`
	},

	{
		description: 'async arrow function with multiple params',
		input: `var x = async ( a, b, c ) => a + b + c`,
		output: `var x=async(a,b,c)=>a+b+c`
	},

	{
		description: 'inserts space before returned single-param arrow function',
		input: `
			function foo() {
				return (a) => a;
			}`,
		output: `function foo(){return n=>n}`
	}
];
