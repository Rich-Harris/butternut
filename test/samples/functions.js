module.exports = [
	{
		description: 'removes whitespace before and after parens',
		input: `function foo () {}`,
		output: `function foo(){}`
	},

	{
		description: 'removes whitespace inside parens',
		input: `function foo( a, b , c ){console.log(a,b,c)}`,
		output: `function foo(a,b,c){console.log(a,b,c)}`
	},

	{
		description: 'removes whitespace from anonymous function expression',
		input: `call(function ( a, b , c ){console.log(a,b,c)})`,
		output: `call(function(a,b,c){console.log(a,b,c)})`
	},

	{
		description: 'preserves parens around function expression',
		input: `(function() {}.call());`,
		output: `(function(){}.call())`
	},

	{
		description: 'preserves * in generator functions',
		input: `
			foo = function * () {
				yield 42;
			};`,
		output: `foo=function*(){yield 42}`
	},

	{
		description: 'preserves async keyword in function expression',
		input: `
			foo = async function () {
				return await bar;
			};`,
		output: `foo=async function(){return await bar}`
	},

	{
		description: 'preserves async keyword in function declaration',
		input: `
			async function foo () {
				return await bar;
			}`,
		output: `async function foo(){return await bar}`
	}
];
