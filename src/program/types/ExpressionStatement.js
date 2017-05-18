import Node from '../Node.js';
import { UNKNOWN } from '../../utils/sentinels.js';

export default class ExpressionStatement extends Node {
	canSequentialise () {
		return true;
	}

	getLeftHandSide () {
		return this.expression.getLeftHandSide();
	}

	getPrecedence () {
		return this.expression.getPrecedence();
	}

	getRightHandSide () {
		return this.expression.getRightHandSide();
	}

	initialise ( program, scope ) {
		if ( this.expression.type === 'Literal' || this.expression.getValue() !== UNKNOWN ) {
			// remove side-effect-free statements (TODO others, not just literals)...
			return;
		}

		super.initialise( program, scope );
	}
}
