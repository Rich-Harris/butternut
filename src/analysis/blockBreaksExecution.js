import breaksExecution from './breaksExecution.js';

export default function blockBreaksExecution ( body ) {
	let i = body.length;
	while ( i-- ) {
		const maybeReturnNode = breaksExecution( body[i] );
		if ( maybeReturnNode ) return maybeReturnNode;
	}

	return null;
}
