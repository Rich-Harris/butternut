module.exports = [
	{
		description: 'removes unnecessary parens',
		input: `var x=((a+(b)))`,
		output: `var x=a+b`
	},

	{
		description: 'preserves necessary parens',
		input: `var x=(a+b)*c`,
		output: `var x=(a+b)*c`
	},

	{
		description: 'removes unnecessary parens in unary expression',
		input: `var x=typeof (y)`,
		output: `var x=typeof y`
	},

	{
		description: 'removes unnecessary parens in assignment expression',
		input: `x = ( y = z )`,
		output: `x=y=z`
	},

	{
		description: 'removes unnecessary parens in logical expression',
		input: `x = ( a || b ) || c`,
		output: `x=a||b||c`
	},

	{
		description: 'preserves necessary parens in logical expression',
		input: `x = a || ( b || c )`,
		output: `x=a||(b||c)`
	},

	{
		description: 'inserts ! in front of IIFE statement (call parens outside expression)',
		input: `
			(function () {
				console.log( 42 );
			})()`,
		output: `!function(){console.log(42)}()`
	},

	{
		description: 'inserts ! in front of IIFE statement (call parens inside expression)',
		input: `
			(function () {
				console.log( 42 );
			}())`,
		output: `!function(){console.log(42)}()`
	},

	{
		description: 'preserves parens around arrow function expression in logical expression',
		input: `x = y || ( () => z );`,
		output: `x=y||(()=>z)`
	},

	{
		description: `preserves parens around anonymous function expression`,
		input: `(function() {});`,
		output: `(function(){})`
	},

	{
		description: `preserves parens around object pattern`,
		input: `(({x} = y)).z`,
		output: `({x}=y).z`
	}
];
