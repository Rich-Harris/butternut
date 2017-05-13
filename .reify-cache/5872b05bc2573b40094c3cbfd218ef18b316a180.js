"use strict";module.export({default:()=>ExpressionStatement});var Node;module.watch(require('../Node.js'),{default:function(v){Node=v}},0);

class ExpressionStatement extends Node {
	getPrecedence () {
		return this.expression.getPrecedence();
	}
}
