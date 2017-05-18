import Node from '../../Node.js';
import { UNKNOWN } from '../../../utils/sentinels.js';

export default class ArrayExpression extends Node {
	getValue () {
		let values = new Array( this.elements.length );

		for ( let i = 0; i < this.elements.length; i += 1 ) {
			const element = this.elements[i];

			if ( element ) {
				const value = element.getValue();
				if ( value === UNKNOWN ) return UNKNOWN;

				values[i] = value;
			}
		}

		return values;
	}

	minify ( code, chars ) {
		let c = this.start;

		if ( this.elements.length ) {
			let insert = '[';
			this.elements.forEach( ( element, i ) => {
				if ( !element ) {
					insert += i === this.elements.length - 1 ? ',]' : ',';
					return;
				}

				if ( element.start > c + 1 ) code.overwrite( c, element.start, insert );
				c = element.end;

				insert = i === this.elements.length - 1 ? ']' : ',';
			});

			if ( this.end > insert.length ) code.overwrite( c, this.end, insert );
		}

		else {
			if ( this.end > c + 2 ) code.overwrite( c, this.end, '[]' );
		}

		super.minify( code, chars );
	}
}
