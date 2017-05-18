import Node from '../Node.js';
import minifyPropertyKey from './shared/minifyPropertyKey.js';

export default class MethodDefinition extends Node {
	initialise ( program, scope ) {
		if ( !this.computed ) program.addWord( this.key.name );
		super.initialise( program, scope );
	}

	minify ( code, chars ) {
		minifyPropertyKey( code, chars, this, false );
		this.value.minify( code, chars );
	}
}
