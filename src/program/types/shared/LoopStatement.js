import Node from '../../Node.js';

export default class LoopStatement extends Node {
	minify ( code ) {
		// special case — empty body
		if ( this.body.body.length === 0 || this.body.body[0].type === 'EmptyStatement' ) {
			code.appendLeft( this.body.start, ';' );
			code.remove( this.body.start, this.body.end );
		}

		super.minify( code );
	}
}
