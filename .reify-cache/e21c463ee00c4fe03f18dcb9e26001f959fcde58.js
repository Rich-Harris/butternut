"use strict";module.export({default:()=>ImportSpecifier});var Node;module.watch(require('../Node.js'),{default:function(v){Node=v}},0);

class ImportSpecifier extends Node {
	initialise ( scope ) {
		this.local.declaration = this;

		scope.addDeclaration( this.local, 'import' );
		super.initialise( scope );
	}
}
