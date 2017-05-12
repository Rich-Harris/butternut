import Node from '../Node.js';

export default class WhileStatement extends Node {
	getRightHandSide () {
		return this.body.getRightHandSide();
	}

	minify ( code ) {
		if ( this.test.start > this.start + 6 ) {
			code.overwrite( this.start + 5, this.test.start, '(' );
		}

		if ( this.body.start > this.test.end + 1 ) {
			code.overwrite( this.test.end, this.body.start, ')' );
		}

		// special case — empty body
		if ( this.body.body.length === 0 || this.body.body[0].type === 'EmptyStatement' ) {
			code.appendLeft( this.body.start, ';' );
			code.remove( this.body.start, this.body.end );
		}

		super.minify( code );
	}
}
