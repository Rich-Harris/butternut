import Node from '../Node.js';
import { UNKNOWN } from '../../utils/sentinels.js';

export default class ExpressionStatement extends Node {
	canSequentialise () {
		return true;
	}

	getPrecedence () {
		return this.expression.getPrecedence();
	}

	initialise ( scope ) {
		if ( this.expression.type === 'Literal' || this.expression.getValue() !== UNKNOWN ) {
			// remove side-effect-free statements (TODO others, not just literals)...
			return;
		}

		super.initialise( scope );
	}
}
