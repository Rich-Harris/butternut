import FunctionNode from './shared/FunctionNode.js';

export default class FunctionDeclaration extends FunctionNode {
	activate ( program ) {
		if ( this.activated ) return;
		this.activated = true;

		this.skip = false;

		if ( this.id ) this.id.initialise( program, this.scope.parent );
		this.params.forEach( param => {
			param.initialise( program, this.scope );
		});
		this.body.initialise( program, this.scope );
	}

	initialise ( program, scope ) {
		if ( scope.parent ) {
			// noop — we wait for this declaration to be activated
		} else {
			this.activate( program );
		}
	}
}
