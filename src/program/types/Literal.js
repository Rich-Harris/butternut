import Node from '../Node.js';

export default class Literal extends Node {
	getValue () {
		return this.value;
	}

	minify ( code ) {
		if ( this.value === true ) {
			code.overwrite( this.start, this.end, '!0' );
		} else if ( this.value === false ) {
			code.overwrite( this.start, this.end, '!1' );
		}
	}
}
