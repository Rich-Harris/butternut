const butternut = require('../../dist/butternut.cjs.js');

exports.minify = (input, sourcemap, check) => {
	return butternut.squash(input, {
		sourceMap: sourcemap,
		check
	});
};