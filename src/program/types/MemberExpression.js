import Node from '../Node.js';
import reserved from '../../utils/reserved.js';
import { UNKNOWN, TRUTHY, FALSY } from '../../utils/sentinels.js';
import stringify from '../../utils/stringify.js';

function isValidIdentifier ( str ) {
	// TODO there's probably a bit more to it than this
	return !reserved[ str ] && /^[a-zA-Z_$][a-zA-Z_$0-9]*$/.test( str );
}

export default class MemberExpression extends Node {
	getValue () {
		const objectValue = this.object.getValue();
		if ( objectValue === UNKNOWN || objectValue === TRUTHY || objectValue === FALSY ) return UNKNOWN;

		if ( this.computed ) {
			const propertyValue = this.property.getValue();
			if ( propertyValue === UNKNOWN || propertyValue === TRUTHY || propertyValue === FALSY ) return UNKNOWN;

			return objectValue[ propertyValue ];
		}

		if ( !objectValue ) return UNKNOWN;

		return objectValue[ this.property.name ];
	}

	getPrecedence () {
		return 18;
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

				this.property.minify( code );
			}
		}

		else {
			if ( this.property.start > this.object.end + 1 ) {
				code.overwrite( this.object.end, this.property.start, '.' );
			}
		}

		this.object.minify( code );
	}
}
