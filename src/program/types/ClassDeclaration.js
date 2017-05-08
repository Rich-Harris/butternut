import Class from './shared/Class.js';

export default class ClassDeclaration extends Class {
	initialise () {
		this.name = this.id.name;
		this.findScope( true ).addDeclaration( this.id, 'class' );

		super.initialise();
	}
}
