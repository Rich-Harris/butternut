import LoopStatement from './shared/LoopStatement.js';

export default class ForStatement extends LoopStatement {
	getRightHandSide () {
		return this.body.getRightHandSide();
	}

	hasVariableDeclaration () {
		return this.init && this.init.type === 'VariableDeclaration';
	}

	minify ( code, chars ) {
		let c = this.start + 3;

		let replacement = '(';

		[ this.init, this.test, this.update ].forEach( ( statement, i ) => {
			if ( statement && ( !statement.skip || statement === this.test  ) ) {
				if ( statement.start > c + replacement.length ) {
					code.overwrite( c, statement.start, replacement );
				}

				statement.minify( code, chars );

				c = statement.end;
				replacement = '';
			}

			replacement += i === 2 ? ')' : ';';
		});

		if ( this.body.start > c + replacement.length ) {
			code.overwrite( c, this.body.start, replacement );
		}

		super.minify( code, chars );
	}
}
