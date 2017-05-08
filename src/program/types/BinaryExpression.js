import Node from '../Node.js';
import { UNKNOWN } from '../../utils/sentinels.js';

const calculators = {
	'**' : ( a, b ) => Math.power( a, b ),
	'*'  : ( a, b ) => a * b,
	'/'  : ( a, b ) => a / b,
	'%'  : ( a, b ) => a % b,
	'+'  : ( a, b ) => a + b,
	'-'  : ( a, b ) => a - b,
	'<<' : ( a, b ) => a << b,
	'>>' : ( a, b ) => a >> b,
	'>>>': ( a, b ) => a >>> b,
	'<'  : ( a, b ) => a < b,
	'<=' : ( a, b ) => a <= b,
	'>'  : ( a, b ) => a > b,
	'>=' : ( a, b ) => a >= b,
	'==' : ( a, b ) => a == b,
	'!=' : ( a, b ) => a != b,
	'===': ( a, b ) => a === b,
	'!==': ( a, b ) => a !== b,
	'&'  : ( a, b ) => a & b,
	'^'  : ( a, b ) => a ^ b,
	'|'  : ( a, b ) => a | b,
	in   : ( a, b ) => a in b,
	instanceof: ( a, b ) => a instanceof b
};

export default class BinaryExpression extends Node {
	getValue () {
		const left = this.left.getValue();
		const right = this.right.getValue();

		if ( left === UNKNOWN || right === UNKNOWN ) return UNKNOWN;

		return calculators[ this.operator ]( left, right );
	}

	minify ( code ) {
		const value = this.getValue();

		if ( value !== UNKNOWN ) {
			code.overwrite( this.start, this.end, JSON.stringify( value ) );
		}

		else {
			const operator = /\w/.test( this.operator ) ? ` ${this.operator} ` : this.operator;

			if ( this.right.start > this.left.end + operator.length ) {
				code.overwrite( this.left.end, this.right.start, operator );
			}

			super.minify( code );
		}
	}
}
