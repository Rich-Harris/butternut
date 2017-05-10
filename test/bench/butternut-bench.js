const butternut = require('../../dist/butternut.umd.js');

exports.minify = (input, sourcemap, check) => {
	return butternut.squash(input, {
		sourceMap: sourcemap,
		check
	});
};