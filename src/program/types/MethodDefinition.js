import Node from '../Node.js';

export default class MethodDefinition extends Node {
	minify ( code ) {
		if ( this.computed ) {
			if ( this.key.start > this.start + 1 ) code.remove( this.start + 1, this.key.start );
			if ( this.value.start > this.key.end + 1 ) code.overwrite( this.key.end, this.value.start, ']' );
		}

		else {
			if ( this.value.start > this.key.end ) code.remove( this.key.end, this.value.start );
		}

		super.minify( code );
	}
}
