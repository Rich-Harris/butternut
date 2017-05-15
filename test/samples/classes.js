module.exports = [
	{
		description: 'minifies class declaration',
		input: `
			class Foo {
				bar () {
					// code goes here
				}

				baz () {
					// code goes here
				}
			}`,
		output: `class Foo{bar(){}baz(){}}`
	},

	{
		description: 'minifies class expression',
		input: `
			var Foo = class Foo {
				bar () {
					// code goes here
				}

				baz () {
					// code goes here
				}
			}`,
		output: `var Foo=class a{bar(){}baz(){}}`
	},

	{
		description: 'minifies subclass declaration',
		input: `
			class  Foo  extends  Bar {
				baz () {
					// code goes here
				}
			}`,
		output: `class Foo extends Bar{baz(){}}`
	},

	{
		description: 'minifies subclass expression',
		input: `
			var Foo = class  Foo  extends  Bar {
				baz () {
					// code goes here
				}
			}`,
		output: `var Foo=class a extends Bar{baz(){}}`
	},

	{
		description: 'minifies id-less subclass expression',
		input: `
			var Foo = class    extends  Bar {
				baz () {
					// code goes here
				}
			}`,
		output: `var Foo=class extends Bar{baz(){}}`
	},

	{
		description: 'removes unused class declaration',
		input: `
			(function () {
				class Foo {
					bar () {}
				}
			})()`,
		output: `!function(){}()`
	},

	{
		description: 'minifies async method',
		input: `
			class Foo {
				async   bar  () {

				}
			}`,
		output: `class Foo{async bar(){}}`
	},

	{
		description: 'minifies static method',
		input: `
			class Foo {
				static bar () {}
			}`,
		output: `class Foo{static bar(){}}`
	},

	{
		description: 'minifies static computed method',
		input: `
			class Foo {
				static [ bar ] () {}
			}`,
		output: `class Foo{static[bar](){}}`
	},

	{
		description: 'minifies getters and setters',
		input: `
			class Foo {
				get  bar  () {}
				set  bar  (val) {}
			}`,
		output: `class Foo{get bar(){}set bar(a){}}`
	}
];
