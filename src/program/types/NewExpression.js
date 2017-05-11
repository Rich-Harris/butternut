import Node from '../Node.js';

export default class NewExpression extends Node {
	getPrecedence () {
		return this.end > this.callee.end ? 18 : 17;
	}

	minify ( code ) {
		if ( this.arguments.length ) {
			let lastNode = this.callee;

			for ( let i = 0; i < this.arguments.length; i += 1 ) {
				const argument = this.arguments[i];

				if ( argument.start > lastNode.end + 1 ) code.overwrite( lastNode.end, argument.start, i ? ',' : '(' );
				lastNode = argument;
			}

			if ( this.end > lastNode.end + 1 ) code.overwrite( lastNode.end, this.end, ')' );
		}

		else if ( this.end > this.callee.end + 2 ) {
			code.overwrite( this.callee.end, this.end, '()' );
		}

		super.minify( code );
	}
}
