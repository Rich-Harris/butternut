export const reserved = 'do if in for let new try var case else enum eval null this true void with await break catch class const false super throw while yield delete export import public return static switch typeof default extends finally package private continue debugger function arguments interface protected implements instanceof'.split( ' ' );

export const reservedLookup = Object.create( null );
reserved.forEach( word => {
	reservedLookup[ word ] = true;
});