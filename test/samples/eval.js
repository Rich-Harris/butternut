module.exports = [
	{
		description: 'disallows direct eval',
		input: `eval('1 + 1')`,
		error: {
			message: 'Use of direct eval prevents effective minification and can introduce security vulnerabilities. Use `allowDangerousEval: true` if you know what you\'re doing (1:0)',
			pos: 0,
			loc: {
				line: 1,
				column: 0
			}
		}
	},

	{
		description: 'direct eval causes deopt, if allowed',
		options: {
			allowDangerousEval: true
		},
		input: `
			function foo () {
				var veryLongVariableName = 1;
				var ostensiblyUnusedVariable = 2;
				console.log(veryLongVariableName);
				console.log(veryLongVariableName);
				return eval('1 + 1');
			}`,
		output: `function foo(){var veryLongVariableName=1,ostensiblyUnusedVariable=2;console.log(veryLongVariableName);console.log(veryLongVariableName);return eval('1 + 1')}`
	}
];