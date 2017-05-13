"use strict";module.export({default:()=>ClassDeclaration});var Class;module.watch(require('./shared/Class.js'),{default:function(v){Class=v}},0);

class ClassDeclaration extends Class {
	activate () {
		if ( !this.inited ) {
			// TODO see comments on VariableDeclarator, this is
			// unfortunately. maybe all nodes should be skip: true
			// by default
			this.shouldActivate = true;
			return;
		}

		if ( this.activated ) return;
		this.activated = true;

		this.skip = false;
		super.initialise( this.scope );
	}

	attachScope ( scope ) {
		this.scope = scope;

		this.id.declaration = this;

		this.name = this.id.name; // TODO what is this used for?
		scope.addDeclaration( this.id, 'class' );

		this.body.attachScope( scope );
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
