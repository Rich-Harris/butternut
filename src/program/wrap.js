import types from './types/index.js';
import BlockStatement from './BlockStatement.js';
import Node from './Node.js';
import keys from './keys.js';

export default function wrap ( raw, parent ) {
	if ( !raw ) return;

	if ( 'length' in raw ) {
		let i = raw.length;
		while ( i-- ) wrap( raw[i], parent );
		return;
	}

	// with e.g. shorthand properties, key and value are
	// the same node. We don't want to wrap an object twice
	if ( raw.__wrapped ) return;
	raw.__wrapped = true;

	if ( !keys[ raw.type ] ) {
		keys[ raw.type ] = Object.keys( raw ).filter( key => typeof raw[ key ] === 'object' );
	}

	raw.skip = true;
	raw.parent = parent;
	raw.program = parent.program || parent;
	raw.depth = parent.depth + 1;
	raw.keys = keys[ raw.type ];
	raw.indentation = undefined;

	for ( const key of keys[ raw.type ] ) {
		wrap( raw[ key ], raw );
	}

	raw.program.magicString.addSourcemapLocation( raw.start );
	raw.program.magicString.addSourcemapLocation( raw.end );

	const type = ( raw.type === 'BlockStatement' ? BlockStatement : types[ raw.type ] ) || Node;
	raw.__proto__ = type.prototype;
}
