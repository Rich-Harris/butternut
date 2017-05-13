import Function from './shared/Function.js';

export default class FunctionExpression extends Function {
	attachScope ( parent ) {
		super.attachScope( parent );

		if ( this.id ) {
			this.id.declaration = this;

			// function expression IDs belong to the child scope...
			this.scope.addDeclaration( this.id, 'function' );
			this.scope.addReference( this.id );
		}
	}

	getPrecedence () {
		return 20;
	}
}
