import Node from '../Node.js';
import Scope from '../Scope.js';
import extractNames from '../extractNames.js';

export default class CatchClause extends Node {
	attachScope ( parent ) {
		this.scope = new Scope({
			block: true,
			parent
		});

		extractNames( this.param ).forEach( node => {
			this.scope.addDeclaration( node, 'param' );
		});

		for ( let i = 0; i < this.body.body.length; i += 1 ) {
			this.body.body[i].attachScope( this.scope );
		}

		if ( this.finalizer ) {
			this.finalizer.attachScope( this.scope );
		}
	}

	initialise ( program ) {
		super.initialise( program, this.scope );
	}

	minify ( code ) {
		this.scope.mangle( code );

		if ( this.param.start > this.start + 6 ) {
			code.overwrite( this.start + 5, this.param.start, '(' );
		}

		if ( this.body.start > this.param.end + 1 ) {
			code.overwrite( this.param.end, this.body.start, ')' );
		}

		super.minify( code );
	}
}
