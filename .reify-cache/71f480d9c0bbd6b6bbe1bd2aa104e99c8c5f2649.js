"use strict";module.export({default:()=>wrap});var types;module.watch(require('./types/index.js'),{default:function(v){types=v}},0);var BlockStatement;module.watch(require('./BlockStatement.js'),{default:function(v){BlockStatement=v}},1);var Node;module.watch(require('./Node.js'),{default:function(v){Node=v}},2);var keys;module.watch(require('./keys.js'),{default:function(v){keys=v}},3);




const statementsWithBlocks = {
	ForStatement: 'body',
	ForInStatement: 'body',
	ForOfStatement: 'body',
	WhileStatement: 'body',
	DoWhileStatement: 'body',
	ArrowFunctionExpression: 'body'
};

function synthetic ( expression ) {
	return {
		start: expression.start,
		end: expression.end,
		type: 'BlockStatement',
		body: [ expression ],
		synthetic: true
	};
}

function wrap ( raw, parent ) {
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

	// create synthetic block statements, otherwise all hell
	// breaks loose when it comes to block scoping
	if ( raw.type === 'IfStatement' ) {
		if ( raw.consequent.type !== 'BlockStatement' ) raw.consequent = synthetic( raw.consequent );
		if ( raw.alternate && raw.alternate.type !== 'BlockStatement' ) raw.alternate = synthetic( raw.alternate );
	} else if ( statementsWithBlocks[ raw.type ] && raw.body.type !== 'BlockStatement' ) {
		raw.body = synthetic( raw.body );
	}

	Node( raw, parent );

	const type = ( raw.type === 'BlockStatement' ? BlockStatement : types[ raw.type ] ) || Node;
	raw.__proto__ = type.prototype;
}
