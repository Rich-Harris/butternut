"use strict";module.export({default:()=>ClassExpression});var Class;module.watch(require('./shared/Class.js'),{default:function(v){Class=v}},0);var Scope;module.watch(require('../Scope.js'),{default:function(v){Scope=v}},1);


class ClassExpression extends Class {
	attachScope ( parent ) {
		this.scope = new Scope({
			block: true,
			parent
		});

		this.body.attachScope( this.scope );
	}

	initialise ( scope ) {
		if ( this.id ) {
			this.id.declaration = this;

			// function expression IDs belong to the child scope...
			this.scope.addDeclaration( this.id, 'class' );
			this.scope.addReference( this.id );
		}

		super.initialise( scope );
	}

	minify ( code ) {
		this.scope.mangle( code );
		super.minify( code );
	}
}
