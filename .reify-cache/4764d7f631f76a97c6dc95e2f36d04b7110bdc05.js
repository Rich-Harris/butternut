"use strict";module.export({default:()=>SpreadElement});var Node;module.watch(require('../Node.js'),{default:function(v){Node=v}},0);

class SpreadElement extends Node {
	getPrecedence () {
		return 1;
	}
}
