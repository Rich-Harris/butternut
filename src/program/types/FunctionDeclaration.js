import Function from './shared/Function.js';

export default class FunctionDeclaration extends Function {
	activate () {
		if ( !this.inited ) {
			// TODO see comments on VariableDeclarator, this is
			// unfortunately. maybe all nodes should be skip: true
			// by default
			this.shouldActivate = true;
			return;
		}

		this.skip = false;
		super.initialise( this.scope );
	}

	attachScope ( scope ) {
		super.attachScope( scope );

		if ( this.id ) { // if not, it's a default export
			this.id.declaration = this;

			// function expression IDs belong to the child scope...
			scope.addDeclaration( this.id, 'function' );
			scope.addReference( this.id );

			this.skip = !!scope.parent; // guilty until proven innocent
		} else {
			// must be a default function export — only time a
			// function declaration can be anonymous
			this.skip = false;
		}
	}

	initialise ( scope ) {
		this.inited = true;

		// see above...
		if ( this.shouldActivate ) {
			this.activate();
		} else {
			this.skip = !!scope.parent;
		}
	}
}
