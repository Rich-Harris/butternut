import Node from '../Node.js';

export default class ImportSpecifier extends Node {
	initialise () {
		this.local.declaration = this;

		this.findScope( true ).addDeclaration( this.local, 'import' );
		super.initialise();
	}
}
