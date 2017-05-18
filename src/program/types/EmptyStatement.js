import Node from '../Node.js';

export default class EmptyStatement extends Node {
	initialise ( program ) {
		// noop. this prevents Node#initialise from
		// 'de-skipping' this node
	}
}