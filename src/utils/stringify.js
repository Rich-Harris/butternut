export default function stringify ( value ) {
	if ( typeof value === 'function' ) return null;
	if ( typeof value === 'object' ) return null;

	if ( value !== value ) return 'NaN';
	if ( value === true ) return '!0';
	if ( value === false ) return '!1';
	if ( value === undefined ) return 'void 0';

	// TODO if string, determine which quotes to use
	// TODO if number, determine whether to use e notation

	return JSON.stringify( value );
}
