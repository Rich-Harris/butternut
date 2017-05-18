import Node from '../../Node.js';
import Scope from '../../Scope.js';
import extractNames from '../../extractNames.js';

function hasFunctionKeyword ( node, parent ) {
	if ( node === parent.value ) {
		if ( parent.type === 'MethodDefinition' ) return false;

		if ( parent.type === 'Property' ) {
			if ( parent.method ) return false;
			if ( parent.kind === 'set' || parent.kind === 'get' ) return false;
		}
	}

	return true;
}

function keepId ( node ) {
	if ( !node.id ) return false;
	if ( node.type === 'FunctionDeclaration' ) return true;

	// if function expression ID is shadowed, or is not referenced (other than
	// by the function expression itself), remove it
	return !node.shadowed && node.scope.declarations[ node.id.name ].instances.length > 1;
}

export default class FunctionNode extends Node {
	attachScope ( program, parent ) {
		this.program = program;
		this.scope = new Scope({
			block: false,
			parent
		});

		if ( this.id ) {
			this.id.declaration = this;

			// function expression IDs belong to the child scope...
			if ( this.type === 'FunctionExpression' ) {
				this.scope.addDeclaration( this.id, this.type );
				this.scope.addReference( this.id );
			} else {
				parent.addDeclaration( this.id, this.type );
			}
		}

		this.params.forEach( param => {
			param.attachScope( program, this.scope );

			extractNames( param ).forEach( node => {
				node.declaration = this;
				this.scope.addDeclaration( node, 'param' );
			});
		});

		this.body.attachScope( program, this.scope );
	}

	findVarDeclarations () {
		// noop
	}

	// TODO `program.addWord('async')` if necessary

	minify ( code, chars ) {
		let c = this.start;

		if ( hasFunctionKeyword( this, this.parent ) ) {
			// TODO this could probably be simpler
			const shouldKeepId = keepId( this );
			if ( shouldKeepId ) {
				c = this.id.start;

				if ( this.async ) {
					if ( c > this.start + 15 ) code.overwrite( this.start + 6, c, this.generator ? 'function*' : 'function ' );
				} else {
					if ( c > this.start + 9 ) code.overwrite( this.start + 8, c, this.generator ? '*' : ' ' );
				}

				c = this.id.end;
			} else {
				while ( code.original[c] !== '(' ) c += 1;

				if ( this.async ) {
					const replacement = this.generator ? 'function*' : 'function';
					if ( c > this.start + 6 + replacement.length ) code.overwrite( this.start + 6, c, replacement );
				} else {
					const replacement = this.generator ? '*' : '';
					if ( c > this.start + 8 + replacement.length ) code.overwrite( this.start + 8, c, replacement );
				}
			}
		}

		if ( this.params.length ) {
			for ( let i = 0; i < this.params.length; i += 1 ) {
				const param = this.params[i];
				param.minify( code, chars );

				if ( param.start > c + 1 ) code.overwrite( c, param.start, i ? ',' : '(' );
				c = param.end;
			}

			if ( this.end > c + 1 ) code.overwrite( c, this.body.start, ')' );
		} else if ( this.body.start > c + 2 ) {
			code.overwrite( c, this.body.start, `()` );
		}

		this.body.minify( code, chars );
	}
}
