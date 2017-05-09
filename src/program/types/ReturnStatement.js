import Node from '../Node.js';

const invalidChars = /[a-zA-Z$_0-9/]/;

export default class ReturnStatement extends Node {
	minify ( code ) {
		if ( !this.argument ) return;

		const expression = this.argument.getLeftHandSide();

		const needsTrailingWhitespace = invalidChars.test( code.original[ expression.start ] );

		if ( needsTrailingWhitespace && this.argument.start === this.start + 6 ) {
			// ensure that parenthesized expression isn't too close
			code.appendLeft( this.start + 6, ' ' );
		}

		let c = this.start + ( needsTrailingWhitespace ? 7 : 6 );
		if ( this.argument.start > c ) {
			code.remove( c, this.argument.start );
		}

		this.argument.minify( code );
	}
}
