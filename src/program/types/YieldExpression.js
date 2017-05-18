import Node from '../Node.js';

export default class YieldExpression extends Node {
	getPrecedence () {
		return 2;
	}

	initialise ( program, scope ) {
		program.addWord( 'yield' );
		super.initialise( program, scope );
	}
}
