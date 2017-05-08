import Node from '../Node.js';

export default class VariableDeclaration extends Node {
	initialise () {
		this.scope = this.findScope( this.kind === 'var' );
		this.skip = !!this.scope.parent;

		this.declarations.forEach( declarator => declarator.initialise() );
	}

	minify ( code ) {
		const declarations = this.declarations.filter( d => !d.skip );
		let c = this.start + this.kind.length;

		for ( let i = 0; i < declarations.length; i += 1 ) {
			const declarator = declarations[i];
			if ( declarator.skip ) continue;

			if ( declarator.start > c + 1 ) code.overwrite( c, declarator.start, i ? ',' : ( this.collapsed ? '' : ' ' ) );
			c = declarator.end;
		}

		if ( this.end > c + 1 ) code.remove( c, this.end - 1 ); // TODO semi-less declarations

		declarations.forEach( declarator => declarator.minify( code ) );
	}
}
