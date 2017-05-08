import Node from '../Node.js';

export default class ClassBody extends Node {
	minify ( code ) {
		let c = this.start + 1;

		for ( let i = 0; i < this.body.length; i += 1 ) {
			const method = this.body[i];

			if ( method.start > c ) code.remove( c, method.start );
			c = method.end;
		}

		if ( this.end > c + 1 ) code.remove( c, this.end - 1 );

		super.minify( code );
	}
}
