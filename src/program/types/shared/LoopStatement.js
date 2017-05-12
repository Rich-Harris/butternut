import Node from '../../Node.js';

export default class LoopStatement extends Node {
	findScope ( functionScope ) {
		if ( functionScope || !this.hasVariableDeclaration() ) return this.parent.findScope( functionScope );

		if ( !this.body.scope ) this.body.createScope( this.parent.findScope() );
		return this.body.scope;
	}
}
