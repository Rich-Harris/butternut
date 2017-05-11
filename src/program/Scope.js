import reserved from '../utils/reserved.js';
import CompileError from '../utils/CompileError.js';

const letConst = /^(?:let|const)$/;

const validChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$';

export default function Scope ( options ) {
	options = options || {};

	this.parent = options.parent;
	this.owner = options.owner;
	this.isBlockScope = !!options.block;

	let scope = this;
	while ( scope.isBlockScope ) scope = scope.parent;
	this.functionScope = scope;

	this.identifiers = [];
	this.declarations = Object.create( null );
	this.references = Object.create( null );
	this.blockScopedDeclarations = this.isBlockScope ? null : Object.create( null );
	this.aliases = Object.create( null );

	this.idCounter = [ 0 ];
}

Scope.prototype = {
	addAlias ( alias ) {
		this.aliases[ alias ] = true;
		if ( this.parent ) this.parent.addAlias( alias );
	},

	addDeclaration ( identifier, kind ) {
		if ( kind === 'var' && this.isBlockScope ) {
			this.parent.addDeclaration( identifier, kind );
			return;
		}

		const { name } = identifier;

		const existingDeclaration = this.declarations[ name ];
		if ( existingDeclaration ) {
			if ( letConst.test( kind ) || letConst.test( existingDeclaration.kind ) ) {
				// TODO warn about double var declarations?
				throw new CompileError( identifier, `${name} is already declared` );
			}

			// special case — function expression IDs that are shadowed by
			// declarations should just be removed (TODO unless the user wishes
			// to keep function names — https://github.com/Rich-Harris/butternut/issues/17)
			if ( existingDeclaration.node.parent.type === 'FunctionExpression' ) {
				existingDeclaration.node.parent.removeId = true;
			}

			else {
				identifier.isDuplicate = true;

				if ( existingDeclaration.activated ) {
					identifier.activate();
				} else {
					existingDeclaration.duplicates.push( identifier );
				}

				return;
			}
		}

		const declaration = {
			activated: !this.parent, // TODO is this necessary?
			name,
			node: identifier,
			kind,
			instances: [],
			duplicates: []
		};

		this.declarations[ name ] = declaration;

		if ( this.isBlockScope ) {
			if ( !this.functionScope.blockScopedDeclarations[ name ] ) this.functionScope.blockScopedDeclarations[ name ] = [];
			this.functionScope.blockScopedDeclarations[ name ].push( declaration );
		}

		if ( kind === 'param' ) {
			declaration.instances.push( identifier );
		}

		if ( !this.parent ) {
			identifier.activate();
		}
	},

	addReference ( identifier ) {
		if ( this.consolidated ) {
			this.consolidateReference( identifier );
		} else {
			this.identifiers.push( identifier );
		}
	},

	consolidate () {
		for ( let i = 0; i < this.identifiers.length; i += 1 ) { // we might push to the array during consolidation, so don't cache length
			const identifier = this.identifiers[i];
			this.consolidateReference( identifier );
		}

		this.consolidated = true; // TODO understand why this is necessary... seems bad
	},

	consolidateReference ( identifier ) {
		const declaration = this.declarations[ identifier.name ];
		if ( declaration ) {
			declaration.instances.push( identifier );

			if ( !declaration.activated ) {
				declaration.activated = true;
				// const parent = declaration.node.parent;

				declaration.node.activate();
				declaration.duplicates.forEach( dupe => {
					dupe.activate();
				});
				// if ( declaration.kind === 'param' ) {
				// 	// TODO is there anything to do here?
				// } else if ( parent.activate ) {
				// 	parent.activate();
				// }
			}
		} else {
			this.references[ identifier.name ] = true;
			if ( this.parent ) this.parent.addReference( identifier );
		}
	},

	contains ( name ) {
		return this.declarations[ name ] ||
		       ( this.parent ? this.parent.contains( name ) : false );
	},

	containsAlias ( alias ) {
		return this.aliases[ alias ] || ( this.parent && this.parent.containsAlias( alias ) );
	},

	createIdentifier ( used ) {
		let alias;

		do {
			alias = this.idCounter.map( i => validChars[i] ).join( '' );

			let i = this.idCounter.length;
			while ( i-- ) {
				this.idCounter[i] += 1;
				if ( this.idCounter[i] === validChars.length ) {
					this.idCounter[i] = 0;

					if ( i === 0 ) this.idCounter.push( 0 );
				} else {
					break;
				}
			}
		} while ( used[ alias ] || reserved[ alias ] );

		return alias;
	},

	findDeclaration ( name ) {
		return this.declarations[ name ] ||
		       ( this.parent && this.parent.findDeclaration( name ) );
	},

	mangle ( code ) {
		if ( !this.parent ) return;

		let used = Object.create( null );

		Object.keys( this.references ).forEach( reference => {
			const declaration = this.parent && this.parent.findDeclaration( reference );
			used[ declaration ? declaration.alias : reference ] = true;
		});

		Object.keys( this.declarations ).forEach( name => {
			const declaration = this.declarations[ name ];
			declaration.alias = this.createIdentifier( used );

			declaration.instances.forEach( instance => {
				// special case — function expression IDs may be removed outright
				if ( instance.parent.type === 'FunctionExpression' && instance === instance.parent.id && instance.parent.removeId ) return;

				const replacement = instance.parent.type === 'Property' && instance.parent.shorthand ?
					`${instance.name}:${declaration.alias}` :
					declaration.alias;

				code.overwrite( instance.start, instance.end, replacement, true );
			});
		});
	}
};
