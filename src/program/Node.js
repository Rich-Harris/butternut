import wrap from './wrap.js';
import keys from './keys.js';
import { UNKNOWN } from '../utils/sentinels.js';

export default class Node {
	constructor ( raw, parent ) {
		raw.parent = parent;
		raw.program = parent.program || parent;
		raw.depth = parent.depth + 1;
		raw.keys = keys[ raw.type ];
		raw.indentation = undefined;

		for ( const key of keys[ raw.type ] ) {
			wrap( raw[ key ], raw );
		}

		raw.program.magicString.addSourcemapLocation( raw.start );
		raw.program.magicString.addSourcemapLocation( raw.end );
	}

	ancestor ( level ) {
		let node = this;
		while ( level-- ) {
			node = node.parent;
			if ( !node ) return null;
		}

		return node;
	}

	contains ( node ) {
		while ( node ) {
			if ( node === this ) return true;
			node = node.parent;
		}

		return false;
	}

	findLexicalBoundary () {
		return this.parent.findLexicalBoundary();
	}

	findNearest ( type ) {
		if ( typeof type === 'string' ) type = new RegExp( `^${type}$` );
		if ( type.test( this.type ) ) return this;
		return this.parent.findNearest( type );
	}

	findScope ( functionScope ) {
		return this.parent.findScope( functionScope );
	}

	getIndentation () {
		const lastLine = /\n(.+)$/.exec( this.program.magicString.original.slice( 0, this.start ) );
		return lastLine ? /^[ \t]*/.exec( lastLine[1] )[0] : '';
	}

	getLeftHandSide () {
		return this;
	}

	getPrecedence () {
		return 0;
	}

	getRightHandSide () {
		return this;
	}

	getValue () {
		return UNKNOWN;
	}

	initialise () {
		for ( var key of this.keys ) {
			const value = this[ key ];

			if ( value ) {
				if ( 'length' in value ) {
					let i = value.length;
					while ( i-- ) {
						if ( value[i] ) value[i].initialise();
					}
				} else {
					value.initialise();
				}
			}
		}
	}

	findVarDeclarations ( varsToHoist ) {
		for ( var key of this.keys ) {
			const value = this[ key ];

			if ( value ) {
				if ( 'length' in value ) {
					let i = value.length;
					while ( i-- ) {
						if ( value[i] ) value[i].findVarDeclarations( varsToHoist );
					}
				} else {
					value.findVarDeclarations( varsToHoist );
				}
			}
		}
	}

	minify ( code ) {
		for ( var key of this.keys ) {
			const value = this[ key ];

			if ( value ) {
				if ( 'length' in value ) {
					let i = value.length;
					while ( i-- ) {
						if ( value[i] ) value[i].minify( code );
					}
				} else {
					value.minify( code );
				}
			}
		}
	}

	preventsCollapsedReturns ( returnStatements ) {
		if ( this.type === 'ExpressionStatement' ) return false;
		if ( this.type === 'ReturnStatement' ) return returnStatements.push( this ), false;
		if ( this.type === 'IfStatement' ) return !this.preventsCollapsedReturns( returnStatements );
		return true;
	}

	source () {
		return this.program.magicString.original.slice( this.start, this.end );
	}

	toString () {
		return this.program.magicString.slice( this.start, this.end );
	}
}
