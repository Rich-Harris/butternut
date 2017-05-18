import Node from '../Node.js';
import { UNKNOWN } from '../../utils/sentinels.js';
import stringify from '../../utils/stringify.js';

const invalidChars = /[a-zA-Z$_0-9/]/;

export default class ReturnStatement extends Node {
	initialise ( program, scope ) {
		program.addWord( 'return' );
		super.initialise( program, scope );
	}

	minify ( code, chars ) {
		if ( !this.argument ) return;

		const value = this.argument.getValue();

		const needsTrailingWhitespace = value === UNKNOWN ?
			invalidChars.test( code.original[ this.argument.getLeftHandSide().start ] ) :
			invalidChars.test( stringify( value )[0] );

		if ( needsTrailingWhitespace && this.argument.start === this.start + 6 ) {
			// ensure that parenthesized expression isn't too close
			code.appendLeft( this.start + 6, ' ' );
		}

		let c = this.start + ( needsTrailingWhitespace ? 7 : 6 );
		if ( this.argument.start > c ) {
			code.remove( c, this.argument.start );
		}

		this.argument.minify( code, chars );
	}
}
