import Node from '../Node.js';

export default class SwitchStatement extends Node {
	minify ( code ) {
		if ( this.discriminant.start > this.start + 7 ) {
			code.overwrite( this.start + 6, this.discriminant.start, '(' );
		}

		let c = this.discriminant.end;

		this.cases.forEach( ( switchCase, i ) => {
			if ( switchCase.start > c + ( i ? 1 : 2 ) ) {
				code.overwrite( c, switchCase.start, i ? ';' : '){' );
			}

			c = switchCase.end;
			while ( code.original[ c - 1 ] === ';' ) c -= 1;
		});

		if ( this.end > c + 1 ) code.overwrite( c, this.end, '}' );

		super.minify( code );
	}
}
