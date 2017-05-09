import Node from '../Node.js';

export default class NewExpression extends Node {
	getPrecedence () {
		return this.end > this.callee.end ? 18 : 17;
	}
}
