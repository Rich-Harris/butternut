"use strict";module.export({default:()=>ArrayExpression});var Node;module.watch(require('../../Node.js'),{default:function(v){Node=v}},0);var UNKNOWN,TRUTHY,FALSY;module.watch(require('../../../utils/sentinels.js'),{UNKNOWN:function(v){UNKNOWN=v},TRUTHY:function(v){TRUTHY=v},FALSY:function(v){FALSY=v}},1);


class ArrayExpression extends Node {
	getValue () {
		let values = new Array( this.elements.length );

		for ( let i = 0; i < this.elements.length; i += 1 ) {
			const element = this.elements[i];

			if ( element ) {
				const value = element.getValue();
				if ( value === UNKNOWN || value === TRUTHY || value === FALSY ) return TRUTHY;

				values[i] = value;
			}
		}

		return values;
	}

	minify ( code ) {
		let c = this.start;

		if ( this.elements.length ) {
			let insert = '[';
			this.elements.forEach( ( element, i ) => {
				if ( !element ) {
					insert += i === this.elements.length - 1 ? ',]' : ',';
					return;
				}

				if ( element.start > c + 1 ) code.overwrite( c, element.start, insert );
				c = element.end;

				insert = i === this.elements.length - 1 ? ']' : ',';
			});

			if ( this.end > insert.length ) code.overwrite( c, this.end, insert );
		}

		else {
			if ( this.end > c + 2 ) code.overwrite( c, this.end, '[]' );
		}

		super.minify( code );
	}
}
