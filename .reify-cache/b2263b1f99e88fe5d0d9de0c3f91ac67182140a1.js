"use strict";module.export({default:()=>Node});var wrap;module.watch(require('./wrap.js'),{default:function(v){wrap=v}},0);var keys;module.watch(require('./keys.js'),{default:function(v){keys=v}},1);var UNKNOWN;module.watch(require('../utils/sentinels.js'),{UNKNOWN:function(v){UNKNOWN=v}},2);



class Node {
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

	attachScope ( scope ) {
		for ( var key of this.keys ) {
			const value = this[ key ];

			if ( value ) {
				if ( 'length' in value ) {
					let i = value.length;
					while ( i-- ) {
						if ( value[i] ) value[i].attachScope( scope );
					}
				} else {
					value.attachScope( scope );
				}
			}
		}
	}

	contains ( node ) {
		while ( node ) {
			if ( node === this ) return true;
			node = node.parent;
		}

		return false;
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

	initialise ( scope ) {
		for ( var key of this.keys ) {
			const value = this[ key ];

			if ( value ) {
				if ( 'length' in value ) {
					let i = value.length;
					while ( i-- ) {
						if ( value[i] ) value[i].initialise( scope );
					}
				} else {
					value.initialise( scope );
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
