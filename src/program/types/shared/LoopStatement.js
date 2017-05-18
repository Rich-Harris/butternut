import Node from '../../Node.js';
import Scope from '../../Scope.js';

export default class LoopStatement extends Node {
	attachScope ( program, parent ) {
		if ( this.hasVariableDeclaration() ) {
			this.scope = new Scope({
				block: true,
				parent
			});

			super.attachScope( program, this.scope );
		} else {
			super.attachScope( program, parent );
		}
	}

	initialise ( program, scope ) {
		program.addWord( 'for' );
		if ( this.type === 'ForInStatement' ) program.addWord( 'in' );
		else if ( this.type === 'ForOfStatement' ) program.addWord( 'of' );

		super.initialise( program, this.scope || scope );
	}

	minify ( code, chars ) {
		if ( this.scope ) this.scope.mangle( code, chars );

		// special case — empty body
		if ( this.body.isEmpty() ) {
			code.appendLeft( this.body.start, ';' );
			code.remove( this.body.start, this.body.end );
		} else {
			this.body.minify( code, chars );
		}
	}
}
