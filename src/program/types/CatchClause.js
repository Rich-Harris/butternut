import Node from '../Node.js';

export default class CatchClause extends Node {
	minify ( code ) {
		if ( this.param.start > this.start + 6 ) {
			code.overwrite( this.start + 5, this.param.start, '(' );
		}

		if ( this.body.start > this.param.end + 1 ) {
			code.overwrite( this.param.end, this.body.start, ')' );
		}

		super.minify( code );
	}
}
