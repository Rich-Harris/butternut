import Node from '../Node.js';
import extractNames from '../extractNames.js';

export default class VariableDeclarator extends Node {
	activate () {
		this.skip = this.parent.skip = false;
		this.parent.uid = Math.random();
		this.id.initialise( this.scope );
		if ( this.init ) this.init.initialise( this.scope );
	}

	attachScope ( scope ) {
		this.scope = scope;
		const kind = this.parent.kind;

		if ( this.init ) {
			this.init.attachScope( scope );
		}

		extractNames( this.id ).forEach( node => {
			node.declaration = this;
			scope.addDeclaration( node, kind );
		});
	}

	initialise ( scope ) {
		this.scope = scope;
		// const kind = this.parent.kind;
		this.skip = !!scope.parent; // TODO get rid

		// this.scope = scope;

		// extractNames( this.id ).forEach( node => {
		// 	node.declaration = this;
		// 	scope.addDeclaration( node, kind );
		// });
	}

	minify ( code ) {
		if ( this.init ) {
			if ( this.init.start > this.id.end + 1 ) code.overwrite( this.id.end, this.init.start, '=' );
		}

		super.minify( code );
	}
}
