import parse from './utils/parse.js';
import Program from './program/Program.js';
import Stats from './utils/Stats.js';
import getSnippet from './utils/getSnippet.js';

export function squash ( source, options = {} ) {
	let ast;

	const stats = DEBUG ? new Stats() : null;

	try {
		if ( DEBUG ) stats.time( 'parse' );
		ast = parse( source );
		if ( DEBUG ) stats.timeEnd( 'parse' );
	} catch ( err ) {
		err.snippet = getSnippet( source, err.loc );
		throw err;
	}

	return new Program( source, ast, options, stats ).export( options );
}

export { version as VERSION } from '../package.json';
