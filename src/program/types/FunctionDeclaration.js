import Function from './shared/Function.js';

export default class FunctionDeclaration extends Function {
	activate () {
		this.skip = false;
		super.initialise( this.scope );
	}

	initialise ( scope ) {
		if ( this.id ) { // if not, it's a default export
			this.id.declaration = this;
			scope.addDeclaration( this.id, 'function' );

			this.skip = !!scope.parent; // guilty until proven innocent
		}
	}
}
