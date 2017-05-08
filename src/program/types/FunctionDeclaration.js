import Function from './shared/Function.js';

export default class FunctionDeclaration extends Function {
	activate () {
		this.skip = false;
		super.initialise();
	}

	initialise () {
		const scope = this.findScope( false );
		this.body.createScope( scope );

		const topLevel = !scope.parent;
		this.skip = !topLevel; // guilty until proven innocent

		scope.addDeclaration( this.id, 'function', topLevel );
		if ( topLevel ) this.activate();
	}

	minify ( code ) {
		if ( this.id.start > this.start + 9 ) {
			code.overwrite( this.start + 8, this.id.start, this.generator ? '*' : ' ' );
		}

		super.minify( code );
	}
}
