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

		let lastStatement;
		this.consequent.forEach( ( statement, i ) => {
			if ( i === 0 ) {
				code.overwrite( c, statement.start, ':' );
			} else {
				code.remove( c, statement.start );
				lastStatement.append( code, ';' );
			}

			statement.minify( code, chars );

			if ( i < this.consequent.length - 1 ) {
				c = statement.end;
				while ( code.original[c - 1] === ';' ) c -= 1;
			}

			lastStatement = statement;
		});
	}
}
