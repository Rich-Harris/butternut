"use strict";module.export({default:()=>YieldExpression});var Node;module.watch(require('../Node.js'),{default:function(v){Node=v}},0);

class YieldExpression extends Node {
	getPrecedence () {
		return 2;
	}
}
