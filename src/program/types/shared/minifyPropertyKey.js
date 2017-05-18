function isAccessor ( property ) {
	return property.kind === 'get' || property.kind === 'set';
}

export default function minifyPropertyKey ( code, chars, property, isObject ) {
	if ( property.shorthand ) return;

	const separator = ( isObject && !property.method && !isAccessor( property ) ) ? ':' : '';

	if ( property.value.async || property.value.generator || property.computed || property.static || isAccessor( property ) ) {
		let prefix = '';
		if ( property.static ) prefix += 'static'; // only applies to class methods, obviously

		if ( isAccessor( property ) ) {
			prefix += ( property.static ) ? ` ${property.kind}` : property.kind;
		} else if ( property.value.async ) {
			prefix += ( property.static ? ' async' : 'async' );
		} else if ( property.value.generator ) {
			prefix += '*';
		}

		if ( property.computed ) {
			prefix += '[';
		} else if ( prefix && !property.value.generator ) {
			prefix += ' ';
		}

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

	property.key.minify( code, chars );
}