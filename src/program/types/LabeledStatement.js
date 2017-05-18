import Node from '../Node.js';

export default class LabeledStatement extends Node {
	getRightHandSide () {
		return this.body.getRightHandSide();
	}

	initialise ( program, scope ) {
		program.addWord( this.label.name );
		super.initialise( program, scope );
	}

	minify ( code, chars ) {
		// TODO can we mangle labels?

		if ( this.body.start > this.label.end + 1 ) {
			code.overwrite( this.label.end, this.body.start, ':' );
		}

		// special case — empty body
		if ( this.body.isEmpty() ) {
			code.appendLeft( this.body.start, ';' );
			code.remove( this.body.start, this.body.end );
		} else {
			this.body.minify( code, chars );
		}
	}
}
