const UglifyJS = require('uglify-es');

exports.minify = (input, sourcemap) => {
	const opts = {};

	if ( sourcemap ) {
		opts.sourceMap = {
			filename: "out.js",
			url: "out.js.map"
		};
	}

	return UglifyJS.minify({ 'input.js': input }, opts);
};