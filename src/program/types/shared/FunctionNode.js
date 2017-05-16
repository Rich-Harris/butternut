import Node from '../../Node.js';
import Scope from '../../Scope.js';
import extractNames from '../../extractNames.js';

function hasFunctionKeyword ( node, parent ) {
	if ( parent.type === 'MethodDefinition' ) return false;

	if ( parent.type === 'Property' && node === parent.value ) {
		if ( parent.method ) return false;
		if ( parent.kind === 'set' || parent.kind === 'get' ) return false;
	}

	return true;
}

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
			param.attachScope( this.scope );

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

		if ( hasFunctionKeyword( this, this.parent ) ) {
			if ( this.id && !this.removeId ) {
				code.overwrite( this.start, this.id.start, ( this.async ? 'async function ' : this.generator ? 'function*' : 'function ' ) );
				c = this.id.end;
			} else {
				while ( code.original[c] !== '(' ) c += 1;
				code.overwrite( this.start, c, ( this.async ? 'async function' : this.generator ? 'function*' : 'function' ) );
			}
		}

		if ( this.params.length ) {
			for ( let i = 0; i < this.params.length; i += 1 ) {
				const param = this.params[i];
				param.minify( code );

				if ( param.start > c + 1 ) code.overwrite( c, param.start, i ? ',' : '(' );
				c = param.end;
			}

			if ( this.end > c + 1 ) code.overwrite( c, this.body.start, ')' );
		} else if ( this.body.start > c + 2 ) {
			code.overwrite( c, this.body.start, `()` );
		}

		this.body.minify( code );
	}
}
