import Node from '../Node.js';

export default class ArrowFunctionExpression extends Node {
	findScope () {
		return this.body.scope;
	}

	initialise () {
		this.body.createScope( this.parent.findScope( false ) );
		super.initialise();
	}

	findVarDeclarations () {
		// noop
	}

	minify ( code ) {
		let c = this.start;

		if ( this.params.length === 0 ) {
			if ( this.body.start > c + 4 ) {
				code.overwrite( c, this.body.start, '()=>' );
			}
		}

		else if ( this.params.length === 1 ) {
			if ( this.params[0].type === 'Identifier' ) {
				// remove parens
				if ( this.params[0].start > c ) {
					code.remove( c, this.params[0].start );
				}

				if ( this.body.start > this.params[0].end + 2 ) {
					code.overwrite( this.params[0].end, this.body.start, '=>' );
				}
			} else {
				if ( this.params[0].start > c + 1 ) {
					code.remove( c + 1, this.params[0].start );
				}

				if ( this.body.start > this.params[0].end + 3 ) {
					code.overwrite( this.params[0].end, this.body.start, ')=>' );
				}
			}
		}

		else {
			this.params.forEach( ( param, i ) => {
				if ( param.start > c + 1 ) code.overwrite( c, param.start, i ? ',' : '(' );
				c = param.end;
			});

			if ( this.body.start > c + 3 ) {
				code.overwrite( c, this.body.start, ')=>' );
			}
		}

		super.minify( code );
	}
}
