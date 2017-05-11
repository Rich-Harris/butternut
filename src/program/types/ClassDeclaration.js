import Class from './shared/Class.js';

export default class ClassDeclaration extends Class {
	activate () {
		this.skip = false;
		super.initialise();
	}

	initialise () {
		this.skip = true;
		this.id.declaration = this;

		this.name = this.id.name; // TODO what is this used for?
		this.findScope( true ).addDeclaration( this.id, 'class' );
	}
}
