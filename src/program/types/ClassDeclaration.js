import Class from './shared/Class.js';

export default class ClassDeclaration extends Class {
	activate () {
		this.skip = false;
		super.initialise( this.scope );
	}

	attachScope ( parent ) {
		this.body.attachScope( parent );
	}

	initialise ( scope ) {
		this.scope = scope;

		this.skip = true;
		this.id.declaration = this;

		this.name = this.id.name; // TODO what is this used for?
		scope.addDeclaration( this.id, 'class' );
	}
}
