import Node from '../Node.js';

export default class Literal extends Node {
	attachScope ( scope ) {
		if ( this.value === 'use strict' ) {
			const block = this.parent.parent;
			if ( block.type === 'Program' || /Function/.test( block.parent.type ) ) {
				const body = block.body;
				if ( body.indexOf( this.parent ) === 0 ) {
					// TODO use this! add pragma to blocks when minifying them
					scope.useStrict = true;
				}
			}
		}
	}

	getPrecedence () {
		return 21;
	}

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
