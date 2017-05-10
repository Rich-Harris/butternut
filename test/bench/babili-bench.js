const babel = require('babel-core');

exports.minify = (input, sourcemap) => babel.transform(input, {
	babelrc: false,
	presets: ['babili'],
	sourceMaps: sourcemap
});