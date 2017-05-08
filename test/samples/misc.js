module.exports = [
	{
		description: 'removes empty statements',
		input: 'foo();;;',
		output: 'foo()'
	}
];
