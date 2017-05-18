import Node from '../Node.js';

export default class ImportDeclaration extends Node {
	initialise ( program, scope ) {
		program.addWord( 'import' );
		if ( this.specifiers.length ) program.addWord( 'from' );
		program.addWord( this.source.value );

		super.initialise( program, scope );
	}
}