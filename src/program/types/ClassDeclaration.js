import Class from './shared/Class.js';

export default class ClassDeclaration extends Class {
	activate () {
		if ( this.activated ) return;
		this.activated = true;

		this.skip = false;
		super.initialise( this.program, this.scope );
	}

	attachScope ( program, scope ) {
		this.program = program;
		this.scope = scope;

		this.id.declaration = this;

		this.name = this.id.name; // TODO what is this used for?
		scope.addDeclaration( this.id, 'class' );

		this.id.attachScope( program, this.scope );
		if ( this.superClass ) this.superClass.attachScope( program, this.scope );
		this.body.attachScope( program, scope );
	}

	initialise ( program, scope ) {
		if ( scope.parent ) {
			// noop — we wait for this declaration to be activated
		} else {
			super.initialise( program, scope );
		}
	}
}
