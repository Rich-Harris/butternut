module.exports = [
	{
		description: 'removes empty statements',
		input: 'foo();;;',
		output: 'foo()'
	},

	{
		description: 'prints negative zero correctly',
		input: 'var a=-0',
		output: 'var a=-0'
	}
];
