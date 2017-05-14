import { UNKNOWN } from '../utils/sentinels.js';

// TODO make this a method of nodes
export default function breaksExecution ( node ) {
	if ( node.type === 'ReturnStatement' || node.type === 'BreakStatement' || node.type === 'ContinueStatement' ) {
		return node;
	}

	if ( node.type === 'BlockStatement' ) {
		let i = node.body.length;
		while ( i-- ) {
			const maybeReturnNode = breaksExecution( node.body[i] );
			if ( maybeReturnNode ) return maybeReturnNode;
		}
	}

	if ( node.type === 'IfStatement' ) {
		const testValue = node.test.getValue();

		if ( testValue === UNKNOWN ) return null;

		if ( testValue ) { // if ( true ) {...}
			return breaksExecution( node.consequent );
		}

		// if ( false ) {...}
		if ( !node.alternate ) return null;

		return breaksExecution( node.alternate );
	}
}
