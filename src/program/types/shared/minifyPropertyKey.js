export default function minifyPropertyKey ( code, property, isObject ) {
	if ( property.shorthand ) return;

	const separator = ( isObject && !property.method ) ? ':' : '';

	if ( property.value.async || property.value.generator || property.computed || property.static ) {
		let prefix = '';
		if ( property.static ) prefix += 'static'; // only applies to class methods, obviously

		if ( property.value.async ) {
			prefix += ( property.static ? ' async' : 'async' );
		} else if ( property.value.generator ) {
			prefix += '*';
		}

		if ( property.computed ) {
			prefix += '[';
		} else if ( property.value.async || ( property.static && !property.value.generator ) ) {
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
}