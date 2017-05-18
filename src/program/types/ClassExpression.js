import Class from './shared/Class.js';
import Scope from '../Scope.js';

export default class ClassExpression extends Class {
	attachScope ( parent ) {
		this.scope = new Scope({
			block: true,
			parent
		});

		if ( this.id ) this.id.attachScope( this.scope );
		if ( this.superClass ) this.superClass.attachScope( this.scope );
		this.body.attachScope( this.scope );
	}

	initialise ( program, scope ) {
		if ( this.id ) {
			this.id.declaration = this;

			// function expression IDs belong to the child scope...
			this.scope.addDeclaration( this.id, 'class' );
			this.scope.addReference( this.id );
		}

		super.initialise( program, scope );
	}

	minify ( code ) {
		this.scope.mangle( code );
		super.minify( code );
	}
}
