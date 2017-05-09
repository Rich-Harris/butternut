import { parse } from 'acorn';
import Program from './program/Program.js';
import Stats from './utils/Stats.js';
import getSnippet from './utils/getSnippet.js';

export function squash ( source, options = {} ) {
	let ast;

	const stats = DEBUG ? new Stats() : null;

	try {
		if ( DEBUG ) stats.time( 'parse' );
		ast = parse( source, {
			ecmaVersion: 8,
			preserveParens: true,
			sourceType: 'module'
		});
		if ( DEBUG ) stats.timeEnd( 'parse' );
	} catch ( err ) {
		err.snippet = getSnippet( source, err.loc );
		throw err;
	}

	return new Program( source, ast, stats ).export( options );
}

export { version as VERSION } from '../package.json';
