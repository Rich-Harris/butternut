import Node from '../Node.js';

export default class TaggedTemplateExpression extends Node {
	minify ( code ) {
		if ( this.quasi.start > this.tag.end ) code.remove( this.tag.end, this.quasi.start );
		this.quasi.minify( code );
	}
}
