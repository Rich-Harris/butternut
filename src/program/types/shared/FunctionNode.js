import Node from '../../Node.js';
import Scope from '../../Scope.js';
import extractNames from '../../extractNames.js';

export default class FunctionNode extends Node {
	attachScope ( parent ) {
		this.scope = new Scope({
			block: false,
			parent
		});

		if ( this.id ) {
			this.id.declaration = this;

			// function expression IDs belong to the child scope...
			if ( this.type === 'FunctionExpression' ) {
				this.scope.addDeclaration( this.id, 'function' );
				this.scope.addReference( this.id );
			} else {
				parent.addDeclaration( this.id, 'function' );
			}
		}

		this.params.forEach( param => {
			extractNames( param ).forEach( node => {
				node.declaration = this;
				this.scope.addDeclaration( node, 'param' );
			});
		});

		this.body.attachScope( this.scope );
	}

	findVarDeclarations () {
		// noop
	}

	minify ( code ) {
		let c = this.start;
		let openParams;

		if ( this.parent.type === 'MethodDefinition' || this.parent.method ) {
			// `async` or `*` are dealt with by the parent
			openParams = '(';
		}

		else {
			openParams = this.generator ? '*(' : '(';

			if ( this.async ) {
				c += 6;
				while ( code.original[c] !== 'f' ) c += 1;
				if ( c > this.start + 6 ) code.remove( this.start + 6, c );
			}

			c += 8;

			if ( this.id && !this.removeId ) {
				c += 1;

				if ( this.id.start > c ) code.remove( c, this.id.start );
				c = this.id.end;
			}
		}

		if ( this.params.length ) {
			for ( let i = 0; i < this.params.length; i += 1 ) {
				const param = this.params[i];
				param.minify( code );

				if ( param.start > c + 1 ) code.overwrite( c, param.start, i ? ',' : openParams );
				c = param.end;
			}

			if ( this.end > c + 1 ) code.overwrite( c, this.body.start, ')' );
		}

		else if ( this.body.start > c + 2 ) {
			code.overwrite( c, this.body.start, `${openParams})` );
		}

		this.body.minify( code );
	}
}
