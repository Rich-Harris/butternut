import Node from '../../Node.js';
import isNegativeZero from '../../../utils/isNegativeZero.js';
import { UNKNOWN } from '../../../utils/sentinels.js';

function shouldParenthesizeSuperclass ( node ) {
	while ( node.type === 'ParenthesizedExpression' ) node = node.expression;

	const value = node.getValue();
	if ( value === UNKNOWN ) return node.getPrecedence() < 18;

	return ( value === true || value === false || value === undefined || isNegativeZero( value ) );
}

export default class Class extends Node {
	initialise ( program, scope ) {
		program.addWord( 'class' );
		super.initialise( program, scope );
	}

	minify ( code, chars ) {
		let c = this.start + 5;

		if ( this.id ) {
			if ( this.id.start > c + 1 ) code.remove( c + 1, this.id.start );
			c = this.id.end;
		}

		if ( this.superClass ) {
			// edge case
			if ( shouldParenthesizeSuperclass( this.superClass ) ) {
				code.overwrite( c, this.superClass.start, ' extends(' );
				code.prependRight( this.body.start, ')' );
			}

			else if ( this.superClass.start > c + 8 ) {
				code.overwrite( c, this.superClass.start, ' extends ' );
			}

			c = this.superClass.end;
		}

		if ( this.body.start > c ) code.remove( c, this.body.start );

		super.minify( code, chars );
	}
}
