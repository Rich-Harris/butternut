module.exports = [
	{
		description: 'str.toUpperCase()',
		input: `var greeting = ('hello').toUpperCase()`,
		output: `var greeting="HELLO"`
	},

	{
		description: 'str.trim()',
		input: `var str = '   trim me please   '.trim()`,
		output: `var str="trim me please"`
	},

	{
		description: 'templateStr.trim()',
		input: 'var templateStr = `    1 + 1 = ${ 1 + 1 }    `.trim()',
		output: 'var templateStr="1 + 1 = 2"'
	}
];
