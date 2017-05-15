import Node from '../Node.js';
import minifyPropertyKey from './shared/minifyPropertyKey.js';

export default class MethodDefinition extends Node {
	minify ( code ) {
		minifyPropertyKey( code, this, false );
		this.value.minify( code );
	}
}
