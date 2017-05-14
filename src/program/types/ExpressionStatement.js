import Node from '../Node.js';

export default class ExpressionStatement extends Node {
	canSequentialise () {
		return true;
	}

	getPrecedence () {
		return this.expression.getPrecedence();
	}

	initialise ( scope ) {
		if ( this.expression.type === 'Literal' ) {
			// remove side-effect-free statements (TODO others, not just literals)...
			return;
		}

		super.initialise( scope );
	}
}
