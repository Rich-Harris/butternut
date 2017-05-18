import Node from '../Node.js';

export default class TryStatement extends Node {
	initialise ( program, scope ) {
		program.addWord( 'try' );
		if ( this.finalizer ) program.addWord( 'finally' );

		super.initialise( program, scope );
	}

	minify ( code, chars ) {
		if ( this.block.start > this.start + 3 ) code.remove( this.start + 3, this.block.start );

		if ( this.handler ) {
			if ( this.handler.start > this.block.end ) {
				code.remove( this.block.end, this.handler.start );
			}

			if ( this.finalizer && this.finalizer.start > this.handler.end + 7 ) {
				code.overwrite( this.handler.end, this.finalizer.start, 'finally' );
			}
		} else {
			if ( this.finalizer.start > this.block.end + 7 ) {
				code.overwrite( this.block.end, this.finalizer.start, 'finally' );
			}
		}

		super.minify( code, chars );
	}
}
