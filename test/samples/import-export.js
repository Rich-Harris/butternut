module.exports = [
	{
		description: 'allows anonymous function as default export',
		input: `export default function () {}`,
		output: `export default function(){}`
	}
];