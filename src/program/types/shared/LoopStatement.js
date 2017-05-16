import Node from '../../Node.js';
import Scope from '../../Scope.js';

export default class LoopStatement extends Node {
	attachScope ( parent ) {
		if ( this.hasVariableDeclaration() ) {
			this.scope = new Scope({
				block: true,
				parent
			});

			super.attachScope( this.scope );
		} else {
			super.attachScope( parent );
		}
	}

	initialise ( scope ) {
		super.initialise( this.scope || scope );
	}

	minify ( code ) {
		if ( this.scope ) this.scope.mangle( code );

		// special case — empty body
		if ( this.body.isEmpty() ) {
			code.appendLeft( this.body.start, ';' );
			code.remove( this.body.start, this.body.end );
		} else {
			this.body.minify( code );
		}
	}
}
