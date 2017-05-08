import Node from '../Node.js';

export default class DoWhileStatement extends Node {
	minify ( code ) {
		if ( this.test.start > this.body.end + 6 ) {
			code.overwrite( this.body.end, this.test.start, 'while(' );
		}

		if ( this.end > this.test.end + 1 ) {
			let c = this.end;
			while ( code.original[ c - 1 ] === ';' ) c -= 1;
			code.overwrite( this.test.end, c, ')' );
		}

		super.minify( code );
	}
}
