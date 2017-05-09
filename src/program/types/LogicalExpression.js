import Node from '../Node.js';
import { UNKNOWN, FALSY } from '../../utils/sentinels.js';

export default class LogicalExpression extends Node {
	getPrecedence () {
		return this.operator === '&&' ? 6 : 5;
	}

	getValue () {
		const leftValue = this.left.getValue();
		const rightValue = this.right.getValue();

		if ( leftValue === UNKNOWN || rightValue === UNKNOWN ) return UNKNOWN;

		if ( this.operator === '&&' ) {
			if ( leftValue && leftValue !== FALSY ) return rightValue;
		} else {
			if ( leftValue && leftValue !== FALSY ) return leftValue;
			return rightValue;
		}
	}

	minify ( code ) {
		const leftValue = this.left.getValue();

		if ( leftValue === UNKNOWN ) {
			if ( this.right.start > this.left.end + this.operator.length ) {
				code.overwrite( this.left.end, this.right.start, this.operator );
			}

			super.minify( code );
		}

		else if ( leftValue && leftValue !== FALSY ) {
			if ( this.operator === '&&' ) {
				code.remove( this.start, this.right.start );
				this.right.minify( code );
			} else {
				code.remove( this.left.start, this.end );
				this.left.minify( code );
			}
		}

		else {
			if ( this.operator === '&&' ) {
				code.remove( this.left.start, this.end );
				this.left.minify( code );
			} else {
				code.remove( this.start, this.right.start );
				this.right.minify( code );
			}
		}
	}
}
