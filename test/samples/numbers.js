module.exports = [
	{
		description: 'removes leading zero',
		input: 'x = 0.5',
		output: 'x=.5'
	},

	{
		description: 'removes leading zero from negative number',
		input: 'x = -0.5',
		output: 'x=-.5'
	},

	{
		description: 'uses e notation where appropriate',
		input: `var x = 1, y = 100, z = 10000`,
		output: `var x=1,y=100,z=1e4`
	}
];