import Class from './shared/Class.js';
import Scope from '../Scope.js';

export default class ClassExpression extends Class {
	attachScope ( program, parent ) {
		this.scope = new Scope({
			block: true,
			parent
		});

		if ( this.id ) this.id.attachScope( program, this.scope );
		if ( this.superClass ) this.superClass.attachScope( program, this.scope );
		this.body.attachScope( program, this.scope );
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

	minify ( code, chars ) {
		this.scope.mangle( code, chars );
		super.minify( code, chars );
	}
}
