import Node from '../Node.js';
import extractNames from '../extractNames.js';

export default class VariableDeclaration extends Node {
	attachScope ( scope ) {
		this.declarations.forEach( declarator => {
			declarator.attachScope( scope );
		});
	}

	initialise ( scope ) {
		let _scope = scope;
		if ( this.kind === 'var' ) while ( _scope.isBlockScope ) _scope = _scope.parent;

		if ( _scope.parent ) {
			// noop — we wait for this declaration to be activated
			// TODO what about `var a = b()` — need to init the init
		} else {
			super.initialise( scope );
		}
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
