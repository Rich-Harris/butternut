import Node from '../Node.js';

export default class ClassBody extends Node {
	attachScope ( parent ) {
		for ( let i = 0; i < this.body.length; i += 1 ) {
			this.body[i].value.attachScope( parent );
		}
	}

	minify ( code ) {
		let c = this.start + 1;

		for ( let i = 0; i < this.body.length; i += 1 ) {
			const method = this.body[i];
			if ( method.start > c ) code.remove( c, method.start );

			method.minify( code );

			c = method.end;
		}

		if ( this.end > c + 1 ) code.remove( c, this.end - 1 );
	}
}
