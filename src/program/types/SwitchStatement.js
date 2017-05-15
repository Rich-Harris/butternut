import Node from '../Node.js';
import { UNKNOWN } from '../../utils/sentinels.js';

export default class SwitchStatement extends Node {
	initialise ( scope ) {
		super.initialise( scope );

		if ( this.cases.length === 0 ) {
			const value = this.discriminant.getValue();
			this.skip = value !== UNKNOWN || this.discriminant.type === 'Identifier';
		}
	}

	minify ( code ) {
		// special (and unlikely!) case — no cases, but a non-removable discriminant
		if ( this.cases.length === 0 ) {
			this.discriminant.minify( code );
			code.remove( this.start, this.discriminant.start );
			code.remove( this.discriminant.end, this.end );
		}

		else {
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
}
