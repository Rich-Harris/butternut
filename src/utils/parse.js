import * as acorn from 'acorn';

export default function parse ( source ) {
	return acorn.parse( source, {
		ecmaVersion: 8,
		preserveParens: true,
		sourceType: 'module',
		allowReserved: true,
		allowReturnOutsideFunction: true
	});
}