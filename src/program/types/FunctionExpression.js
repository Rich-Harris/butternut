import Function from './shared/Function.js';

export default class FunctionExpression extends Function {
	getPrecedence () {
		return 20;
	}

	initialise () {
		super.initialise( this.scope );
	}
}
