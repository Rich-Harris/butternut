import FunctionNode from './shared/FunctionNode.js';

export default class FunctionDeclaration extends FunctionNode {
	activate () {
		if ( this.activated ) return;
		this.activated = true;

		this.skip = false;

		if ( this.id ) this.id.initialise( this.scope.parent );
		this.params.forEach( param => {
			param.initialise( this.scope );
		});
		this.body.initialise( this.scope );
	}

	initialise ( scope ) {
		if ( scope.parent ) {
			// noop — we wait for this declaration to be activated
		} else {
			this.activate();
		}
	}
}
