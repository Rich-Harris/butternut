import LoopStatement from './shared/LoopStatement.js';

export default class ForStatement extends LoopStatement {
	findScope ( functionScope ) {
		return functionScope || !this.createdScope ? this.parent.findScope( functionScope ) : this.body.scope;
	}

	getRightHandSide () {
		return this.body.getRightHandSide();
	}

	minify ( code, transforms ) {
		let c = this.start + 3;

		let replacement = '(';

		[ this.init, this.test, this.update ].forEach( ( statement, i ) => {
			if ( statement ) {
				if ( statement.start > c + replacement.length ) {
					code.overwrite( c, statement.start, replacement );
				}

				c = statement.end;
				replacement = '';
			}

			replacement += i === 2 ? ')' : ';';
		});

		if ( this.body.start > c + replacement.length ) {
			code.overwrite( c, this.body.start, replacement );
		}

		super.minify( code, transforms );
	}
}
