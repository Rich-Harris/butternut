import MagicString from 'magic-string';
import wrap from './wrap.js';
import BlockStatement from './BlockStatement.js';
import Scope from './Scope.js';
import check from './check.js';

const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$0123456789'.split('');
const digit = /\d/;

const naturalOrder = {};
chars.forEach( ( char, i ) => {
	naturalOrder[char] = i;
});

export default function Program ( source, ast, options, stats ) {
	this.options = options;
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
	this.body.scope = new Scope({
		block: false,
		parent: null
	});

	this.body.body.forEach( node => {
		node.attachScope( this, this.body.scope );
	});

	this.charFrequency = {};
	chars.forEach( char => {
		this.charFrequency[char] = 0;
	});

	this.body.initialise( this, this.body.scope );
	if ( DEBUG ) stats.timeEnd( 'init body' );

	chars.sort( ( a, b ) => {
		if ( digit.test( a ) && !digit.test( b ) ) return 1;
		if ( digit.test( b ) && !digit.test( a ) ) return -1;
		return ( this.charFrequency[b] - this.charFrequency[a] ) || ( naturalOrder[a] - naturalOrder[b] );
	});

	if ( DEBUG ) stats.time( 'minify' );
	this.body.minify( this.magicString, chars );
	if ( DEBUG ) stats.timeEnd( 'minify' );
}

Program.prototype = {
	addWord ( word ) {
		for ( let i = 0; i < word.length; i += 1 ) {
			this.charFrequency[word[i]] += 1;
		}
	},

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
	}
};
