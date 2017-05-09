import Node from '../Node.js';

export default class SpreadElement extends Node {
	getPrecedence () {
		return 1;
	}
}
