import Node from '../Node.js';
import extractNames from '../extractNames.js';

export default class VariableDeclaration extends Node {
	initialise () {
		this.scope = this.findScope( this.kind === 'var' );
		this.skip = !!this.scope.parent; // TODO get rid of this

		this.declarations.forEach( declarator => declarator.initialise() );
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
