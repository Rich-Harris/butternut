module.exports = function getLocation ( source, search, start ) {
	if ( typeof search === 'string' ) {
		search = source.indexOf( search, start );
	}

	var lines = source.split( '\n' );
	var len = lines.length;

	var lineStart = 0;
	var i;

	for ( i = 0; i < len; i += 1 ) {
		var line = lines[i];
		var lineEnd =  lineStart + line.length + 1; // +1 for newline

		if ( lineEnd > search ) {
			return { line: i + 1, column: search - lineStart, char: i };
		}

		lineStart = lineEnd;
	}

	throw new Error( 'Could not determine location of character' );
}
