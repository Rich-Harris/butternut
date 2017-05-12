export default function minifyPropertyKey ( code, property, isObject ) {
	if ( property.shorthand ) return;

	const separator = ( isObject && !property.method ) ? ':' : '';

	if ( property.value.async || property.value.generator || property.computed ) {
		const prefix = ( property.value.async ? ( property.computed ? 'async' : 'async ' ) : property.value.generator ? '*' : '' ) + ( property.computed ? '[' : '' );
		if ( property.key.start - property.start > prefix.length ) code.overwrite( property.start, property.key.start, prefix );

		const suffix = ( property.computed ? ']' : '' ) + separator;
		if ( property.value.start - property.key.end > suffix.length ) code.overwrite( property.key.end, property.value.start, suffix );
	}

	else if ( separator ) {
		if ( property.value.start - property.key.end > 1 ) code.overwrite( property.key.end, property.value.start, separator );
	}

	else {
		code.remove( property.key.end, property.value.start );
	}
}