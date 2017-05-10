import Node from '../Node.js';

export default class ObjectPattern extends Node {
	minify ( code ) {
		let c = this.start + 1;
		for ( let i = 0; i < this.properties.length; i += 1 ) {
			// TODO remove unused properties
			const property = this.properties[i];
			property.minify( code );

			if ( property.start > c ) code.overwrite( c, property.start, i ? ',' : '' );
			c = property.end;
		}

		code.remove( c, this.end - 1 );
	}
}
