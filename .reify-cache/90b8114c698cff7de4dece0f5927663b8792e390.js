"use strict";module.export({default:()=>UpdateExpression});var Node;module.watch(require('../Node.js'),{default:function(v){Node=v}},0);var CompileError;module.watch(require('../../utils/CompileError.js'),{default:function(v){CompileError=v}},1);


class UpdateExpression extends Node {
	getPrecedence () {
		return this.prefix ? 15 : 16;
	}

	initialise ( scope ) {
		if ( this.argument.type === 'Identifier' ) {
			const declaration = scope.findDeclaration( this.argument.name );
			if ( declaration && declaration.kind === 'const' ) {
				throw new CompileError( this, `${this.argument.name} is read-only` );
			}
		}

		super.initialise( scope );
	}
}
