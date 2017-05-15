var chalk = require( 'chalk' );

var handlers = {
	MISSING_INPUT_OPTION: function () {
		console.error( chalk.red( 'You must specify an --input (-i) option' ) );
	},

	MISSING_OUTPUT_DIR: function () {
		console.error( chalk.red( 'You must specify an --output (-o) option when compiling a directory of files' ) );
	},

	MISSING_OUTPUT_FILE: function () {
		console.error( chalk.red( 'You must specify an --output (-o) option when creating a file with a sourcemap' ) );
	},

	ONE_AT_A_TIME: function ( err ) {
		console.error( chalk.red( 'Butternut can only minify one file/directory at a time' ) );
	},

	DUPLICATE_IMPORT_OPTIONS: function ( err ) {
		console.error( chalk.red( 'use --input, or pass input path as argument – not both' ) );
	}
};

module.exports = function handleError ( err ) {
	var handler;

	if ( handler = handlers[ err && err.code ] ) {
		handler( err );
	} else {
		if ( err.check ) {
			console.error( chalk.red( `Butternut generated invalid JavaScript. Please raise an issue at https://github.com/Rich-Harris/butternut/issues` ) );

			if ( err.repro ) {
				console.error( chalk.cyan( `Errored minifying code near line ${err.repro.loc.line}, column ${err.repro.loc.column}. Reproducible with this input:` ) );
				console.error( err.repro.input );
			}
		}

		else {
			console.error( chalk.red( err.message || err ) );

			if ( err.stack ) {
				console.error( chalk.grey( err.stack ) );
			}

			console.error( 'Type ' + chalk.cyan( 'squash --help' ) + ' for help, or visit https://github.com/Rich-Harris/butternut' );
		}
	}

	process.exit( 1 );
};
