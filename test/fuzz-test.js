const fs = require('fs');
const generateRandomJs = require('eslump/codegen.js');
const acorn = require('acorn');
const { walk } = require('estree-walker');

const butternut = require('../dist/butternut.cjs.js');

for (let i = 0; i < 100; i += 1) {
	const input = generateRandomJs();

	if (!isValidInput(input)) continue;

	try {
		const ast = acorn.parse(input, {
			ecmaVersion: 8,
			sourceType: 'module',
			preserveParens: true,
			allowReserved: true,
			allowReturnOutsideFunction: true
		});

		if (!isValidInput(ast)) continue;
	} catch (err) {
		continue;
	}

	try {
		butternut.squash(input, {
			check: true,
			allowDangerousEval: true
		});
	} catch (err) {
		if (err.check) {
			fs.writeFileSync('test/fixture/input/_test.js', input);
			throw err;
		}
	}
}

function isValidInput(ast) {
	let valid = true;

	walk(ast, {
		enter(node, parent) {
			if (node.type === 'Literal' && typeof node.value === 'boolean') {
				// disregard nonsense like false.typeof
				if (parent.type === 'MemberExpression' && node === parent.object) {
					valid = false;
					this.abort();
				}

				// `true ** x`
				if (parent.type === 'UnaryExpression' && node === parent.left) {
					valid = false;
					this.abort();
				}
			}
		},

		leave(node, parent) {}
	});

	return valid;
}
