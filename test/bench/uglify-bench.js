const UglifyJS = require('uglify-js');

exports.minify = input => UglifyJS.minify(input, {fromString: true});