import Node from '../Node.js';
import { UNKNOWN } from '../../utils/sentinels.js';
import stringify from '../../utils/stringify.js';

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

const binaryExpressionPrecedence = {};
[
	[  7, '|' ],
	[  8, '^' ],
	[  9, '&' ],
	[ 10, '!== === != ==' ],
	[ 11, 'instanceof in >= > <= <' ],
	[ 12, '>>> >> <<' ],
	[ 13, '- +' ],
	[ 14, '% / * **' ]
].forEach( ([ precedence, operators ]) => {
	operators.split( ' ' ).forEach( operator => binaryExpressionPrecedence[ operator ] = precedence );
});

export default class BinaryExpression extends Node {
	getLeftHandSide () {
		return this.left.getLeftHandSide();
	}

	getPrecedence () {
		const left = this.left.getValue();
		const right = this.right.getValue();

		if ( left === UNKNOWN || right === UNKNOWN ) return binaryExpressionPrecedence[ this.operator ];

		return 20; // will be replaced by a literal
	}

	getValue () {
		const left = this.left.getValue();
		const right = this.right.getValue();

		if ( left === UNKNOWN || right === UNKNOWN ) return UNKNOWN;

		return calculators[ this.operator ]( left, right );
	}

	minify ( code ) {
		const value = this.getValue();

		if ( value !== UNKNOWN ) {
			code.overwrite( this.start, this.end, stringify( value ) );
		}

		else {
			let operator = this.operator;

			if ( code.original[ this.right.getLeftHandSide().start ] === operator ) {
				// prevent e.g. `1 - --t` becoming 1---t
				operator = `${operator} `;
			} else if ( /\w/.test( this.operator ) ) {
				// `foo in bar`, not `fooinbar`
				operator = ` ${operator} `;
			}

			if ( this.right.start > this.left.end + operator.length ) {
				code.overwrite( this.left.end, this.right.start, operator );
			}

			super.minify( code );
		}
	}
}
