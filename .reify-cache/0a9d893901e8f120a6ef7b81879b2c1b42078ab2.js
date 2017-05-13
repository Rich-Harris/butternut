"use strict";module.export({default:()=>LoopStatement});var Node;module.watch(require('../../Node.js'),{default:function(v){Node=v}},0);var Scope;module.watch(require('../../Scope.js'),{default:function(v){Scope=v}},1);


class LoopStatement extends Node {
	attachScope ( parent ) {
		if ( this.hasVariableDeclaration() ) {
			this.scope = new Scope({
				block: true,
				parent
			});

			super.attachScope( this.scope );
		} else {
			super.attachScope( parent );
		}
	}

	initialise ( scope ) {
		super.initialise( this.scope || scope );
	}

	minify ( code ) {
		if ( this.scope ) this.scope.mangle( code );

		// special case — empty body
		if ( this.body.body.length === 0 || this.body.body[0].type === 'EmptyStatement' ) {
			code.appendLeft( this.body.start, ';' );
			code.remove( this.body.start, this.body.end );
		}

		super.minify( code );
	}
}
