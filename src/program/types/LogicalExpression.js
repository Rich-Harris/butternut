import Node from '../Node.js';
import { UNKNOWN } from '../../utils/sentinels.js';

export default class LogicalExpression extends Node {
	getLeftHandSide () {
		const leftValue = this.left.getValue();

		if ( leftValue === UNKNOWN ) return this.left.getLeftHandSide();

		return ( this.operator === '&&' ?
			( leftValue ? this.right : this.left ) :
			( leftValue ? this.left : this.right )
		).getLeftHandSide();
	}

	getPrecedence () {
		const leftValue = this.left.getValue();
		const rightValue = this.right.getValue();

		if ( leftValue === UNKNOWN || rightValue === UNKNOWN ) return this.operator === '&&' ? 6 : 5;

		return 20; // will be replaced by a literal
	}

	getRightHandSide () {
		const leftValue = this.left.getValue();

		if ( leftValue === UNKNOWN ) return this.right.getRightHandSide();

		return ( this.operator === '&&' ?
			( leftValue ? this.right : this.left ) :
			( leftValue ? this.left : this.right )
		).getRightHandSide();
	}

	getValue () {
		const leftValue = this.left.getValue();
		const rightValue = this.right.getValue();

		if ( leftValue === UNKNOWN || rightValue === UNKNOWN ) return UNKNOWN;

		if ( this.operator === '&&' ) {
			if ( leftValue ) return rightValue;
		} else {
			if ( leftValue ) return leftValue;
			return rightValue;
		}
	}

	minify ( code, chars ) {
		const leftValue = this.left.getValue();

		if ( leftValue === UNKNOWN ) {
			if ( this.right.start > this.left.end + this.operator.length ) {
				code.overwrite( this.left.end, this.right.start, this.operator );
			}

			super.minify( code, chars );
		}

		else if ( leftValue ) {
			if ( this.operator === '&&' ) {
				code.remove( this.start, this.right.start );
				this.right.minify( code, chars );
			} else {
				code.remove( this.left.end, this.end );
				this.left.minify( code, chars );
			}
		}

		else {
			if ( this.operator === '&&' ) {
				code.remove( this.left.end, this.end );
				this.left.minify( code, chars );
			} else {
				code.remove( this.start, this.right.start );
				this.right.minify( code, chars );
			}
		}
	}
}
