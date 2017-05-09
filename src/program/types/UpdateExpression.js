import Node from '../Node.js';
import CompileError from '../../utils/CompileError.js';

export default class UpdateExpression extends Node {
	getPrecedence () {
		return this.prefix ? 15 : 16;
	}

	initialise () {
		if ( this.argument.type === 'Identifier' ) {
			const declaration = this.findScope( false ).findDeclaration( this.argument.name );
			if ( declaration && declaration.kind === 'const' ) {
				throw new CompileError( this, `${this.argument.name} is read-only` );
			}
		}

		super.initialise();
	}
}
