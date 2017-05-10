import MagicString from 'magic-string';
import wrap from './wrap.js';
import BlockStatement from './BlockStatement.js';
import check from './check.js';

export default function Program ( source, ast, stats ) {
	this.stats = stats;
	this.type = 'Root';

	this.source = source;
	if ( DEBUG ) stats.time( 'create magicString' );
	this.magicString = new MagicString( source );
	if ( DEBUG ) stats.timeEnd( 'create magicString' );

	this.ast = ast;
	this.depth = 0;

	if ( DEBUG ) stats.time( 'create body' );
	wrap( this.body = ast, this );
	this.body.__proto__ = BlockStatement.prototype;
	if ( DEBUG ) stats.timeEnd( 'create body' );

	this.templateElements = [];
	if ( DEBUG ) stats.time( 'init body' );
	this.body.initialise();
	if ( DEBUG ) stats.timeEnd( 'init body' );

	if ( DEBUG ) stats.time( 'minify' );
	this.body.minify( this.magicString );
	if ( DEBUG ) stats.timeEnd( 'minify' );
}

Program.prototype = {
	export ( options ) {
		const stats = this.stats;

		if ( DEBUG ) stats.time( 'generate code' );
		const code = this.magicString.toString();
		if ( DEBUG ) stats.timeEnd( 'generate code' );

		if ( options.check ) {
			check( this.magicString, this.ast );
		}

		if ( DEBUG ) stats.time( 'generate map' );
		const map = options.sourceMap !== false ? this.magicString.generateMap({
			file: options.file,
			source: options.source,
			includeContent: options.includeContent !== false
		}) : null;
		if ( DEBUG ) stats.timeEnd( 'generate map' );

		if ( DEBUG && this.magicString.stats ) {
			Object.keys( this.magicString.stats ).forEach( stat => {
				stats[ stat ] = this.magicString.stats[ stat ];
			});
		}

		return { code, map, stats };
	},

	findNearest () {
		return null;
	},

	findScope () {
		return this.body.scope;
	}
};
