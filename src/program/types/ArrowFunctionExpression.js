import Node from '../Node.js';
import Scope from '../Scope.js';
import extractNames from '../extractNames.js';

export default class ArrowFunctionExpression extends Node {
	attachScope ( parent ) {
		this.scope = new Scope({
			block: false,
			parent
		});

		this.params.forEach( param => {
			extractNames( param ).forEach( node => {
				node.declaration = this;
				this.scope.addDeclaration( node, 'param' );
			});
		});

		if ( this.body.type === 'BlockStatement' ) {
			this.body.body.forEach( node => {
				node.attachScope( this.scope );
			});
		} else {
			this.body.attachScope( this.scope );
		}

	}

	initialise () {
		super.initialise( this.scope );
	}

	findVarDeclarations () {
		// noop
	}

	getLeftHandSide () {
		return this.params.length === 1 ? this.params[0] : this;
	}

	minify ( code ) {
		this.scope.mangle( code );

		let c = this.start;
		if ( this.async ) c += 5;

		if ( this.params.length === 0 ) {
			if ( this.body.start > c + 4 ) {
				code.overwrite( c, this.body.start, '()=>' );
			}
		}

		else if ( this.params.length === 1 ) {
			this.params[0].minify( code );

			if ( this.params[0].type === 'Identifier' ) {
				// remove parens
				if ( this.async ) {
					code.overwrite( c, this.params[0].start, ' ' );
				} else {
					code.remove( c, this.params[0].start );
				}

				if ( this.body.start > this.params[0].end + 2 ) {
					code.overwrite( this.params[0].end, this.body.start, '=>' );
				}
			} else {
				if ( this.params[0].start > c + 1 ) {
					code.remove( c + 1, this.params[0].start );
				}

				if ( this.body.start > this.params[0].end + 3 ) {
					code.overwrite( this.params[0].end, this.body.start, ')=>' );
				}
			}
		}

		else {
			this.params.forEach( ( param, i ) => {
				param.minify( code );
				if ( param.start > c + 1 ) code.overwrite( c, param.start, i ? ',' : '(' );
				c = param.end;
			});

			if ( this.body.start > c + 3 ) {
				code.overwrite( c, this.body.start, ')=>' );
			}
		}

		this.body.minify( code );
	}
}
