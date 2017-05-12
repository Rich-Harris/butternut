import Node from '../Node.js';
import minifyPropertyKey from './shared/minifyPropertyKey.js';

export default class ClassBody extends Node {
	minify ( code ) {
		let c = this.start + 1;

		for ( let i = 0; i < this.body.length; i += 1 ) {
			const method = this.body[i];
			if ( method.start > c ) code.remove( c, method.start );

			minifyPropertyKey( code, method, false );

			c = method.end;
		}

		if ( this.end > c + 1 ) code.remove( c, this.end - 1 );

		super.minify( code );
	}
}
