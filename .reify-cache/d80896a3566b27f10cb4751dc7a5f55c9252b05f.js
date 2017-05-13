"use strict";module.export({default:()=>ObjectExpression});var Node;module.watch(require('../Node.js'),{default:function(v){Node=v}},0);var minifyPropertyKey;module.watch(require('./shared/minifyPropertyKey.js'),{default:function(v){minifyPropertyKey=v}},1);var TRUTHY;module.watch(require('../../utils/sentinels.js'),{TRUTHY:function(v){TRUTHY=v}},2);



class ObjectExpression extends Node {
	getValue () {
		return TRUTHY;
	}

	minify ( code ) {
		let c = this.start;

		if ( this.properties.length ) {
			for ( let i = 0; i < this.properties.length; i += 1 ) {
				const p = this.properties[i];

				if ( p.start > c + 1 ) code.overwrite( c, p.start, i ? ',' : '{' );

				minifyPropertyKey( code, p, true );
				c = p.end;
			}

			if ( this.end > c + 1 ) code.remove( c, this.end - 1 );
		} else if ( this.end > this.start + 2 ) {
			code.overwrite( this.start, this.end, '{}' );
		}

		super.minify( code );
	}
}
