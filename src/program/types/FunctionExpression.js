import FunctionNode from './shared/FunctionNode.js';

export default class FunctionExpression extends FunctionNode {
	getPrecedence () {
		return 0;
	}

	initialise ( program ) {
		program.addWord( 'function' );
		super.initialise( program, this.scope );
	}
}
