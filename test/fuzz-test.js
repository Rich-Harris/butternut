const fs = require('fs');
const generateRandomJs = require('eslump/codegen.js');
const acorn = require('acorn');
const { walk } = require('estree-walker');

const butternut = require('../dist/butternut.cjs.js');

let tested = 0;
let disregarded = 0;

for (let i = 0; i < 100; i += 1) {
	const input = generateRandomJs();

	try {
		const ast = acorn.parse(input, {
			ecmaVersion: 8,
			sourceType: 'module',
			preserveParens: true,
			allowReserved: true,
			allowReturnOutsideFunction: true
		});

		if (!isValidInput(ast)) {
			disregarded += 1;
			continue;
		}
	} catch (err) {
		disregarded += 1;
		continue;
	}

	try {
		butternut.squash(input, {
			check: true,
			allowDangerousEval: true
		});

		tested += 1;
	} catch (err) {
		if (err.check) {
			fs.writeFileSync('test/fixture/input/_test.js', input);
			throw err;
		}
	}
}

console.log( `successfully tested ${tested} inputs, disregarded ${disregarded}` );

function isValidInput(ast) {
	let valid = true;

	walk(ast, {
		enter(node, parent) {
			if (node.type === 'MemberExpression') {
				const object = deparenthesize(node.object);

				// disregard nonsense like false.typeof
				if (isBoolean(object)) {
					valid = false;
					this.abort();
				}
			}

			if (node.type === 'UnaryExpression') {
				const argument = deparenthesize(node.argument);

				// `true ** x`
				if (isBoolean(argument)) {
					valid = false;
					this.abort();
				}
			}
		},

		leave(node, parent) {}
	});

	return valid;
}

function deparenthesize(node) {
	while (node.type === 'ParenthesizedExpression')
		node = node.expression;
}

function isBoolean(node) {
	return node.type === 'Literal' && typeof node.value === 'boolean';
}