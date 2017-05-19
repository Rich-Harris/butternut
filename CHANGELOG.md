# butternut changelog

## 0.4.6

* Too many fixes to list individually!

## 0.4.5

* Remove unused function expression IDs ([#98](https://github.com/Rich-Harris/butternut/pull/98))
* Rewrite `Infinity` as `1/0` ([#99](https://github.com/Rich-Harris/butternut/pull/99))
* Remove parentheses from new expression without parameters ([#100](https://github.com/Rich-Harris/butternut/pull/100))
* Remove leading zero from numbers, use e notation where appropriate ([#102](https://github.com/Rich-Harris/butternut/pull/102))
* Fix order of edits around if statements ([#109](https://github.com/Rich-Harris/butternut/issues/109), [#115](https://github.com/Rich-Harris/butternut/issues/115), [#117](https://github.com/Rich-Harris/butternut/issues/117))
* Preserve initialisers of unused variables if they may contain side-effects ([#101](https://github.com/Rich-Harris/butternut/issues/101))

## 0.4.4

* Dozens of minor fixes ([#91](https://github.com/Rich-Harris/butternut/pull/91))
* Prevent shadowing of non-aliased variables ([#94](https://github.com/Rich-Harris/butternut/issues/94))
* Minify static class methods ([#88](https://github.com/Rich-Harris/butternut/pull/88))
* Handle empty else blocks in if statements ([#89](https://github.com/Rich-Harris/butternut/issues/89))
* Prevent `a=a!==false` becoming `a!===!1` ([#93](https://github.com/Rich-Harris/butternut/pull/93))

## 0.4.3

* Don't insert semicolons before `else` keywords that follow blocks, try statements or empty statements ([#82](https://github.com/Rich-Harris/butternut/issues/82))
* More informative CLI error messages if repro is generated ([#82](https://github.com/Rich-Harris/butternut/issues/82))

## 0.4.2

* Hoist `var` declarations out of removed blocks ([#51](https://github.com/Rich-Harris/butternut/issues/51))
* More conservative constant folding ([#74](https://github.com/Rich-Harris/butternut/issues/74))
* Allow reserved words ([#79](https://github.com/Rich-Harris/butternut/issues/79))
* Preserve/insert parens around object literals as necessary ([#77](https://github.com/Rich-Harris/butternut/issues/77))

## 0.4.1

* Remove certain side-effect-free statements ([#27](https://github.com/Rich-Harris/butternut/issues/27))
* More efficient mangling ([#55](https://github.com/Rich-Harris/butternut/issues/55))
* Fold constants in template literals ([#62](https://github.com/Rich-Harris/butternut/issues/62))
* Fold array method calls in some cases ([#67](https://github.com/Rich-Harris/butternut/pull/67))
* Remove redundant 'use strict' pragmas ([#64](https://github.com/Rich-Harris/butternut/issues/64))
* Prevent over-eager folding of binary/logical expressions ([#75](https://github.com/Rich-Harris/butternut/issues/75))
* Remove empty blocks ([#70](https://github.com/Rich-Harris/butternut/issues/70))

## 0.4.0

* Disallow direct `eval` calls by default, and deopt if explicitly allowed ([#31](https://github.com/Rich-Harris/butternut/issues/31))
* Fold exponentiation expressions ([#50](https://github.com/Rich-Harris/butternut/pull/50))
* Remove code correctly from LogicalExpression nodes if neft hand side is truthy ([#54](https://github.com/Rich-Harris/butternut/issues/54))
* Handle blocks with leading empty statements ([#57](https://github.com/Rich-Harris/butternut/issues/57))
* Insert space before returned arrow function with single parameter ([#52](https://github.com/Rich-Harris/butternut/issues/52))

## 0.3.6

* Correctly minify async and generator functions and methods ([#43](https://github.com/Rich-Harris/butternut/issues/43))
* Only create scope for loops that declare variables in head ([#46](https://github.com/Rich-Harris/butternut/issues/46))
* Remove curly braces around else-block in if-statement with falsy condition ([#41](https://github.com/Rich-Harris/butternut/issues/41))
* Handle duplicate variables in sibling loops ([#33](https://github.com/Rich-Harris/butternut/issues/33))
* Minify expressions in template literals ([#34](https://github.com/Rich-Harris/butternut/issues/34))
* Handle loops with empty bodies ([#38](https://github.com/Rich-Harris/butternut/issues/38))

## 0.3.5

* Remove unused class declarations ([#25](https://github.com/Rich-Harris/butternut/pull/25))
* Remove surplus whitespace around method arguments ([#23](https://github.com/Rich-Harris/butternut/issues/23))
* Insert space after `typeof` where necessary (#24](https://github.com/Rich-Harris/butternut/issues/24))
* Handle anonymous function as default export ([#28](https://github.com/Rich-Harris/butternut/issues/28))

## 0.3.4

* Remove ID of shadowed function expressions ([#18](https://github.com/Rich-Harris/butternut/issues/18))
* Correctly separate SwitchCase consequent statements ([#19](https://github.com/Rich-Harris/butternut/issues/19))
* Remove whitespace around NewExpression arguments ([#16](https://github.com/Rich-Harris/butternut/issues/16))

## 0.3.3

* Remove curlies around blocks that don't need them, and vice versa ([#9](https://github.com/Rich-Harris/butternut/issues/9))

## 0.3.2

* Handle duplicate variable declarations ([#3](https://github.com/Rich-Harris/butternut/issues/3))
* Preserve shorthand property names ([#6](https://github.com/Rich-Harris/butternut/issues/6))

## 0.3.1

* Fix browser build

## 0.3.0

* Loads of fixes (now tested with many of the most popular packages on npm)
* Add `check` option

## 0.2.0

* Renamed to Butternut

## 0.1.2

* Various

## 0.1.1

* Better computed member expressions ([#1](https://github.com/Rich-Harris/butternut/issues/1))

## 0.1.0

* First (experimental) release
