import Node from '../Node.js';

export default class ExpressionStatement extends Node {
	getPrecedence () {
		return this.expression.getPrecedence();
	}

	initialise ( scope ) {
		if ( this.expression.type === 'Literal' ) {
			// remove side-effect-free statements (TODO others, not just literals)...
			if ( this.expression.value !== 'use strict' ) {
				// ...unless this is a 'use strict' pragma (TODO remove if it's not the first node in a function/program block)
				return;
			}
		}

		super.initialise( scope );
	}
}
