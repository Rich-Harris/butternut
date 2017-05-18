import Node from '../Node.js';
import CompileError from '../../utils/CompileError.js';

export default class UpdateExpression extends Node {
	getPrecedence () {
		return this.prefix ? 16 : 17;
	}

	initialise ( program, scope ) {
		if ( this.argument.type === 'Identifier' ) {
			const declaration = scope.findDeclaration( this.argument.name );
			if ( declaration && declaration.kind === 'const' ) {
				throw new CompileError( this, `${this.argument.name} is read-only` );
			}
		}

		super.initialise( program, scope );
	}
}
