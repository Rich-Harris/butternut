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
	},

	{
		description: 'handles sparse arrays',
		input: `var a = [,0,,1,,2,,], b = [3,];`,
		output: `var a=[,0,,1,,2,,],b=[3]`
	},

	{
		description: 'joins arrays with string literal',
		input: `var joined = [ 'a', 'b', 'c' ].join( '' );`,
		output: `var joined="abc"`
	},

	{
		description: 'joins arrays with void 0',
		input: `var joined = [ 'a', 'b', 'c' ].join( void 0 );`,
		output: `var joined="a,b,c"`
	},

	{
		description: 'replaces array index',
		input: `var index = [ 'a', 'b', 'c' ].indexOf( 'c' );`,
		output: `var index=2`
	}
];
