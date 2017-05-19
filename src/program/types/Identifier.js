import Node from '../Node.js';
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

	attachScope ( program, scope ) {
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

	initialise ( program, scope ) {
		// special case
		if ( ( this.parent.type === 'FunctionExpression' || this.parent.type === 'ClassExpression' ) && this === this.parent.id ) {
			return;
		}

		// TODO add global/top-level identifiers to frequency count

		if ( this.isReference() ) {
			scope.addReference( this );
		}
	}

	isReference () {
		const parent = this.parent;

		if ( parent.type === 'MemberExpression' || parent.type === 'MethodDefinition' ) {
			return parent.computed || this === parent.object;
		}

		// disregard the `bar` in `{ bar: foo }`, but keep it in `{ [bar]: foo }`
		if ( parent.type === 'Property' ) return parent.computed || this === parent.value;

		// disregard the `bar` in `class Foo { bar () {...} }`
		if ( parent.type === 'MethodDefinition' ) return false;

		// disregard the `bar` in `export { foo as bar }`
		if ( parent.type === 'ExportSpecifier' && this !== parent.local ) return false;

		return true;
	}

	minify ( code ) {
		const value = this.getValue();
		if ( value !== UNKNOWN && this.isReference() ) {
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
