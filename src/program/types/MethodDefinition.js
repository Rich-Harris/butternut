import Node from '../Node.js';
import minifyPropertyKey from './shared/minifyPropertyKey.js';

export default class MethodDefinition extends Node {
	minify ( code, chars ) {
		minifyPropertyKey( code, chars, this, false );
		this.value.minify( code, chars );
	}
}
