"use strict";module.export({default:()=>CompileError});var locate;module.watch(require('./locate.js'),{default:function(v){locate=v}},0);var getSnippet;module.watch(require('./getSnippet.js'),{default:function(v){getSnippet=v}},1);


class CompileError extends Error {
	constructor ( node, message ) {
		super();

		const source = node.program.magicString.original;
		const loc = locate( source, node.start );

		this.name = 'CompileError';
		this.message = message + ` (${loc.line}:${loc.column})`;

		this.stack = new Error().stack.replace( new RegExp( `.+new ${this.name}.+\\n`, 'm' ), '' );

		this.loc = loc;
		this.snippet = getSnippet( source, loc, node.end - node.start );
	}
}
