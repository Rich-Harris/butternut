import Function from './shared/Function.js';

export default class FunctionExpression extends Function {
	getPrecedence () {
		return 20;
	}

	initialise () {
		this.body.createScope( this.parent.findScope( false ) );

		if ( this.id ) {
			this.id.declaration = this;

			// function expression IDs belong to the child scope...
			this.body.scope.addDeclaration( this.id, 'function' );
			this.body.scope.addReference( this.id );
		}

		super.initialise();
	}
}
