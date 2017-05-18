import FunctionNode from './shared/FunctionNode.js';

export default class FunctionExpression extends FunctionNode {
	getPrecedence () {
		return 0;
	}

	initialise ( program ) {
		program.addWord( 'function' ); // TODO only if has function keyword
		super.initialise( program, this.scope );
	}
}
