"use strict";module.export({default:()=>VariableDeclaration});var Node;module.watch(require('../Node.js'),{default:function(v){Node=v}},0);var extractNames;module.watch(require('../extractNames.js'),{default:function(v){extractNames=v}},1);


class VariableDeclaration extends Node {
	attachScope ( scope ) {
		this.declarations.forEach( declarator => {
			declarator.attachScope( scope );
		});
	}

	initialise ( scope ) {
		this.skip = !!scope.parent;
		super.initialise( scope );
	}

	minify ( code ) {
		const declarations = this.declarations.filter( d => !d.skip );

		let allDupes = declarations.every( declarator => {
			return extractNames( declarator.id ).every( identifier => {
				return identifier.isDuplicate;
			});
		});

		let c = allDupes ? this.start : this.start + this.kind.length + ( this.declarations[0].id.type === 'Identifier' ? 1 : 0 );

		for ( let i = 0; i < declarations.length; i += 1 ) {
			const declarator = declarations[i];
			if ( declarator.skip ) continue;

			if ( declarator.start > c ) code.overwrite( c, declarator.start, i ? ',' : '' );
			c = declarator.end;
		}

		if ( this.end > c + 1 ) code.remove( c, this.end - 1 ); // TODO semi-less declarations

		declarations.forEach( declarator => declarator.minify( code ) );
	}
}
