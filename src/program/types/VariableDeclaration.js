import Node from '../Node.js';
import extractNames from '../extractNames.js';

function compatibleDeclarations ( a, b ) {
	if ( a === b ) return true;
	if ( a === 'var' || b === 'var' ) return false;
	return true;
}

export default class VariableDeclaration extends Node {
	attachScope ( program, scope ) {
		this.declarations.forEach( declarator => {
			declarator.attachScope( program, scope );
		});

		scope.functionScope.varDeclarationNodes.push( this );
	}

	initialise ( program, scope ) {
		// TODO `program.addWord(kind)`, but only if this declaration is included...

		let _scope = scope;
		if ( this.kind === 'var' ) while ( _scope.isBlockScope ) _scope = _scope.parent;

		if ( !_scope.parent ) {
			this.skip = false;
		}

		this.declarations.forEach( declarator => {
			if ( !_scope.parent ) {
				// only initialise top-level variables. TODO unless we're in e.g. module mode
				declarator.initialise( program, scope );
			} else {
				if ( declarator.init ) declarator.init.initialise( program, scope );
			}
		});
	}

	minify ( code, chars ) {
		if ( this.collapsed ) return;

		// collapse consecutive declarations into one
		const declarations = this.declarations;

		if ( this.parent.type === 'BlockStatement' || this.parent.type === 'Program' ) {
			let index = this.parent.body.indexOf( this ) + 1;
			do {
				const next = this.parent.body[ index ];
				if ( next && next.type === 'VariableDeclaration' && compatibleDeclarations( next.kind, this.kind ) ) {
					declarations.push( ...next.declarations );
					next.collapsed = true;
				} else {
					break;
				}

				index += 1;
			} while ( index < this.parent.body.length );
		}

		let allDupes = declarations.every( declarator => {
			if ( declarator.skip ) return true;

			const names = extractNames( declarator.id );
			return names.length > 0 && names.every( identifier => {
				return identifier.isDuplicate;
			});
		});

		const kind = this.kind === 'const' ? 'let' : this.kind; // TODO preserve const at top level?
		let c = this.start;
		let first = true;
		let needsKeyword = !allDupes;

		for ( let i = 0; i < declarations.length; i += 1 ) {
			const declarator = declarations[i];

			if ( declarator.skip ) {
				if ( !declarator.init || declarator.init.skip ) continue;

				declarator.init.minify( code, chars );

				// we have a situation like `var unused = x()` — need to preserve `x()`
				code.overwrite( c, declarator.init.start, first ? '' : ';' );
				needsKeyword = true;
			} else {
				declarator.minify( code, chars );

				let separator = needsKeyword ?
					( first ? kind : `;${kind}` ) + ( declarator.id.type === 'Identifier' ? ' ' : '' ) :
					first ? '' : ',';

				code.overwrite( c, declarator.start, separator );
				needsKeyword = false;
			}

			c = declarator.end;
			first = false;
		}

		if ( this.end > c + 1 ) code.remove( c, this.end - 1 );

		// we may have been asked to declare some additional vars, if they were
		// declared inside blocks that have been removed
		if ( this.rideAlongs ) code.appendLeft( c, `,` + this.rideAlongs.join( ',' ) );
	}
}
