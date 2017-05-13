import Node from '../Node.js';

export default class ImportDefaultSpecifier extends Node {
	initialise ( scope ) {
		this.local.declaration = this;

		scope.addDeclaration( this.local, 'import' );
		super.initialise( scope );
	}
}
