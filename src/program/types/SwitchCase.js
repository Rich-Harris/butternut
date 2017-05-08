import Node from '../Node.js';

export default class SwitchCase extends Node {
	minify ( code ) {
		let c;

		if ( this.test ) {
			if ( this.test.start > this.start + 5 ) {
				code.remove( this.start + 5, this.test.start );
			}

			c = this.test.end;
		} else {
			// default
			c = this.start + 7;
		}

		this.consequent.forEach( ( statement, i ) => {
			if ( statement.start > c + 1 ) code.overwrite( c, statement.start, i ? ';' : ':' );

			c = statement.end;
			while ( code.original[ c - 1 ] === ';' ) c -= 1;
		});

		super.minify( code );
	}
}
