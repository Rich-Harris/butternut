"use strict";module.export({default:()=>ClassBody});var Node;module.watch(require('../Node.js'),{default:function(v){Node=v}},0);var minifyPropertyKey;module.watch(require('./shared/minifyPropertyKey.js'),{default:function(v){minifyPropertyKey=v}},1);


class ClassBody extends Node {
	attachScope ( parent ) {
		for ( let i = 0; i < this.body.length; i += 1 ) {
			this.body[i].value.attachScope( parent );
		}
	}

	minify ( code ) {
		let c = this.start + 1;

		for ( let i = 0; i < this.body.length; i += 1 ) {
			const method = this.body[i];
			if ( method.start > c ) code.remove( c, method.start );

			minifyPropertyKey( code, method, false );

			c = method.end;
		}

		if ( this.end > c + 1 ) code.remove( c, this.end - 1 );

		super.minify( code );
	}
}
