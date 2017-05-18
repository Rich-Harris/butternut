module.exports = [
	{
		description: 'removes whitespace after return if possible',
		input: `
			function foo () {
				return 'foo';
			}`,
		output: `function foo(){return'foo'}`
	},

	{
		description: 'enforces whitespace before no-longer-parenthesized expression',
		input: `
			function foo () {
				return(x);
			}`,
		output: `function foo(){return x}`
	},

	{
		description: `preserves space after return keyword`,
		input: `
			function foo( value ) {
				return ( value == null ) ? '' : '' + value;
			}`,
		output: `function foo(n){return n==null?'':''+n}`
	},

	{
		description: 'space before call expression, where callee is new expression',
		input: `
			function foo () {
				return (new Bar(1))()
			}`,
		output: `function foo(){return new Bar(1)()}`
	}
];
