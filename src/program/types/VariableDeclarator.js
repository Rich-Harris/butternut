import Node from '../Node.js';

export default class VariableDeclarator extends Node {
	activate () {
		this.skip = this.parent.skip = false;
		this.id.initialise();
		if ( this.init ) this.init.initialise();
	}

	initialise () {
		let kind = this.parent.kind;
		if ( kind === 'let' && this.parent.parent.type === 'ForStatement' ) {
			kind = 'for.let'; // special case... TODO is this necessary in butternet?
		}

		this.skip = this.parent.skip;
		const topLevel = !this.skip; // top-level declaration

		this.parent.scope.addDeclaration( this.id, kind, topLevel );

		if ( topLevel ) this.activate();
	}

	minify ( code ) {
		if ( this.init ) {
			if ( this.init.start > this.id.end + 1 ) code.overwrite( this.id.end, this.init.start, '=' );
		}

		super.minify( code );
	}
}
