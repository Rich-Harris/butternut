import Node from '../Node.js';

export default class ClassBody extends Node {
	attachScope ( program, parent ) {
		for ( let i = 0; i < this.body.length; i += 1 ) {
			this.body[i].attachScope( program, parent );
		}
	}

	minify ( code, chars ) {
		let c = this.start + 1;

		for ( let i = 0; i < this.body.length; i += 1 ) {
			const method = this.body[i];
			if ( method.start > c ) code.remove( c, method.start );

			method.minify( code, chars );

			c = method.end;
		}

		if ( this.end > c + 1 ) code.remove( c, this.end - 1 );
	}
}
