import Node from '../Node.js';
import extractNames from '../extractNames.js';

function mightHaveSideEffects ( node ) {
	// TODO this can get way more sophisticated
	if ( node.type === 'Identifier' || node.type === 'Literal' || /FunctionExpression/.test( node.type ) ) return false;
	return true;
}

export default class VariableDeclarator extends Node {
	activate () {
		if ( this.activated ) return;
		this.activated = true;

		this.skip = this.parent.skip = false;
		this.id.initialise( this.program, this.scope );
		if ( this.init ) this.init.initialise( this.program, this.scope );
	}

	attachScope ( program, scope ) {
		this.program = program;
		this.scope = scope;

		const kind = this.parent.kind;

		this.id.attachScope( program, scope );

		if ( this.init ) {
			this.init.attachScope( program, scope );

			if ( mightHaveSideEffects( this.init ) ) {
				this.parent.skip = false;
			}
		}

		extractNames( this.id ).forEach( node => {
			node.declaration = this;
			scope.addDeclaration( node, kind );
		});
	}

	minify ( code, chars ) {
		if ( this.init ) {
			if ( this.init.start > this.id.end + 1 ) code.overwrite( this.id.end, this.init.start, '=' );
		}

		super.minify( code, chars );
	}
}
