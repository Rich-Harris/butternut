import FunctionNode from './shared/FunctionNode.js';

export default class FunctionDeclaration extends FunctionNode {
	activate () {
		if ( this.activated ) return;
		this.activated = true;

		this.skip = false;

		this.program.addWord( 'function' );
		if ( this.id ) this.id.initialise( this.program, this.scope.parent );
		this.params.forEach( param => {
			param.initialise( this.program, this.scope );
		});
		this.body.initialise( this.program, this.scope );
	}

	initialise ( program, scope ) {
		if ( scope.parent ) {
			// noop — we wait for this declaration to be activated
		} else {
			this.activate( program );
		}
	}
}
