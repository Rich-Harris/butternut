#!/usr/bin/env node
'use strict';

// TODO this whole thing is a bit of a horrorshow, tidy it up

const glob = require('glob');
const { Suite } = require('benchmark');
const fs = require('fs');
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
mkdir('test/bench/results');

const libs = [
	'babili',
	'butternut',
	'closure',
	'uglify',
	'uglify-es'
];

const cold = process.argv.indexOf( 'cold' ) !== -1;

function printResult (results, name, sourcemap) {
	const r = results[name];

	let indicator;
	try {
		acorn.parse(r.min);
		indicator = chalk.green('✓');
	} catch (err) {
		indicator = chalk.red('✗');
	}

	const time = prettyMs(sourcemap ? r.sourcemap : r.nosourcemap);
	console.log(
		`  ${indicator} ${rightPad(name, 10)}: ${leftPad(prettyBytes(r.min), 8)} / ${leftPad(prettyBytes(r.zip), 8)} in ${time}`
	);
}

function tryRequire (file) {
	try {
		return require(file);
	} catch (err) {
		return null;
	}
}

function test(fixture, sourcemap) {
	const content = fs.readFileSync(`test/fixture/input/${fixture}`, 'utf8');
	const size = prettyBytes(Buffer.byteLength(content, 'utf8'));

	console.log(`${fixture} (${size}) ${sourcemap ? 'with' : 'without'} sourcemap:`);
	const results = tryRequire(`./results/${fixture}on`) || {};

	const suite = new Suite();

	libs.forEach(name => {
		const { minify } = require(`./${name}-bench.js`);

		try {
			const t1 = process.hrtime();
			const result = minify(content, sourcemap, !cold);
			const t2 = process.hrtime(t1);

			if ( ( sourcemap && !result.map ) || ( result.map && !sourcemap ) ) {
				console.error( chalk.red( `Sourcemap should ${sourcemap ? '' : 'not '} have been created` ) );
			}

			// strip comments to avoid penalising Closure
			const code = (result.code || '').replace( /^\/\*[\s\S]+?\*\/\n?/, '' );

			if ( name !== 'butternut' ) {
				mkdir( `test/fixture/output/${name}` );
				fs.writeFileSync( `test/fixture/output/${name}/${fixture}`, code );
			}

			results[name] = results[name] || {};
			results[name].min = code.length;
			results[name].zip = zlib.gzipSync(code).byteLength;
			results[name][sourcemap ? 'sourcemap' : 'nosourcemap'] = ( t2[0] * 1e3 ) + ( t2[1] / 1e6 );

			if (cold) {
				printResult(results, name, sourcemap);

				fs.writeFileSync(
					`test/bench/results/${fixture}on`,
					JSON.stringify(results, null, '  ')
				);
			} else {
				suite.add(name, () => {
					minify(content, sourcemap);
				});
			}
		} catch (err) {
			console.log(err.stack);
			// noop
		}
	});

	if ( !cold ) {
		suite.on('error', ({ target: { error } }) => {
			throw error;
		});

		suite.on('cycle', ({ target }) => {
			const r = results[target.name];
			r[sourcemap ? 'sourcemap' : 'nosourcemap'] = 1e3 / target.hz;

			printResult(results, target.name, sourcemap);
		});

		suite.on('complete', () => {
			fs.writeFileSync(
				`test/bench/results/${fixture}on`,
				JSON.stringify(results, null, '  ')
			);
		});

		suite.run();
	}
}

glob.sync('*.js', { cwd: 'test/fixture/input' }).forEach(fixture => {
	if ( fixture === '_test.js' ) return;

	test(fixture, false);
	test(fixture, true);
});
