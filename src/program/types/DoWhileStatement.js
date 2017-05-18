import Node from '../Node.js';

export default class DoWhileStatement extends Node {
	initialise ( program, scope ) {
		program.addWord( 'dowhile' );
		super.initialise( program, scope );
	}

	minify ( code, chars ) {
		// special case
		if ( this.body.isEmpty() ) {
			code.overwrite( this.start + 2, this.test.start, ';while(' );
		}

		else {
			this.body.minify( code, chars );

			if ( this.body.type === 'BlockStatement' ) {
				code.remove( this.start + 2, this.body.start );
				code.overwrite( this.body.end, this.test.start, 'while(' );
			} else {
				if ( this.body.start > this.start + 2 ) code.remove( this.start + 2, this.body.start );
				this.body.prepend( code, '{' );

				let c = this.body.end;
				while ( code.original[ c - 1 ] === ';' ) c -= 1;
				code.overwrite( c, this.test.start, '}while(' );
			}
		}

		if ( this.end > this.test.end + 1 ) {
			let c = this.end;
			while ( code.original[ c - 1 ] === ';' ) c -= 1;
			code.overwrite( this.test.end, c, ')' );
		}

		this.test.minify( code, chars );
	}
}
