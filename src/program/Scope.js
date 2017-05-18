import { reserved } from '../utils/reserved.js';
import CompileError from '../utils/CompileError.js';

const letConst = /^(?:let|const)$/;

export default function Scope ( options ) {
	options = options || {};

	this.parent = options.parent;
	this.canMangle = !!this.parent;
	this.isBlockScope = !!options.block;
	this.useStrict = this.parent && this.parent.useStrict;

	// vars declared in blocks are stored here, so that we
	// can hoist them if those blocks are removed but the
	// declarations are used. TODO an alternative approach
	// would be to replace instances of the hoisted var
	// with `void 0`
	this.varDeclarations = new Set();
	this.hoistedVars = new Set();
	this.varDeclarationNodes = [];

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
	addDeclaration ( identifier, kind ) {
		if ( kind === 'var' && this.isBlockScope ) {
			this.varDeclarations.add( identifier.name );
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
			if ( existingDeclaration.kind === 'FunctionExpression' ) {
				existingDeclaration.node.parent.shadowed = true;
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
	},

	addReference ( identifier ) {
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

	deopt () {
		if ( !this.deopted ) {
			this.deopted = true;
			this.canMangle = false;

			if ( this.parent ) this.parent.deopt();

			Object.keys( this.declarations ).forEach( name => {
				this.declarations[name].node.activate();
			});
		}
	},

	findDeclaration ( name ) {
		return this.declarations[ name ] ||
		       ( this.parent && this.parent.findDeclaration( name ) );
	},

	mangle ( code, chars ) {
		if ( !this.canMangle ) return;

		let used = Object.create( null );
		reserved.forEach( word => {
			used[ word ] = true;
		});

		Object.keys( this.references ).forEach( reference => {
			const declaration = this.parent && this.parent.findDeclaration( reference );
			used[ declaration && declaration.alias || reference ] = true;
		});

		let i = -1;
		function getNextAlias () {
			let alias;

			do {
				i += 1;
				alias = getAlias( chars, i );
			} while ( alias in used );

			return alias;
		}

		// TODO sort declarations by number of instances?

		Object.keys( this.declarations ).forEach( name => {
			const declaration = this.declarations[ name ];
			if ( declaration.instances.length === 0 ) return;

			// special case — function expression IDs may be removed outright
			if ( declaration.node.parent.type === 'FunctionExpression' && declaration.node === declaration.node.parent.id ) {
				if ( declaration.node.shadowed || declaration.instances.length === 1 ) return;
			}

			declaration.alias = getNextAlias();

			declaration.instances.forEach( instance => {
				const replacement = instance.parent.type === 'Property' && instance.parent.shorthand ?
					`${instance.name}:${declaration.alias}` :
					declaration.alias;

				code.overwrite( instance.start, instance.end, replacement, true );
			});
		});
	}
};

// adapted from https://github.com/mishoo/UglifyJS2/blob/master/lib/scope.js
function getAlias ( chars, i ) {
	let alias = '';
	let base = 54;

	i++;
	do {
		i--;
		alias += chars[ i % base ];
		i = Math.floor( i / base );
		base = 64;
	} while ( i > 0 );

	return alias;
}