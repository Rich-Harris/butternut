import { UNKNOWN } from '../utils/sentinels.js';
import CompileError from '../utils/CompileError.js';

export default class Node {
	ancestor ( level ) {
		let node = this;
		while ( level-- ) {
			node = node.parent;
			if ( !node ) return null;
		}

		return node;
	}

	append ( code, content ) {
		code.appendLeft( this.getRightHandSide().end, content );
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

	canSequentialise () {
		return false;
	}

	contains ( node ) {
		while ( node ) {
			if ( node === this ) return true;
			node = node.parent;
		}

		return false;
	}

	error ( message ) {
		throw new CompileError( this, message );
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
		this.skip = false;

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

	isEmpty () {
		return this.skip;
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

	move ( code, position ) {
		code.move( this.getLeftHandSide().start, this.getRightHandSide().end, position );
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

	parenthesize ( code ) {
		this.prepend( code, '(' );
		this.append( code, ')' );
	}

	prepend ( code, content ) {
		code.prependRight( this.getLeftHandSide().start, content );
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
