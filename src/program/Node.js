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

	attachScope ( program, scope ) {
		for ( var key of this.keys ) {
			const value = this[ key ];

			if ( value ) {
				if ( 'length' in value ) {
					let i = value.length;
					while ( i-- ) {
						if ( value[i] ) value[i].attachScope( program, scope );
					}
				} else {
					value.attachScope( program, scope );
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

	initialise ( program, scope ) {
		this.skip = false;

		for ( var key of this.keys ) {
			const value = this[ key ];

			if ( value ) {
				if ( 'length' in value ) {
					let i = value.length;
					while ( i-- ) {
						if ( value[i] ) value[i].initialise( program, scope );
					}
				} else {
					value.initialise( program, scope );
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

	minify ( code, chars ) {
		for ( var key of this.keys ) {
			const value = this[ key ];

			if ( value ) {
				if ( 'length' in value ) {
					let i = value.length;
					while ( i-- ) {
						if ( value[i] ) value[i].minify( code, chars );
					}
				} else {
					value.minify( code, chars );
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
