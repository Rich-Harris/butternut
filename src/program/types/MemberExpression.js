import Node from '../Node.js';
import { reservedLookup } from '../../utils/reserved.js';
import { UNKNOWN } from '../../utils/sentinels.js';
import stringify from '../../utils/stringify.js';
import getValuePrecedence from '../../utils/getValuePrecedence.js';

function isValidIdentifier ( str ) {
	// TODO there's probably a bit more to it than this
	return !reservedLookup[ str ] && /^[a-zA-Z_$][a-zA-Z_$0-9]*$/.test( str );
}

function canFold ( node, parent ) {
	while ( parent.type === 'ParenthesizedExpression' ) {
		node = parent;
		parent = node.parent;
	}

	if ( parent.type === 'UpdateExpression' ) return false;
	if ( parent.type === 'AssignmentExpression' || /For(In|Of)Statement/.test( parent.type ) ) return node !== parent.left;

	return true;
}

export default class MemberExpression extends Node {
	getLeftHandSide () {
		return this.object.getLeftHandSide();
	}

	getValue () {
		const objectValue = this.object.getValue();
		if ( !objectValue || objectValue === UNKNOWN ) return UNKNOWN;

		const propertyValue = this.computed ? this.property.getValue() : this.property.name;
		if ( propertyValue === UNKNOWN ) return UNKNOWN;

		const value = objectValue[ propertyValue ];
		if ( value === UNKNOWN || typeof value === 'function' ) return UNKNOWN;

		return value;
	}

	getPrecedence () {
		const value = this.getValue();

		return value === UNKNOWN ? 19 : getValuePrecedence( value );
	}

	getRightHandSide () {
		return this;
	}

	initialise ( program, scope ) {
		if ( !this.computed ) program.addWord( this.property.name );
		super.initialise( program, scope );
	}

	minify ( code, chars ) {
		const value = this.getValue();

		if ( value && value !== UNKNOWN && canFold( this, this.parent ) ) {
			const str = stringify( value );

			if ( str !== null ) {
				code.overwrite( this.start, this.end, str );
				return;
			}
		}

		// special case — numbers
		const objectValue = this.object.getValue();
		if ( typeof objectValue === 'number' && objectValue === parseInt( objectValue, 10 ) ) {
			this.object.append( code, '.' );
		}

		if ( this.computed ) {
			const value = this.property.getValue();

			if ( String( Number( value ) ) === String( value ) ) {
				code.overwrite( this.object.end, this.end, `[${value}]` );
			}

			else if ( typeof value === 'string' && isValidIdentifier( value ) ) {
				code.overwrite( this.object.end, this.end, `.${value}` );
			}

			else {
				if ( this.property.start > this.object.end + 1 ) {
					code.overwrite( this.object.end, this.property.start, '[' );
				}

				if ( this.end > this.property.end + 1 ) {
					code.overwrite( this.property.end, this.end, ']' );
				}

				this.property.minify( code, chars );
			}
		}

		else {
			if ( this.property.start > this.object.end + 1 ) {
				code.overwrite( this.object.end, this.property.start, '.' );
			}
		}

		this.object.minify( code, chars );
	}
}
