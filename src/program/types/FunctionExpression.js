import Function from './shared/Function.js';

export default class FunctionExpression extends Function {
	getPrecedence () {
		return 20;
	}
}
