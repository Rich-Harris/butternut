import Node from '../Node.js';

export default class DoWhileStatement extends Node {
	minify ( code ) {
		// special case
		if ( this.body.body.length === 0 || this.body.body[0].type === 'EmptyStatement' ) {
			code.overwrite( this.start + 2, this.test.start, ';while(' );
		}

		else {
			if ( this.body.synthetic ) {
				code.overwrite( this.start + 2, this.body.body[0].start, '{' );

				let c = this.body.body[ this.body.body.length - 1 ].end;
				while ( code.original[ c - 1 ] === ';' ) c -= 1;
				code.overwrite( c, this.test.start, '}while(' );
			} else {
				code.remove( this.start + 2, this.body.start );
				code.overwrite( this.body.end, this.test.start, 'while(' );
			}
		}

		if ( this.end > this.test.end + 1 ) {
			let c = this.end;
			while ( code.original[ c - 1 ] === ';' ) c -= 1;
			code.overwrite( this.test.end, c, ')' );
		}

		super.minify( code );
	}
}
