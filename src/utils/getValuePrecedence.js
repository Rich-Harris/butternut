import isNegativeZero from './isNegativeZero.js';

export default function getValuePrecedence ( value ) {
	if ( value === true || value === false || value === undefined ) return 16; // unary operator — !0, !1, void 0
	if ( typeof value === 'number' ) {
		if ( value < 0 || isNegativeZero( value ) ) return 16;
	}

	return 21;
}