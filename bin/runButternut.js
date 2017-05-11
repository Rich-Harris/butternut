var fs = require( 'fs' );
var path = require( 'path' );
var butternut = require( '../' );
var handleError = require( './handleError.js' );
var EOL = require('os').EOL;

function mkdirp ( dir ) {
	const parent = path.dirname( dir );
	if ( dir === parent ) return;

	mkdirp( parent );

	try {
		fs.mkdirSync( dir );
	} catch ( err ) {
		if ( err.code !== 'EEXIST' ) throw err;
	}
}

function compile ( from, to, command ) {
	try {
		var stats = fs.statSync( from );
		if ( stats.isDirectory() ) {
			compileDir( from, to, command );
		} else {
			compileFile( from, to, command );
		}
	} catch ( err ) {
		handleError( err );
	}
}

function compileDir ( from, to, command ) {
	if ( !command.output ) handleError({ code: 'MISSING_OUTPUT_DIR' });

	mkdirp( to );

	fs.readdirSync( from ).forEach( function ( file ) {
		compile( path.resolve( from, file ), path.resolve( to, file ), command );
	});
}

function compileFile ( from, to, command ) {
	var ext = path.extname( from );

	if ( ext !== '.js' && ext !== '.jsm' && ext !== '.es6' ) return;

	if ( to ) to = to.slice( 0, -ext.length ) + '.js';

	var source = fs.readFileSync( from, 'utf-8' );
	var result = butternut.squash( source, {
		source: from,
		file: to,
		check: command.check
	});

	write( result, to, command );
}

function write ( result, to, command ) {
	if ( command.sourcemap === 'inline' ) {
		result.code += EOL + '//# sourceMappingURL=' + result.map.toUrl();
	} else if ( command.sourcemap ) {
		if ( !to ) {
			handleError({ code: 'MISSING_OUTPUT_FILE' });
		}

		result.code += EOL + '//# sourceMappingURL=' + path.basename( to ) + '.map';
		fs.writeFileSync( to + '.map', result.map.toString() );
	}

	if ( to ) {
		fs.writeFileSync( to, result.code );
	} else {
		console.log( result.code ); // eslint-disable-line no-console
	}
}

module.exports = function ( command ) {
	if ( command._.length > 1 ) {
		handleError({ code: 'ONE_AT_A_TIME' });
	}

	if ( command._.length === 1 ) {
		if ( command.input ) {
			handleError({ code: 'DUPLICATE_IMPORT_OPTIONS' });
		}

		command.input = command._[0];
	}

	if ( command.input ) {
		if ( command.output ) mkdirp( path.dirname( command.output ) );
		compile( command.input, command.output, command );
	}

	else {
		process.stdin.resume();
		process.stdin.setEncoding( 'utf8' );

		var source = '';

		process.stdin.on( 'data', function ( chunk ) {
			source += chunk;
		});

		process.stdin.on( 'end', function () {
			var result = butternut.squash( source );
			write( result, null, command );
		});
	}
};
