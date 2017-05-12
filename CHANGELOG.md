# butternut changelog

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
