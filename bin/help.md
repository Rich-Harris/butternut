Butternut version <%= version %>
=====================================

Usage: squash [options] <entry file>

Basic options:

-v, --version            Show version number
-h, --help               Show this help message
-i, --input              Input (alternative to <entry file>)
-o, --output <output>    Output (if absent, prints to stdout)
-m, --sourcemap          Generate sourcemap (`-m inline` for inline map)
--check                  Parse the output to check it is valid JS

Examples:

# Minify app.js as app.min.js
squash app.js > app.min.js

# Minify app.js as app.min.js, write sourcemap to app.min.js.map
squash app.js -o app.min.js -m

# Minify app.js as app.min.js with inline sourcemap
squash app.js -o app.min.js -m inline

# Minify all the files in src/ to dest/
squash src -o dest

Notes:

* When piping to stdout, only inline sourcemaps are permitted

For more information visit http://butternut.surge.sh/guide
