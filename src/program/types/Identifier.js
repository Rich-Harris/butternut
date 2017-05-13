import Node from '../Node.js';
import isReference from '../../utils/isReference.js';

export default class Identifier extends Node {
	activate () {
		if ( this.declaration && this.declaration.activate ) {
			this.declaration.activate();
		}

		// TODO in what circumstances would an identifier be 'activated' if it
		// didn't have a declaration... parameters?
	}

	getPrecedence () {
		return 20;
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

	minify () {
		// TODO should aliasing happen here, rather than in Scope?
		// if ( this.alias ) {
		// 	const replacement = this.parent.type === 'Property' && this.parent.shorthand ?
		// 		`${this.name}:${this.alias}` :
		// 		this.alias;

		// 	code.overwrite( this.start, this.end, replacement, true );
		// }
	}
}
