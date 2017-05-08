import Node from '../../Node.js';

export default class Class extends Node {
	minify ( code ) {
		let c = this.superClass ? this.superClass.end : this.id ? this.id.end : this.start + 6;

		if ( this.id ) {
			if ( this.id.start > this.start + 6 ) {
				code.remove( this.start + 6, this.id.start );
			}

			if ( this.superClass ) {
				if ( this.superClass.start > this.id.end + 9 ) {
					code.overwrite( this.id.end, this.superClass.start, ' extends ' );
				}
			}
		} else if ( this.superClass ) {
			if ( this.superClass.start > this.start + 14 ) {
				code.overwrite( this.start + 6, this.superClass.start, 'extends ' );
			}
		}

		if ( this.body.start > c ) code.remove( c, this.body.start );

		super.minify( code );
	}
}
