import { UNKNOWN } from '../utils/sentinels.js';
import blockBreaksExecution from './blockBreaksExecution.js';

export default function breaksExecution ( node ) {
	if ( node.type === 'ReturnStatement' || node.type === 'BreakStatement' || node.type === 'ContinueStatement' ) {
		return node;
	}

	if ( node.type === 'IfStatement' ) {
		const testValue = node.test.getValue();

		if ( testValue === UNKNOWN ) return null;

		if ( testValue ) { // if ( true ) {...}
			return blockBreaksExecution( node.consequent.body );
		}

		// if ( false ) {...}
		if ( !node.alternate ) return null;

		if ( node.alternate.type === 'BlockStatement' ) {
			return blockBreaksExecution( node.alternate.body );
		}

		if ( node.alternate.type === 'IfStatement' ) {
			return breaksExecution( node.alternate );
		}

		return null;
	}
}
