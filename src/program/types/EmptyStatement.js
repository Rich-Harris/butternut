import Node from '../Node.js';

export default class EmptyStatement extends Node {
	initialise () {
		// noop. this prevents Node#initialise from
		// 'de-skipping' this node
	}
}