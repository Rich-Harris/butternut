"use strict";module.export({default:()=>UnaryExpression});var Node;module.watch(require('../Node.js'),{default:function(v){Node=v}},0);var UNKNOWN,TRUTHY,FALSY;module.watch(require('../../utils/sentinels.js'),{UNKNOWN:function(v){UNKNOWN=v},TRUTHY:function(v){TRUTHY=v},FALSY:function(v){FALSY=v}},1);var stringify;module.watch(require('../../utils/stringify.js'),{default:function(v){stringify=v}},2);



const calculators = {
	'!': x => !x,
	'~': x => ~x,
	'+': x => +x,
	'-': x => -x,
	'typeof': x  => typeof x,
	'void'  : x  => void x,
	'delete': () => UNKNOWN
};

class UnaryExpression extends Node {
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
