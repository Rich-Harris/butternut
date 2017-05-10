const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');
const child_process = require('child_process');
const assert = require('assert');
const glob = require('glob');
const butternut = require('../dist/butternut.cjs.js');

require('source-map-support').install();
require('console-group').install();

function equal(a, b) {
	assert.equal(showInvisibles(a), showInvisibles(b));
}

function showInvisibles(str) {
	return str
		.replace(/^ +/gm, spaces => repeat('•', spaces.length))
		.replace(/ +$/gm, spaces => repeat('•', spaces.length))
		.replace(/^\t+/gm, tabs => repeat('›   ', tabs.length))
		.replace(/\t+$/gm, tabs => repeat('›   ', tabs.length));
}

function repeat(str, times) {
	let result = '';
	while (times--)
		result += str;
	return result;
}

describe('butternut', () => {
	fs.readdirSync('test/samples').forEach(file => {
		const samples = require('./samples/' + file);

		describe(path.basename(file), () => {
			samples.forEach(sample => {
				(sample.solo
					? it.only
					: sample.skip ? it.skip : it)(sample.description, () => {
					if (sample.error) {
						assert.throws(() => {
							butternut.squash(sample.input, sample.options);
						}, sample.error);
					} else {
						const { code, stats } = butternut.squash(
							sample.input,
							sample.options
						);
						equal(code, sample.output);
					}
				});
			});
		});
	});

	describe('fixtures', () => {
		fs.readdirSync('test/fixture/input').forEach(file => {
			const solo = ( file === '_test.js' && !!fs.readFileSync(path.join('test/fixture/input', file), 'utf-8'));

			(solo ? it.only : it)(path.basename(file), () => {
				const source = fs.readFileSync(path.join('test/fixture/input', file), 'utf-8');

				try {
					const { code, map } = butternut.squash(source, {
						check: true
					});

					fs.writeFileSync(`test/fixture/output/butternut/${file}`, `${code}\n//# sourceMappingURL=${map.toUrl()}`);
				} catch ( err ) {
					if ( err.repro ) {
						console.error( `Reproduction:\n-----------\n${err.repro.input}\n-----------\n${err.repro.output}\n-----------` );
					}

					throw err;
				}
			});
		});
	});

	describe('cli', () => {
		fs.readdirSync('test/cli').forEach(dir => {
			if (dir[0] === '.') return; // .DS_Store

			it(dir, done => {
				dir = path.resolve('test/cli', dir);
				rimraf.sync(path.resolve(dir, 'actual'));
				fs.mkdirSync(path.resolve(dir, 'actual'));

				var binFile = path.resolve(__dirname, '../bin/squash');
				var commandFile = path.resolve(dir, 'command.sh');

				var command = fs
					.readFileSync(commandFile, 'utf-8')
					.replace('squash', 'node ' + binFile);
				child_process.exec(
					command,
					{
						cwd: dir
					},
					(err, stdout, stderr) => {
						if (err) return done(err);

						if (stdout) console.log(stdout);
						if (stderr) console.error(stderr);

						function catalogue(subdir) {
							subdir = path.resolve(dir, subdir);

							return glob
								.sync('**/*.js?(.map)', { cwd: subdir })
								.sort()
								.map(name => {
									var contents = fs
										.readFileSync(path.resolve(subdir, name), 'utf-8')
										.trim();

									if (path.extname(name) === '.map') {
										contents = JSON.parse(contents);
									}

									return {
										name: name,
										contents: contents
									};
								});
						}

						var expected = catalogue('expected');
						var actual = catalogue('actual');

						try {
							assert.deepEqual(actual, expected);
							done();
						} catch (err) {
							done(err);
						}
					}
				);
			});
		});
	});
});
