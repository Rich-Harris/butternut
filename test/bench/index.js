#!/usr/bin/env node
'use strict';

const glob = require('glob');
const { Suite } = require('benchmark');

const Benchmark = require('benchmark');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const acorn = require('acorn');
const prettyBytes = require('pretty-bytes');
const prettyMs = require('pretty-ms');
const chalk = require('chalk');
const leftPad = require('left-pad');
const rightPad = require('right-pad');

function mkdir(dir) {
	try {
		fs.mkdirSync(dir);
	} catch (err) {
		// err
	}
}

mkdir('test/fixture/output');

const libs = [
	'babili',
	'butternut',
	'closure',
	'uglify',
	'uglify-es'
];

function test(fixture, sourcemap) {
	const content = fs.readFileSync(`test/fixture/input/${fixture}`, 'utf8');
	const size = prettyBytes(Buffer.byteLength(content, 'utf8'));

	console.log(`${fixture} (${size}) ${sourcemap ? 'with' : 'without'} sourcemap:`);
	const results = sourcemap ? require(`./results/${fixture}on`) : {};

	const suite = new Suite();

	libs.forEach(name => {
		const { minify } = require(`./${name}-bench.js`);

		try {
			const result = minify(content, sourcemap, true);

			if ( ( sourcemap && !result.map ) || ( result.map && !sourcemap ) ) {
				console.error( chalk.red( `Sourcemap should ${sourcemap ? '' : 'not '} have been created` ) );
			}

			if ( name !== 'butternut' ) {
				mkdir( `test/fixture/output/${name}` );
				fs.writeFileSync( `test/fixture/output/${name}/${fixture}`, result.code );
			}

			results[name] = {
				min: (result.code || '').length,
				zip: zlib.gzipSync(result.code || '').byteLength
			};

			suite.add(name, () => {
				minify(content, sourcemap);
			});
		} catch (err) {
			console.log(err.stack);
			// noop
		}
	});

	suite.on('error', ({ target: { error } }) => {
		throw error;
	});

	suite.on('cycle', ({ target }) => {
		const r = results[target.name];
		r[sourcemap ? 'sourcemap' : 'nosourcemap'] = 1e3 / target.hz;

		let indicator;
		try {
			acorn.parse(r.min);
			indicator = chalk.green('✓');
		} catch (err) {
			indicator = chalk.red('✗');
		}

		const time = prettyMs(1e3 / target.hz);
		console.log(
			`  ${indicator} ${rightPad(target.name, 10)}: ${leftPad(prettyBytes(r.min), 8)} / ${leftPad(prettyBytes(r.zip), 8)} in ${time}`
		);
	});

	suite.on('complete', () => {
		mkdir('test/bench/results');
		fs.writeFileSync(
			`test/bench/results/${fixture}on`,
			JSON.stringify(results, null, '  ')
		);
	});

	suite.run();
}

glob.sync('*.js', { cwd: 'test/fixture/input' }).forEach(fixture => {
	if ( fixture === '_test.js' ) return;

	test(fixture, false);
	test(fixture, true);
});
