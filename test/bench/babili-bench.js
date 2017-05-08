const babel = require('babel-core');

exports.minify = input => babel.transform(input, {
	babelrc: false,
	presets: ['babili']
});