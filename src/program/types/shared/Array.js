import Node from '../../Node.js';
import { UNKNOWN, TRUTHY, FALSY } from '../../../utils/sentinels.js';

export default class ArrayExpression extends Node {
	getValue () {
		let values = new Array( this.elements.length );

		for ( let i = 0; i < this.elements.length; i += 1 ) {
			const element = this.elements[i];

			if ( element ) {
				const value = element.getValue();
				if ( value === UNKNOWN || value === TRUTHY || value === FALSY ) return TRUTHY;

				values[i] = value;
			}
		}

		return values;
	}

	minify ( code ) {
		let c = this.start;

		if ( this.elements.length ) {
			this.elements.forEach( ( element, i ) => {
				if ( element.start > c + 1 ) code.overwrite( c, element.start, i ? ',' : '[' );
				c = element.end;
			});

			if ( this.end > c + 1 ) code.overwrite( c, this.end, ']' );
		}

		else {
			if ( this.end > c + 2 ) code.overwrite( c, this.end, '[]' );
		}

		super.minify( code );
	}
}
