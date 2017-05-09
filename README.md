# Butternut

The fast, future-friendly minifier

*Warning: this is alpha software. Test thoroughly before using in production! Consider using the [check option](#the-check-option). Please report any bugs you find!*


## Why?

Modern browsers support the newest version of JavaScript (ES2015+, aka ES6), and many JavaScript developers are already using ES2015 features in their code. Unfortunately, the most popular minifier — UglifyJS — doesn't officially support ES2015. That means we have to compile our code to ES5 (e.g. using Babel or Bublé) in order to ship it, even if we're not supporting older browsers.

There are alternatives to Uglify — Babili and Closure Compiler. But both tools are much slower than Uglify, and generate larger output (in Closure's case you can achieve greater compression using the advanced compilation mode, but this requires you to write your code in a particular way and is therefore not a general solution).

Butternut is fully ES2015+ aware, delivers superior compression to Babili or Closure, and is typically around 4x faster than Uglify (or 10-15x faster than Babili). It doesn't yet compress ES5 as well as Uglify, but an ES2015 codebase minified with Butternut is often smaller than the same codebase transpiled prior to minification with Uglify.


## Usage

The easiest way to use Butternut is to plug it into your existing build process:

* [rollup-plugin-butternut](https://github.com/rollup/rollup-plugin-butternut)

Alternatively, you can use it directly via the CLI or the JavaScript API:


### Command Line Interface

Install Butternut globally, then use the `squash` command:

```bash
npm install --global butternut # or npm i -g butternut
squash app.js > app.min.js
```

Run `squash --help` to see the available options.


### JavaScript API

Install Butternut to your project...

```bash
npm install --save-dev butternut # or npm i -D butternut
```

...then use it like so:

```js
const butternut = require('butternut');
const { code, map } = butternut.squash(source, options);
```

The `options` argument, if supplied, is an object that can have the following properties:

* `sourceMap` — set to `false` if you don't want to generate a sourcemap. Defaults to `true`
* `file` — the destination filename, used in sourcemap generation
* `source` — the source filename, used in sourcemap generation
* `includeContent` — whether to include the original source in the sourcemap. Defaults to `true`
* `check` — see [below](#the-check-option)


### The `check` option

Since Butternut is a new project, it hasn't yet been battle-tested. It *may* generate code that you don't expect. If you pass `check: true` (or use the `--check` flag, if using the CLI), Butternut will parse the generated output to verify that it is valid JavaScript. If not, it means it's messed something up, in which case it will try to help you find the code that it failed to minify correctly.

If you find bugs while using Butternut, please raise an issue!


## License

[MIT](LICENSE)