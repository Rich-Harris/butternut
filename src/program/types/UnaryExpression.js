import Node from '../Node.js';
import { UNKNOWN, TRUTHY, FALSY } from '../../utils/sentinels.js';
import stringify from '../../utils/stringify.js';

const calculators = {
	'!': x => !x,
	'~': x => ~x,
	'+': x => +x,
	'-': x => -x,
	'typeof': x  => typeof x,
	'void'  : x  => void x,
	'delete': () => UNKNOWN
};

export default class UnaryExpression extends Node {
	getPrecedence () {
		return 15;
	}

	getValue () {
		const arg = this.argument.getValue();

		if ( arg === UNKNOWN ) return UNKNOWN;

		if ( this.operator === '!' ) {
			if ( arg === TRUTHY ) return false;
			if ( arg === FALSY ) return true;
		}

		return calculators[ this.operator ]( arg );
	}

	minify ( code ) {
		const value = this.getValue();
		if ( value !== UNKNOWN && value !== TRUTHY && value !== FALSY ) {
			code.overwrite( this.start, this.end, stringify( value ) );
		}

		else {
			const len = this.operator.length;
			const start = this.start + len;

			const insertWhitespace = len > 1 && this.argument.getLeftHandSide().type !== 'ParenthesizedExpression';
			if ( insertWhitespace ) code.appendLeft( start, ' ' );

			code.remove( start, this.argument.start );

			super.minify( code );
		}
	}
}
