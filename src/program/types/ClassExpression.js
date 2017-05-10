import Class from './shared/Class.js';
import Scope from '../Scope.js';

export default class ClassExpression extends Class {
	findScope () {
		return this.scope;
	}

	initialise () {
		this.scope = new Scope({
			block: true,
			parent: this.parent.findScope( false ),
			owner: this
		});

		if ( this.id ) {
			this.id.declaration = this;

			// function expression IDs belong to the child scope...
			this.scope.addDeclaration( this.id, 'class' );
			this.scope.addReference( this.id );
		}

		super.initialise();

		this.scope.consolidate();
	}

	minify ( code ) {
		this.scope.mangle( code );
		super.minify( code );
	}
}
