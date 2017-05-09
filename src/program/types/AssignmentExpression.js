import Node from '../Node.js';
import CompileError from '../../utils/CompileError.js';

let commutative = {};
// we exclude + because it's not commutative when it's
// operating on strings
for ( let operator of '*&^|' ) commutative[ operator ] = true;

export default class AssignmentExpression extends Node {
	getLeftHandSide () {
		return this.left.getLeftHandSide();
	}

	getPrecedence () {
		return 3;
	}

	initialise () {
		if ( this.left.type === 'Identifier' ) {
			const declaration = this.findScope( false ).findDeclaration( this.left.name );
			if ( declaration && declaration.kind === 'const' ) {
				throw new CompileError( this.left, `${this.left.name} is read-only` );
			}
		}

		super.initialise();
	}

	minify ( code ) {
		if ( this.right.start > this.left.end + this.operator.length ) {
			code.overwrite( this.left.end, this.right.start, this.operator );
		}

		// special case – `a = a + 1` -> `a += 1`
		if ( this.operator === '=' && this.left.type === 'Identifier' && this.right.type === 'BinaryExpression' ) {
			if ( this.right.left.type === 'Identifier' && ( this.right.left.name === this.left.name ) ) {
				code.appendLeft( this.left.end, this.right.operator );
				code.remove( this.right.start, this.right.right.start );

				this.right.right.minify( code );
				return;
			}

			// addition and multiplication
			if ( commutative[ this.right.operator ] && this.right.right.type === 'Identifier' && ( this.right.right.name === this.left.name ) ) {
				code.appendLeft( this.left.end, this.right.operator );
				code.remove( this.right.left.end, this.right.end );

				this.right.left.minify( code );
				return;
			}
		}

		super.minify( code );
	}
}
