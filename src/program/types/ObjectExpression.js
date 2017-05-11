import Node from '../Node.js';
import { TRUTHY } from '../../utils/sentinels.js';

export default class ObjectExpression extends Node {
	getValue () {
		return TRUTHY;
	}

	minify ( code ) {
		let c = this.start;

		if ( this.properties.length ) {
			for ( let i = 0; i < this.properties.length; i += 1 ) {
				const p = this.properties[i];

				if ( p.start > c + 1 ) code.overwrite( c, p.start, i ? ',' : '{' );

				if ( p.computed && p.method ) {
					code.overwrite( p.start, p.key.start, '[' );
					code.overwrite( p.key.end, p.value.start, ']' );
				}

				else if ( p.computed ) {
					code.overwrite( p.start, p.key.start, '[' );
					code.overwrite( p.key.end, p.value.start, ']:' );
				}

				else if ( p.method ) {
					code.remove( p.key.end, p.value.start );
				}

				else {
					if ( p.value.start > p.key.end + 1 ) code.overwrite( p.key.end, p.value.start, ':' );
				}

				c = p.end;
			}

			if ( this.end > c + 1 ) code.remove( c, this.end - 1 );
		} else {
			if ( this.end > this.start + 2 ) code.overwrite( this.start, this.end, '{}' );
		}

		super.minify( code );
	}
}
