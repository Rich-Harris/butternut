"use strict";module.export({default:()=>FunctionExpression});var FunctionNode;module.watch(require('./shared/FunctionNode.js'),{default:function(v){FunctionNode=v}},0);

class FunctionExpression extends FunctionNode {
	getPrecedence () {
		return 20;
	}

	initialise () {
		super.initialise( this.scope );
	}
}
