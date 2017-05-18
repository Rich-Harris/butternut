import LoopStatement from './LoopStatement.js';

export default class ForInOfStatement extends LoopStatement {
	getRightHandSide () {
		return this.body.getRightHandSide();
	}

	hasVariableDeclaration () {
		return this.left.type === 'VariableDeclaration';
	}

	minify ( code, chars ) {
		if ( this.left.start > this.start + 4 ) {
			code.overwrite( this.start + 3, this.left.start, '(' );
		}

		if ( this.right.start > this.left.end + 4 ) {
			code.overwrite( this.left.end, this.right.start, ' in ' );
		}

		if ( this.body.start > this.right.end + 1 ) {
			code.overwrite( this.right.end, this.body.start, ')' );
		}

		this.left.minify( code, chars );
		this.right.minify( code, chars );
		super.minify( code, chars );
	}
}
