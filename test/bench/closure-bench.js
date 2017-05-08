const compile = require('google-closure-compiler-js').compile;

exports.minify = input => {
	const out = compile({
		jsCode: [{ src: input }],
		compilationLevel: 'SIMPLE',
		createSourceMap: true
	});

	return {
		code: out.compiledCode,
		map: out.sourceMap
	};
};
