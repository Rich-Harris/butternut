import Node from '../Node.js';
import { UNKNOWN, FALSY } from '../../utils/sentinels.js';

export default class ConditionalExpression extends Node {
	getValue () {
		const testValue = this.test.getValue();
		const consequentValue = this.consequent.getValue();
		const alternateValue = this.alternate.getValue();

		if ( testValue === UNKNOWN || consequentValue === UNKNOWN || alternateValue === UNKNOWN ) return UNKNOWN;

		return ( testValue && testValue !== FALSY ) ? consequentValue : alternateValue;
	}

	initialise () {
		const testValue = this.test.getValue();

		if ( testValue === UNKNOWN ) {
			super.initialise();
		} else if ( testValue ) {
			this.consequent.initialise();
		} else {
			this.alternate.initialise();
		}
	}

	minify ( code ) {
		const testValue = this.test.getValue();

		if ( testValue === UNKNOWN ) {
			// remove whitespace
			if ( this.consequent.start > this.test.end + 1 ) {
				code.overwrite( this.test.end, this.consequent.start, '?' );
			}

			if ( this.alternate.start > this.consequent.end + 1 ) {
				code.overwrite( this.consequent.end, this.alternate.start, ':' );
			}

			super.minify( code );
		} else if ( testValue && testValue !== FALSY ) {
			// remove test and alternate
			code.remove( this.start, this.consequent.start );
			code.remove( this.consequent.end, this.end );

			this.consequent.minify( code );
		} else {
			// remove test and consequent
			code.remove( this.start, this.alternate.start );

			this.alternate.minify( code );
		}
	}
}
