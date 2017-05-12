import Node from '../../Node.js';

export default class Function extends Node {
	findVarDeclarations () {
		// noop
	}

	minify ( code ) {
		const hasFunctionKeyword = this.parent.type !== 'MethodDefinition' && !this.parent.method;

		let c = this.start;
		if ( this.async ) {
			c += 6;
			while ( code.original[c] !== 'f' ) c += 1;
			if ( c > this.start + 6 ) code.remove( this.start + 6, c );
		}

		if ( hasFunctionKeyword ) {
			c += 8; // 'function'.length
		}

		if ( this.id && !this.removeId ) {
			if ( this.id.start > c + 1 ) code.remove( c + 1, this.id.start );
			c = this.id.end;
		}

		if ( this.params.length ) {
			for ( let i = 0; i < this.params.length; i += 1 ) {
				const param = this.params[i];

				if ( param.start > c + 1 ) code.overwrite( c, param.start, i ? ',' : ( this.generator ? '*(' : '(' ) );
				c = param.end;
			}

			if ( this.end > c + 1 ) code.overwrite( c, this.body.start, ')' );
		}

		else if ( this.body.start > c + 2 ) {
			code.overwrite( c, this.body.start, this.generator ? '*()' : '()' );
		}

		super.minify( code );
	}
}
