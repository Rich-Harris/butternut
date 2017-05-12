const UglifyJS = require('uglify-js');

exports.minify = (input, sourcemap) => {
	const opts = { mangle: true, compress: false };

	if ( sourcemap ) {
		opts.sourceMap = {
			filename: "out.js",
			url: "out.js.map"
		};
	}

	return UglifyJS.minify({ 'input.js': input }, opts);
};
