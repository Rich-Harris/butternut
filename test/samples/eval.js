module.exports = [
	{
		solo: true,
		description: 'disallows direct eval',
		input: `eval('1 + 1')`,
		error: {
			message: 'Use of direct eval prevents effective minification and can introduce security vulnerabilities. Use `allowDangerousEval: true` if you know what you\'re doing',
			pos: 0,
			loc: {
				line: 1,
				column: 0
			}
		}
	}
];