import Node from '../../Node.js';

export default class Function extends Node {
	findVarDeclarations () {
		// noop
	}

	minify ( code ) {
		const hasFunctionKeyword = this.type !== 'ArrowFunctionExpression' && this.parent.type !== 'MethodDefinition' && !this.parent.shorthand;

		let lastEnd = ( this.id && !this.removeId ) ? this.id.end : this.start + ( hasFunctionKeyword ? 8 : 0 );

		if ( this.params.length ) {
			for ( let i = 0; i < this.params.length; i += 1 ) {
				const param = this.params[i];

				if ( param.start > lastEnd + 1 ) code.overwrite( lastEnd, param.start, i ? ',' : '(' );
				lastEnd = param.end;
			}

			if ( this.end > lastEnd + 1 ) code.overwrite( lastEnd, this.body.start, ')' );
		}

		else if ( this.body.start > lastEnd + 2 ) {
			code.overwrite( lastEnd, this.body.start, '()' );
		}

		super.minify( code );
	}
}
