"use strict";module.export({default:()=>breaksExecution});var UNKNOWN;module.watch(require('../utils/sentinels.js'),{UNKNOWN:function(v){UNKNOWN=v}},0);var blockBreaksExecution;module.watch(require('./blockBreaksExecution.js'),{default:function(v){blockBreaksExecution=v}},1);


function breaksExecution ( node ) {
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
