"use strict";module.export({default:()=>LogicalExpression});var Node;module.watch(require('../Node.js'),{default:function(v){Node=v}},0);var UNKNOWN,FALSY;module.watch(require('../../utils/sentinels.js'),{UNKNOWN:function(v){UNKNOWN=v},FALSY:function(v){FALSY=v}},1);


class LogicalExpression extends Node {
	getLeftHandSide () {
		return this.left.getLeftHandSide();
	}

	getPrecedence () {
		const leftValue = this.left.getValue();
		const rightValue = this.right.getValue();

		if ( leftValue === UNKNOWN || rightValue === UNKNOWN ) return this.operator === '&&' ? 6 : 5;

		return 20; // will be replaced by a literal
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
				code.remove( this.left.end, this.end );
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
