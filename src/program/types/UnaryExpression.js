import Node from '../Node.js';
import { UNKNOWN } from '../../utils/sentinels.js';
import stringify from '../../utils/stringify.js';
import getValuePrecedence from '../../utils/getValuePrecedence.js';

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
		const value = this.getValue();
		return value === UNKNOWN ? 16 : getValuePrecedence( value );
	}

	getValue () {
		const arg = this.argument.getValue();

		if ( arg === UNKNOWN ) return UNKNOWN;
		return calculators[ this.operator ]( arg );
	}

	minify ( code, chars ) {
		const value = this.getValue();
		if ( value !== UNKNOWN ) {
			code.overwrite( this.start, this.end, stringify( value ) );
		}

		else {
			const len = this.operator.length;
			const start = this.start + len;

			const insertWhitespace = len > 1 && this.argument.getLeftHandSide().type !== 'ParenthesizedExpression';
			if ( insertWhitespace ) code.appendLeft( start, ' ' );

			code.remove( start, this.argument.start );

			super.minify( code, chars );
		}
	}
}
