import Node from '../Node.js';
import stringify from '../../utils/stringify.js';

export default class Literal extends Node {
	attachScope ( program, scope ) {
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

	initialise ( program ) {
		program.addWord( stringify( this.value ) );
	}

	minify ( code ) {
		if ( this.value === true || this.value === false ) {
			code.overwrite( this.start, this.end, this.value ? '!0' : '!1', {
				contentOnly: true
			});
		}

		else if ( typeof this.value === 'number' ) {
			code.overwrite( this.start, this.end, stringify( this.value ), {
				contentOnly: true
			});
		}
	}
}
