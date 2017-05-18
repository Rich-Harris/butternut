import Node from '../Node.js';
import extractNames from '../extractNames.js';

function mightHaveSideEffects ( node ) {
	// TODO this can get way more sophisticated
	if ( node.type === 'Identifier' || node.type === 'Literal' ) return false;
	return true;
}

export default class VariableDeclarator extends Node {
	activate ( program ) {
		if ( this.activated ) return;
		this.activated = true;

		this.skip = this.parent.skip = false;
		this.id.initialise( program, this.scope );
		if ( this.init ) this.init.initialise( program, this.scope );
	}

	attachScope ( scope ) {
		this.scope = scope;
		const kind = this.parent.kind;

		this.id.attachScope( scope );

		if ( this.init ) {
			this.init.attachScope( scope );

			if ( mightHaveSideEffects( this.init ) ) {
				this.parent.skip = false;
			}
		}

		extractNames( this.id ).forEach( node => {
			node.declaration = this;
			scope.addDeclaration( node, kind );
		});
	}

	minify ( code ) {
		if ( this.init ) {
			if ( this.init.start > this.id.end + 1 ) code.overwrite( this.id.end, this.init.start, '=' );
		}

		super.minify( code );
	}
}
