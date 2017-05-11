import Function from './shared/Function.js';

export default class FunctionDeclaration extends Function {
	activate () {
		this.skip = false;
		super.initialise();
	}

	initialise () {
		const scope = this.findScope( false );
		this.body.createScope( scope );

		if ( this.id ) { // if not, it's a default export
			this.id.declaration = this;
			scope.addDeclaration( this.id, 'function' );

			this.skip = !!scope.parent; // guilty until proven innocent
		}
	}

	minify ( code ) {
		if ( this.id && this.id.start > this.start + 9 ) {
			code.overwrite( this.start + 8, this.id.start, this.generator ? '*' : ' ' );
		}

		super.minify( code );
	}
}
