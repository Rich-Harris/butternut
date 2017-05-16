import isNegativeZero from './isNegativeZero.js';

// TODO if string, determine which quotes to use
// TODO if number, determine whether to use e notation

export default function stringify ( value ) {
	if ( typeof value === 'function' ) return null;

	if ( value !== value ) return 'NaN';
	if ( value === Infinity ) return '1/0';
	if ( value === -Infinity ) return '-1/0';
	if ( value === true ) return '!0';
	if ( value === false ) return '!1';
	if ( value === undefined ) return 'void 0';
	if ( isNegativeZero( value ) ) return '-0';

	if ( typeof value === 'number' ) {
		const str = String( value ).replace( /^(-)?0\./, '$1.' );
		const exponential = value.toExponential().replace( 'e+', 'e' );

		return exponential.length < str.length ? exponential : str;
	}

	return JSON.stringify( value )
		.replace( /\u2028/g, '\\u2028' )
		.replace( /\u2029/g, '\\u2029' );
}