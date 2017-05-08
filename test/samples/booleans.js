module.exports = [
	{
		description: 'replaces true with !0',
		input: `var a = true;`,
		output: `var a=!0`
	},

	{
		description: 'replaces false with !1',
		input: `var a = false;`,
		output: `var a=!1`
	},

	{
		description: 'replaces !!true with !0',
		input: `var a = !!true;`,
		output: `var a=!0`
	},

	{
		description: 'replaces !!false with !1',
		input: `var a = !!false;`,
		output: `var a=!1`
	}
];
