"use strict";module.export({default:()=>blockBreaksExecution});var breaksExecution;module.watch(require('./breaksExecution.js'),{default:function(v){breaksExecution=v}},0);

function blockBreaksExecution ( body ) {
	let i = body.length;
	while ( i-- ) {
		const maybeReturnNode = breaksExecution( body[i] );
		if ( maybeReturnNode ) return maybeReturnNode;
	}

	return null;
}
