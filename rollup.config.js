import buble from 'rollup-plugin-buble';
import json from 'rollup-plugin-json';
import replace from 'rollup-plugin-replace';
import nodeResolve from 'rollup-plugin-node-resolve';
import { resolve } from 'path';

const umd = process.env.UMD;

var external = umd ? null : ['acorn', 'magic-string', 'sourcemap-codec'];

const config = {
	entry: 'src/index.js',
	moduleName: 'butternut',
	plugins: [
		{
			resolveId: id => {
				// for the browser build, we want to bundle Acorn, but not
				// from the dist file
				if (process.env.DEPS && id === 'acorn') {
					return resolve(__dirname, 'node_modules/acorn/src/index.js');
				}
			}
		},
		replace({ DEBUG: false }),
		json(),
		buble({
			include: ['src/**', 'node_modules/acorn/**'],
			transforms: {
				dangerousForOf: true
			}
		}),
		nodeResolve({
			jsnext: true
		})
	],
	external: external,
	globals: {
		acorn: 'acorn',
		'magic-string': 'MagicString'
	},
	sourceMap: true
};

if (umd) {
	config.format = 'umd';
	config.dest = 'dist/butternut.umd.js';
} else {
	const pkg = require('./package.json');
	config.targets = [
		{ dest: pkg.main, format: 'cjs' },
		{ dest: pkg.module, format: 'es' }
	];
}

export default config;