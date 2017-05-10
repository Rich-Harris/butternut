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

		super.minify( code );
	}
}
