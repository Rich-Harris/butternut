module.exports = [
	{
		description: 'allows anonymous function as default export',
		input: `export default function () {}`,
		output: `export default function(){}`
	},

	{
		description: 'preserves variable declaration kind for empty pattern',
		input: `export let {} = obj;`,
		output: `export let{}=obj`
	}
];