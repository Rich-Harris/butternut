import Node from '../../Node.js';

export default class LoopStatement extends Node {
	findScope ( functionScope ) {
		if ( functionScope || !this.hasVariableDeclaration() ) return this.parent.findScope( functionScope );

		if ( !this.body.scope ) this.body.createScope( this.parent.findScope() );
		return this.body.scope;
	}

	minify ( code ) {
		// special case — empty body
		if ( this.body.body.length === 0 || this.body.body[0].type === 'EmptyStatement' ) {
			code.appendLeft( this.body.start, ';' );
			code.remove( this.body.start, this.body.end );
		}

		super.minify( code );
	}
}
