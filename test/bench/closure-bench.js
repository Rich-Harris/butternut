const compile = require('google-closure-compiler-js').compile;

exports.minify = (input, sourcemap) => {
	const out = compile({
		jsCode: [{ src: input }],
		compilationLevel: 'SIMPLE',
		createSourceMap: sourcemap
	});

	return {
		code: out.compiledCode,
		map: out.sourceMap
	};
};
