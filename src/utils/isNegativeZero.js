export default function isNegativeZero ( num ) {
	return num === 0 && ( 1 / num < 0 );
}