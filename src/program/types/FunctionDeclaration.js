import Function from './shared/Function.js';

export default class FunctionDeclaration extends Function {
	activate () {
		this.skip = false;
		super.initialise();
	}

	initialise () {
		this.id.declaration = this;

		const scope = this.findScope( false );
		this.body.createScope( scope );

		this.skip = !!scope.parent; // guilty until proven innocent

		scope.addDeclaration( this.id, 'function' );
	}

	minify ( code ) {
		if ( this.id.start > this.start + 9 ) {
			code.overwrite( this.start + 8, this.id.start, this.generator ? '*' : ' ' );
		}

		super.minify( code );
	}
}
