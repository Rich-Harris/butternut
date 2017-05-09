export default function stringify ( value ) {
	if ( typeof value === 'function' ) return null;
	if ( typeof value === 'object' ) return null;

	if ( value !== value ) return 'NaN';
	if ( value === true ) return '!0';
	if ( value === false ) return '!1';
	if ( value === undefined ) return 'void 0';

	// TODO if string, determine which quotes to use
	// TODO if number, determine whether to use e notation

	if ( isNegativeZero( value ) ) return '-0';
	return JSON.stringify( value )
		.replace( /\u2028/g, '\\u2028' )
		.replace( /\u2029/g, '\\u2029' );
}

function isNegativeZero ( num ) {
	return num === 0 && ( 1 / num < 0 );
}