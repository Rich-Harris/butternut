const fs = require('fs');
const generateRandomJs = require('eslump/codegen.js');
const acorn = require('acorn');

const butternut = require('../dist/butternut.cjs.js');

for (let i = 0; i < 100; i += 1) {
	const input = generateRandomJs();
	try {
		acorn.parse(input, {
			ecmaVersion: 8,
			sourceType: 'module',
			preserveParens: true,
			allowReserved: true,
			allowReturnOutsideFunction: true
		});
	} catch (err) {
		continue;
	}

	try {
		butternut.squash(input, {
			check: true,
			allowDangerousEval: true
		});
	} catch (err) {
		console.log(input);
		fs.writeFileSync('test/fixture/input/_test.js', input);
		throw err;
	}
}
