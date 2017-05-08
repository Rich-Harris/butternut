#!/usr/bin/env node
'use strict';

const glob = require('glob');
const { Suite } = require('benchmark');

const Benchmark = require('benchmark');
const fs = require('fs');
const path = require('path');
const acorn = require('acorn');
const prettyBytes = require('pretty-bytes');
const prettyMs = require('pretty-ms');
const chalk = require('chalk');
const leftPad = require('left-pad');

function mkdir (dir) {
	try {
		fs.mkdirSync(dir);
	} catch (err) {
		// err
	}
}

mkdir('test/fixture/output');

glob.sync('*.js', {cwd: 'test/fixture/input'}).forEach(fixture => {
	const content = fs.readFileSync(`test/fixture/input/${fixture}`, 'utf8');
	const size = prettyBytes(Buffer.byteLength(content, 'utf8'));

	console.log(`${fixture} (${size}):`);
	const results = {};

	const suite = new Suite();
	glob.sync('*-bench.js', {cwd: 'test/bench'}).forEach(id => {
		const name = /([a-z]+)-bench/.exec(id)[1];

		const {minify} = require(path.resolve('test/bench', id));

		try {
			const {code} = minify(content);
			results[name] = code;

			mkdir(`test/fixture/output/${name}`);
			fs.writeFileSync(`test/fixture/output/${name}/${fixture}`, code);

			suite.add(name, () => {
				minify(content);
			});
		} catch (err) {
			// noop
		}
	});
	suite.on('error', ({ target: { error } }) => {
		throw error;
	});
	suite.on('cycle', ({ target }) => {
		const result = results[target.name];

		let indicator;
		try {
			acorn.parse(result);
			indicator = chalk.green('✓');
		} catch (err) {
			indicator = chalk.red('✗');
		}

		const time = prettyMs(1e3 / target.hz);
		console.log(`  ${indicator} ${leftPad(prettyBytes(result.length),10)} ${target}`.replace(' x ', ` in ${time}; `));
	});
	suite.run();
});
