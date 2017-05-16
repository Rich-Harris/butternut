import Node from '../Node.js';

export default class LabeledStatement extends Node {
	minify ( code ) {
		if ( this.body.start > this.label.end + 1 ) {
			code.overwrite( this.label.end, this.body.start, ':' );
		}

		// special case — empty body
		if ( this.body.isEmpty() ) {
			code.appendLeft( this.body.start, ';' );
			code.remove( this.body.start, this.body.end );
		} else {
			this.body.minify( code );
		}
	}
}
