import Node from '../Node.js';
import isReference from '../../utils/isReference.js';
import { UNKNOWN } from '../../utils/sentinels.js';
import stringify from '../../utils/stringify.js';

export default class Identifier extends Node {
	activate () {
		if ( this.declaration && this.declaration.activate ) {
			this.declaration.activate();
		}

		// TODO in what circumstances would an identifier be 'activated' if it
		// didn't have a declaration... parameters?
	}

	attachScope ( scope ) {
		this.scope = scope;
	}

	getPrecedence () {
		return 21;
	}

	getValue () {
		if ( this.name === 'undefined' ) {
			if ( !this.scope.contains( 'undefined' ) ) return undefined;
		}

		if ( this.name === 'Infinity' ) {
			if ( !this.scope.contains( 'Infinity' ) ) return Infinity;
		}

		return UNKNOWN;
	}

	initialise ( scope ) {
		// special case
		if ( ( this.parent.type === 'FunctionExpression' || this.parent.type === 'ClassExpression' ) && this === this.parent.id ) {
			return;
		}

		if ( isReference( this, this.parent ) ) {
			scope.addReference( this );
		}
	}

	minify ( code ) {
		const value = this.getValue();
		if ( value !== UNKNOWN ) {
			code.overwrite( this.start, this.end, stringify( value ) );
		}

		// TODO should aliasing happen here, rather than in Scope?
		// if ( this.alias ) {
		// 	const replacement = this.parent.type === 'Property' && this.parent.shorthand ?
		// 		`${this.name}:${this.alias}` :
		// 		this.alias;

		// 	code.overwrite( this.start, this.end, replacement, true );
		// }
	}
}
