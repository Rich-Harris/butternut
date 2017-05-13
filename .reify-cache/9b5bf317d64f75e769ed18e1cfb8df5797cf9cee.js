"use strict";module.export({default:()=>FunctionDeclaration});var FunctionNode;module.watch(require('./shared/FunctionNode.js'),{default:function(v){FunctionNode=v}},0);

class FunctionDeclaration extends FunctionNode {
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

		this.id.initialise( this.scope.parent );
		this.params.forEach( param => {
			param.initialise( this.scope );
		});
		this.body.initialise( this.scope );
	}

	attachScope ( scope ) {
		this.skip = !!scope.parent; // always preserve top-level declarations
		super.attachScope( scope );
	}

	initialise () {
		this.inited = true;

		// see above...
		if ( this.shouldActivate ) {
			this.activate();
		}
	}
}
