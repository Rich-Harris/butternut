import Node from '../Node.js';
import isReference from '../../utils/isReference.js';

export default class Identifier extends Node {
	activate () {
		if ( !this.declaration.activate ) {
			console.log( `${this.declaration}`)
		}
		this.declaration.activate();
	}

	getPrecedence () {
		return 20;
	}

	initialise () {
		// special case
		if ( ( this.parent.type === 'FunctionExpression' || this.parent.type === 'ClassExpression' ) && this === this.parent.id ) {
			return;
		}

		if ( isReference( this, this.parent ) ) {
			this.findScope( false ).addReference( this );
		}
	}

	minify ( code ) {
		if ( this.alias ) {
			code.overwrite( this.start, this.end, this.alias, true );
		}
	}
}
