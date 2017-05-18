import Node from '../Node.js';
import Scope from '../Scope.js';
import extractNames from '../extractNames.js';

export default class CatchClause extends Node {
	attachScope ( program, parent ) {
		this.scope = new Scope({
			block: true,
			parent
		});

		extractNames( this.param ).forEach( node => {
			this.scope.addDeclaration( node, 'param' );
		});

		for ( let i = 0; i < this.body.body.length; i += 1 ) {
			this.body.body[i].attachScope( program, this.scope );
		}

		if ( this.finalizer ) {
			this.finalizer.attachScope( program, this.scope );
		}
	}

	initialise ( program ) {
		program.addWord( 'catch' );
		super.initialise( program, this.scope );
	}

	minify ( code, chars ) {
		this.scope.mangle( code, chars );

		if ( this.param.start > this.start + 6 ) {
			code.overwrite( this.start + 5, this.param.start, '(' );
		}

		if ( this.body.start > this.param.end + 1 ) {
			code.overwrite( this.param.end, this.body.start, ')' );
		}

		super.minify( code, chars );
	}
}
