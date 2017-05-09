import Node from '../Node.js';

export default class ExpressionStatement extends Node {
	getPrecedence () {
		return this.expression.getPrecedence();
	}
}
