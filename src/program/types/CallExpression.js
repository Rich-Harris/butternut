import Node from '../Node.js';
import { UNKNOWN, TRUTHY, FALSY } from '../../utils/sentinels.js';
import stringify from '../../utils/stringify.js';

const safeFunctions = [
	// TODO this list is possibly a bit arbitrary. Also *technically*
	// unsafe, though I'm inclined to wait for examples of it causing
	// breakage in the wild
	Array.prototype.concat,
	Array.prototype.indexOf,
	Array.prototype.join,
	Array.prototype.lastIndexOf,
	Array.prototype.reverse,
	Array.prototype.slice,
	Array.prototype.sort,
	Array.prototype.toString,

	String.fromCharCode,
	String.fromCodePoint,

	String.prototype.charAt,
	String.prototype.charCodeAt,
	String.prototype.codePointAt,
	String.prototype.concat, // WARNING! https://github.com/jquery/jquery/pull/473
	String.prototype.endsWith,
	String.prototype.includes,
	String.prototype.indexOf,
	String.prototype.lastIndexOf,
	String.prototype.slice,
	String.prototype.startsWith,
	String.prototype.substr,
	String.prototype.substring,
	String.prototype.toLowerCase,
	String.prototype.toString,
	String.prototype.toUpperCase,
	String.prototype.trim,
	String.prototype.trimLeft,
	String.prototype.trimRight,
	String.prototype.valueOf

	// TODO others...
];

export default class CallExpression extends Node {
	getPrecedence () {
		return 17;
	}

	getValue () {
		const calleeValue = this.callee.getValue();

		if ( typeof calleeValue !== 'function' ) return UNKNOWN;
		if ( !~safeFunctions.indexOf( calleeValue ) ) return UNKNOWN;

		let contextValue = this.callee.type === 'MemberExpression' ?
			this.callee.object.getValue() :
			null;

		let argumentValues = new Array( this.arguments.length );
		for ( let i = 0; i < this.arguments.length; i += 1 ) {
			const argument = this.arguments[i];

			if ( argument ) {
				const value = argument.getValue();
				if ( value === UNKNOWN || value === TRUTHY || value === FALSY ) return UNKNOWN;

				argumentValues[i] = value;
			}
		}

		return calleeValue.apply( contextValue, argumentValues );
	}

	initialise ( scope ) {
		if ( this.callee.type === 'Identifier' && this.callee.name === 'eval' && !scope.contains( 'eval' ) ) {
			if ( this.program.options.allowDangerousEval ) {
				scope.deopt();
			} else {
				this.error( 'Use of direct eval prevents effective minification and can introduce security vulnerabilities. Use `allowDangerousEval: true` if you know what you\'re doing' );
			}
		}
		super.initialise( scope );
	}

	minify ( code ) {
		const value = this.getValue();

		if ( value !== UNKNOWN ) {
			const str = stringify( value );

			if ( str !== null ) {
				code.overwrite( this.start, this.end, str );
				return;
			}
		}

		if ( this.arguments.length ) {
			let lastNode = this.callee;

			for ( let i = 0; i < this.arguments.length; i += 1 ) {
				const argument = this.arguments[i];

				if ( argument.start > lastNode.end + 1 ) code.overwrite( lastNode.end, argument.start, i ? ',' : '(' );
				lastNode = argument;
			}

			if ( this.end > lastNode.end + 1 ) code.overwrite( lastNode.end, this.end, ')' );
		}

		else if ( this.end > this.callee.end + 2 ) {
			code.overwrite( this.callee.end, this.end, '()' );
		}

		super.minify( code );
	}
}
