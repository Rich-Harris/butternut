import FunctionNode from './shared/FunctionNode.js';

export default class FunctionExpression extends FunctionNode {
	getPrecedence () {
		return 20;
	}

	initialise () {
		super.initialise( this.scope );
	}
}
