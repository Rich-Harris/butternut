import Node from '../Node.js';

export default class SwitchCase extends Node {
	getRightHandSide () {
		if ( this.consequent.length > 0 ) {
			return this.consequent[ this.consequent.length - 1 ].getRightHandSide();
		}

		return this;
	}

	initialise ( program, scope ) {
		program.addWord( this.test ? 'case' : 'default' );
		super.initialise( program, scope );
	}

	minify ( code, chars ) {
		let c;

		if ( this.test ) {
			this.test.minify( code, chars );

			if ( this.test.start > this.start + 5 ) {
				code.remove( this.start + 5, this.test.start );
			}

			c = this.test.end;
		} else {
			// default
			c = this.start + 7;
		}

		this.consequent.forEach( ( statement, i ) => {
			statement.minify( code, chars );

			const separator = i ? ';' : ':'; // TODO can consequents be written as sequences?

			if ( statement.start === c ) {
				code.appendLeft( c, separator );
			} else {
				if ( code.original.slice( c, statement.start ) !== separator ) {
					code.overwrite( c, statement.start, separator );
				}
			}

			c = statement.end;
			while ( code.original[ c - 1 ] === ';' ) c -= 1;
		});
	}
}
