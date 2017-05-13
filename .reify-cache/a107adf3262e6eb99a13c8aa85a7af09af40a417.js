"use strict";module.export({squash:()=>squash});module.watch(require('../package.json'),{version:function(v){exports.VERSION=v}},4);var parse;module.watch(require('acorn'),{parse:function(v){parse=v}},0);var Program;module.watch(require('./program/Program.js'),{default:function(v){Program=v}},1);var Stats;module.watch(require('./utils/Stats.js'),{default:function(v){Stats=v}},2);var getSnippet;module.watch(require('./utils/getSnippet.js'),{default:function(v){getSnippet=v}},3);




function squash ( source, options = {} ) {
	let ast;

	const stats = DEBUG ? new Stats() : null;

	try {
		if ( DEBUG ) stats.time( 'parse' );
		ast = parse( source, {
			ecmaVersion: 8,
			preserveParens: true,
			sourceType: 'module'
		});
		if ( DEBUG ) stats.timeEnd( 'parse' );
	} catch ( err ) {
		err.snippet = getSnippet( source, err.loc );
		throw err;
	}

	return new Program( source, ast, stats ).export( options );
}


