(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.CV2Plugins = {}));
})(this, (function (exports) { 'use strict';

	const FrontSide = 0;
	const BackSide = 1;
	const NormalBlending = 1;
	const AddEquation = 100;
	const SrcAlphaFactor = 204;
	const OneMinusSrcAlphaFactor = 205;
	const LessEqualDepth = 3;
	const MultiplyOperation = 0;
	const FloatType = 1015;

	// Color space string identifiers, matching CSS Color Module Level 4 and WebGPU names where available.
	const NoColorSpace = '';
	const SRGBColorSpace = 'srgb';
	const LinearSRGBColorSpace = 'srgb-linear';
	const DisplayP3ColorSpace = 'display-p3';
	const LinearDisplayP3ColorSpace = 'display-p3-linear';

	const LinearTransfer = 'linear';
	const SRGBTransfer = 'srgb';

	const Rec709Primaries = 'rec709';
	const P3Primaries = 'p3';
	const KeepStencilOp = 7680;
	const AlwaysStencilFunc = 519;

	const StaticDrawUsage = 35044;

	const WebGLCoordinateSystem = 2000;
	const WebGPUCoordinateSystem = 2001;

	class Matrix3 {

		constructor( n11, n12, n13, n21, n22, n23, n31, n32, n33 ) {

			Matrix3.prototype.isMatrix3 = true;

			this.elements = [

				1, 0, 0,
				0, 1, 0,
				0, 0, 1

			];

			if ( n11 !== undefined ) {

				this.set( n11, n12, n13, n21, n22, n23, n31, n32, n33 );

			}

		}

		set( n11, n12, n13, n21, n22, n23, n31, n32, n33 ) {

			const te = this.elements;

			te[ 0 ] = n11; te[ 1 ] = n21; te[ 2 ] = n31;
			te[ 3 ] = n12; te[ 4 ] = n22; te[ 5 ] = n32;
			te[ 6 ] = n13; te[ 7 ] = n23; te[ 8 ] = n33;

			return this;

		}

		identity() {

			this.set(

				1, 0, 0,
				0, 1, 0,
				0, 0, 1

			);

			return this;

		}

		copy( m ) {

			const te = this.elements;
			const me = m.elements;

			te[ 0 ] = me[ 0 ]; te[ 1 ] = me[ 1 ]; te[ 2 ] = me[ 2 ];
			te[ 3 ] = me[ 3 ]; te[ 4 ] = me[ 4 ]; te[ 5 ] = me[ 5 ];
			te[ 6 ] = me[ 6 ]; te[ 7 ] = me[ 7 ]; te[ 8 ] = me[ 8 ];

			return this;

		}

		extractBasis( xAxis, yAxis, zAxis ) {

			xAxis.setFromMatrix3Column( this, 0 );
			yAxis.setFromMatrix3Column( this, 1 );
			zAxis.setFromMatrix3Column( this, 2 );

			return this;

		}

		setFromMatrix4( m ) {

			const me = m.elements;

			this.set(

				me[ 0 ], me[ 4 ], me[ 8 ],
				me[ 1 ], me[ 5 ], me[ 9 ],
				me[ 2 ], me[ 6 ], me[ 10 ]

			);

			return this;

		}

		multiply( m ) {

			return this.multiplyMatrices( this, m );

		}

		premultiply( m ) {

			return this.multiplyMatrices( m, this );

		}

		multiplyMatrices( a, b ) {

			const ae = a.elements;
			const be = b.elements;
			const te = this.elements;

			const a11 = ae[ 0 ], a12 = ae[ 3 ], a13 = ae[ 6 ];
			const a21 = ae[ 1 ], a22 = ae[ 4 ], a23 = ae[ 7 ];
			const a31 = ae[ 2 ], a32 = ae[ 5 ], a33 = ae[ 8 ];

			const b11 = be[ 0 ], b12 = be[ 3 ], b13 = be[ 6 ];
			const b21 = be[ 1 ], b22 = be[ 4 ], b23 = be[ 7 ];
			const b31 = be[ 2 ], b32 = be[ 5 ], b33 = be[ 8 ];

			te[ 0 ] = a11 * b11 + a12 * b21 + a13 * b31;
			te[ 3 ] = a11 * b12 + a12 * b22 + a13 * b32;
			te[ 6 ] = a11 * b13 + a12 * b23 + a13 * b33;

			te[ 1 ] = a21 * b11 + a22 * b21 + a23 * b31;
			te[ 4 ] = a21 * b12 + a22 * b22 + a23 * b32;
			te[ 7 ] = a21 * b13 + a22 * b23 + a23 * b33;

			te[ 2 ] = a31 * b11 + a32 * b21 + a33 * b31;
			te[ 5 ] = a31 * b12 + a32 * b22 + a33 * b32;
			te[ 8 ] = a31 * b13 + a32 * b23 + a33 * b33;

			return this;

		}

		multiplyScalar( s ) {

			const te = this.elements;

			te[ 0 ] *= s; te[ 3 ] *= s; te[ 6 ] *= s;
			te[ 1 ] *= s; te[ 4 ] *= s; te[ 7 ] *= s;
			te[ 2 ] *= s; te[ 5 ] *= s; te[ 8 ] *= s;

			return this;

		}

		determinant() {

			const te = this.elements;

			const a = te[ 0 ], b = te[ 1 ], c = te[ 2 ],
				d = te[ 3 ], e = te[ 4 ], f = te[ 5 ],
				g = te[ 6 ], h = te[ 7 ], i = te[ 8 ];

			return a * e * i - a * f * h - b * d * i + b * f * g + c * d * h - c * e * g;

		}

		invert() {

			const te = this.elements,

				n11 = te[ 0 ], n21 = te[ 1 ], n31 = te[ 2 ],
				n12 = te[ 3 ], n22 = te[ 4 ], n32 = te[ 5 ],
				n13 = te[ 6 ], n23 = te[ 7 ], n33 = te[ 8 ],

				t11 = n33 * n22 - n32 * n23,
				t12 = n32 * n13 - n33 * n12,
				t13 = n23 * n12 - n22 * n13,

				det = n11 * t11 + n21 * t12 + n31 * t13;

			if ( det === 0 ) return this.set( 0, 0, 0, 0, 0, 0, 0, 0, 0 );

			const detInv = 1 / det;

			te[ 0 ] = t11 * detInv;
			te[ 1 ] = ( n31 * n23 - n33 * n21 ) * detInv;
			te[ 2 ] = ( n32 * n21 - n31 * n22 ) * detInv;

			te[ 3 ] = t12 * detInv;
			te[ 4 ] = ( n33 * n11 - n31 * n13 ) * detInv;
			te[ 5 ] = ( n31 * n12 - n32 * n11 ) * detInv;

			te[ 6 ] = t13 * detInv;
			te[ 7 ] = ( n21 * n13 - n23 * n11 ) * detInv;
			te[ 8 ] = ( n22 * n11 - n21 * n12 ) * detInv;

			return this;

		}

		transpose() {

			let tmp;
			const m = this.elements;

			tmp = m[ 1 ]; m[ 1 ] = m[ 3 ]; m[ 3 ] = tmp;
			tmp = m[ 2 ]; m[ 2 ] = m[ 6 ]; m[ 6 ] = tmp;
			tmp = m[ 5 ]; m[ 5 ] = m[ 7 ]; m[ 7 ] = tmp;

			return this;

		}

		getNormalMatrix( matrix4 ) {

			return this.setFromMatrix4( matrix4 ).invert().transpose();

		}

		transposeIntoArray( r ) {

			const m = this.elements;

			r[ 0 ] = m[ 0 ];
			r[ 1 ] = m[ 3 ];
			r[ 2 ] = m[ 6 ];
			r[ 3 ] = m[ 1 ];
			r[ 4 ] = m[ 4 ];
			r[ 5 ] = m[ 7 ];
			r[ 6 ] = m[ 2 ];
			r[ 7 ] = m[ 5 ];
			r[ 8 ] = m[ 8 ];

			return this;

		}

		setUvTransform( tx, ty, sx, sy, rotation, cx, cy ) {

			const c = Math.cos( rotation );
			const s = Math.sin( rotation );

			this.set(
				sx * c, sx * s, - sx * ( c * cx + s * cy ) + cx + tx,
				- sy * s, sy * c, - sy * ( - s * cx + c * cy ) + cy + ty,
				0, 0, 1
			);

			return this;

		}

		//

		scale( sx, sy ) {

			this.premultiply( _m3.makeScale( sx, sy ) );

			return this;

		}

		rotate( theta ) {

			this.premultiply( _m3.makeRotation( - theta ) );

			return this;

		}

		translate( tx, ty ) {

			this.premultiply( _m3.makeTranslation( tx, ty ) );

			return this;

		}

		// for 2D Transforms

		makeTranslation( x, y ) {

			if ( x.isVector2 ) {

				this.set(

					1, 0, x.x,
					0, 1, x.y,
					0, 0, 1

				);

			} else {

				this.set(

					1, 0, x,
					0, 1, y,
					0, 0, 1

				);

			}

			return this;

		}

		makeRotation( theta ) {

			// counterclockwise

			const c = Math.cos( theta );
			const s = Math.sin( theta );

			this.set(

				c, - s, 0,
				s, c, 0,
				0, 0, 1

			);

			return this;

		}

		makeScale( x, y ) {

			this.set(

				x, 0, 0,
				0, y, 0,
				0, 0, 1

			);

			return this;

		}

		//

		equals( matrix ) {

			const te = this.elements;
			const me = matrix.elements;

			for ( let i = 0; i < 9; i ++ ) {

				if ( te[ i ] !== me[ i ] ) return false;

			}

			return true;

		}

		fromArray( array, offset = 0 ) {

			for ( let i = 0; i < 9; i ++ ) {

				this.elements[ i ] = array[ i + offset ];

			}

			return this;

		}

		toArray( array = [], offset = 0 ) {

			const te = this.elements;

			array[ offset ] = te[ 0 ];
			array[ offset + 1 ] = te[ 1 ];
			array[ offset + 2 ] = te[ 2 ];

			array[ offset + 3 ] = te[ 3 ];
			array[ offset + 4 ] = te[ 4 ];
			array[ offset + 5 ] = te[ 5 ];

			array[ offset + 6 ] = te[ 6 ];
			array[ offset + 7 ] = te[ 7 ];
			array[ offset + 8 ] = te[ 8 ];

			return array;

		}

		clone() {

			return new this.constructor().fromArray( this.elements );

		}

	}

	const _m3 = /*@__PURE__*/ new Matrix3();

	/**
	 * Matrices converting P3 <-> Rec. 709 primaries, without gamut mapping
	 * or clipping. Based on W3C specifications for sRGB and Display P3,
	 * and ICC specifications for the D50 connection space. Values in/out
	 * are _linear_ sRGB and _linear_ Display P3.
	 *
	 * Note that both sRGB and Display P3 use the sRGB transfer functions.
	 *
	 * Reference:
	 * - http://www.russellcottrell.com/photo/matrixCalculator.htm
	 */

	const LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = /*@__PURE__*/ new Matrix3().set(
		0.8224621, 0.177538, 0.0,
		0.0331941, 0.9668058, 0.0,
		0.0170827, 0.0723974, 0.9105199,
	);

	const LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = /*@__PURE__*/ new Matrix3().set(
		1.2249401, - 0.2249404, 0.0,
		- 0.0420569, 1.0420571, 0.0,
		- 0.0196376, - 0.0786361, 1.0982735
	);

	/**
	 * Defines supported color spaces by transfer function and primaries,
	 * and provides conversions to/from the Linear-sRGB reference space.
	 */
	const COLOR_SPACES = {
		[ LinearSRGBColorSpace ]: {
			transfer: LinearTransfer,
			primaries: Rec709Primaries,
			toReference: ( color ) => color,
			fromReference: ( color ) => color,
		},
		[ SRGBColorSpace ]: {
			transfer: SRGBTransfer,
			primaries: Rec709Primaries,
			toReference: ( color ) => color.convertSRGBToLinear(),
			fromReference: ( color ) => color.convertLinearToSRGB(),
		},
		[ LinearDisplayP3ColorSpace ]: {
			transfer: LinearTransfer,
			primaries: P3Primaries,
			toReference: ( color ) => color.applyMatrix3( LINEAR_DISPLAY_P3_TO_LINEAR_SRGB ),
			fromReference: ( color ) => color.applyMatrix3( LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 ),
		},
		[ DisplayP3ColorSpace ]: {
			transfer: SRGBTransfer,
			primaries: P3Primaries,
			toReference: ( color ) => color.convertSRGBToLinear().applyMatrix3( LINEAR_DISPLAY_P3_TO_LINEAR_SRGB ),
			fromReference: ( color ) => color.applyMatrix3( LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 ).convertLinearToSRGB(),
		},
	};

	const SUPPORTED_WORKING_COLOR_SPACES = new Set( [ LinearSRGBColorSpace, LinearDisplayP3ColorSpace ] );

	const ColorManagement = {

		enabled: true,

		_workingColorSpace: LinearSRGBColorSpace,

		get workingColorSpace() {

			return this._workingColorSpace;

		},

		set workingColorSpace( colorSpace ) {

			if ( ! SUPPORTED_WORKING_COLOR_SPACES.has( colorSpace ) ) {

				throw new Error( `Unsupported working color space, "${ colorSpace }".` );

			}

			this._workingColorSpace = colorSpace;

		},

		convert: function ( color, sourceColorSpace, targetColorSpace ) {

			if ( this.enabled === false || sourceColorSpace === targetColorSpace || ! sourceColorSpace || ! targetColorSpace ) {

				return color;

			}

			const sourceToReference = COLOR_SPACES[ sourceColorSpace ].toReference;
			const targetFromReference = COLOR_SPACES[ targetColorSpace ].fromReference;

			return targetFromReference( sourceToReference( color ) );

		},

		fromWorkingColorSpace: function ( color, targetColorSpace ) {

			return this.convert( color, this._workingColorSpace, targetColorSpace );

		},

		toWorkingColorSpace: function ( color, sourceColorSpace ) {

			return this.convert( color, sourceColorSpace, this._workingColorSpace );

		},

		getPrimaries: function ( colorSpace ) {

			return COLOR_SPACES[ colorSpace ].primaries;

		},

		getTransfer: function ( colorSpace ) {

			if ( colorSpace === NoColorSpace ) return LinearTransfer;

			return COLOR_SPACES[ colorSpace ].transfer;

		},

	};


	function SRGBToLinear( c ) {

		return ( c < 0.04045 ) ? c * 0.0773993808 : Math.pow( c * 0.9478672986 + 0.0521327014, 2.4 );

	}

	function LinearToSRGB( c ) {

		return ( c < 0.0031308 ) ? c * 12.92 : 1.055 * ( Math.pow( c, 0.41666 ) ) - 0.055;

	}

	/**
	 * Uniform Utilities
	 */

	function cloneUniforms( src ) {

		const dst = {};

		for ( const u in src ) {

			dst[ u ] = {};

			for ( const p in src[ u ] ) {

				const property = src[ u ][ p ];

				if ( property && ( property.isColor ||
					property.isMatrix3 || property.isMatrix4 ||
					property.isVector2 || property.isVector3 || property.isVector4 ||
					property.isTexture || property.isQuaternion ) ) {

					if ( property.isRenderTargetTexture ) {

						console.warn( 'UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms().' );
						dst[ u ][ p ] = null;

					} else {

						dst[ u ][ p ] = property.clone();

					}

				} else if ( Array.isArray( property ) ) {

					dst[ u ][ p ] = property.slice();

				} else {

					dst[ u ][ p ] = property;

				}

			}

		}

		return dst;

	}

	function cloneUniformsGroups( src ) {

		const dst = [];

		for ( let u = 0; u < src.length; u ++ ) {

			dst.push( src[ u ].clone() );

		}

		return dst;

	}

	const _lut = [ '00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '0a', '0b', '0c', '0d', '0e', '0f', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '1a', '1b', '1c', '1d', '1e', '1f', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '2a', '2b', '2c', '2d', '2e', '2f', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '3a', '3b', '3c', '3d', '3e', '3f', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '4a', '4b', '4c', '4d', '4e', '4f', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '5a', '5b', '5c', '5d', '5e', '5f', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '6a', '6b', '6c', '6d', '6e', '6f', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '7a', '7b', '7c', '7d', '7e', '7f', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '8a', '8b', '8c', '8d', '8e', '8f', '90', '91', '92', '93', '94', '95', '96', '97', '98', '99', '9a', '9b', '9c', '9d', '9e', '9f', 'a0', 'a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8', 'a9', 'aa', 'ab', 'ac', 'ad', 'ae', 'af', 'b0', 'b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8', 'b9', 'ba', 'bb', 'bc', 'bd', 'be', 'bf', 'c0', 'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'ca', 'cb', 'cc', 'cd', 'ce', 'cf', 'd0', 'd1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8', 'd9', 'da', 'db', 'dc', 'dd', 'de', 'df', 'e0', 'e1', 'e2', 'e3', 'e4', 'e5', 'e6', 'e7', 'e8', 'e9', 'ea', 'eb', 'ec', 'ed', 'ee', 'ef', 'f0', 'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'fa', 'fb', 'fc', 'fd', 'fe', 'ff' ];


	const DEG2RAD = Math.PI / 180;
	const RAD2DEG = 180 / Math.PI;

	// http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/21963136#21963136
	function generateUUID() {

		const d0 = Math.random() * 0xffffffff | 0;
		const d1 = Math.random() * 0xffffffff | 0;
		const d2 = Math.random() * 0xffffffff | 0;
		const d3 = Math.random() * 0xffffffff | 0;
		const uuid = _lut[ d0 & 0xff ] + _lut[ d0 >> 8 & 0xff ] + _lut[ d0 >> 16 & 0xff ] + _lut[ d0 >> 24 & 0xff ] + '-' +
				_lut[ d1 & 0xff ] + _lut[ d1 >> 8 & 0xff ] + '-' + _lut[ d1 >> 16 & 0x0f | 0x40 ] + _lut[ d1 >> 24 & 0xff ] + '-' +
				_lut[ d2 & 0x3f | 0x80 ] + _lut[ d2 >> 8 & 0xff ] + '-' + _lut[ d2 >> 16 & 0xff ] + _lut[ d2 >> 24 & 0xff ] +
				_lut[ d3 & 0xff ] + _lut[ d3 >> 8 & 0xff ] + _lut[ d3 >> 16 & 0xff ] + _lut[ d3 >> 24 & 0xff ];

		// .toLowerCase() here flattens concatenated strings to save heap memory space.
		return uuid.toLowerCase();

	}

	function clamp( value, min, max ) {

		return Math.max( min, Math.min( max, value ) );

	}

	// compute euclidean modulo of m % n
	// https://en.wikipedia.org/wiki/Modulo_operation
	function euclideanModulo( n, m ) {

		return ( ( n % m ) + m ) % m;

	}

	// https://en.wikipedia.org/wiki/Linear_interpolation
	function lerp( x, y, t ) {

		return ( 1 - t ) * x + t * y;

	}

	function denormalize( value, array ) {

		switch ( array.constructor ) {

			case Float32Array:

				return value;

			case Uint32Array:

				return value / 4294967295.0;

			case Uint16Array:

				return value / 65535.0;

			case Uint8Array:

				return value / 255.0;

			case Int32Array:

				return Math.max( value / 2147483647.0, - 1.0 );

			case Int16Array:

				return Math.max( value / 32767.0, - 1.0 );

			case Int8Array:

				return Math.max( value / 127.0, - 1.0 );

			default:

				throw new Error( 'Invalid component type.' );

		}

	}

	function normalize( value, array ) {

		switch ( array.constructor ) {

			case Float32Array:

				return value;

			case Uint32Array:

				return Math.round( value * 4294967295.0 );

			case Uint16Array:

				return Math.round( value * 65535.0 );

			case Uint8Array:

				return Math.round( value * 255.0 );

			case Int32Array:

				return Math.round( value * 2147483647.0 );

			case Int16Array:

				return Math.round( value * 32767.0 );

			case Int8Array:

				return Math.round( value * 127.0 );

			default:

				throw new Error( 'Invalid component type.' );

		}

	}

	class Quaternion {

		constructor( x = 0, y = 0, z = 0, w = 1 ) {

			this.isQuaternion = true;

			this._x = x;
			this._y = y;
			this._z = z;
			this._w = w;

		}

		static slerpFlat( dst, dstOffset, src0, srcOffset0, src1, srcOffset1, t ) {

			// fuzz-free, array-based Quaternion SLERP operation

			let x0 = src0[ srcOffset0 + 0 ],
				y0 = src0[ srcOffset0 + 1 ],
				z0 = src0[ srcOffset0 + 2 ],
				w0 = src0[ srcOffset0 + 3 ];

			const x1 = src1[ srcOffset1 + 0 ],
				y1 = src1[ srcOffset1 + 1 ],
				z1 = src1[ srcOffset1 + 2 ],
				w1 = src1[ srcOffset1 + 3 ];

			if ( t === 0 ) {

				dst[ dstOffset + 0 ] = x0;
				dst[ dstOffset + 1 ] = y0;
				dst[ dstOffset + 2 ] = z0;
				dst[ dstOffset + 3 ] = w0;
				return;

			}

			if ( t === 1 ) {

				dst[ dstOffset + 0 ] = x1;
				dst[ dstOffset + 1 ] = y1;
				dst[ dstOffset + 2 ] = z1;
				dst[ dstOffset + 3 ] = w1;
				return;

			}

			if ( w0 !== w1 || x0 !== x1 || y0 !== y1 || z0 !== z1 ) {

				let s = 1 - t;
				const cos = x0 * x1 + y0 * y1 + z0 * z1 + w0 * w1,
					dir = ( cos >= 0 ? 1 : - 1 ),
					sqrSin = 1 - cos * cos;

				// Skip the Slerp for tiny steps to avoid numeric problems:
				if ( sqrSin > Number.EPSILON ) {

					const sin = Math.sqrt( sqrSin ),
						len = Math.atan2( sin, cos * dir );

					s = Math.sin( s * len ) / sin;
					t = Math.sin( t * len ) / sin;

				}

				const tDir = t * dir;

				x0 = x0 * s + x1 * tDir;
				y0 = y0 * s + y1 * tDir;
				z0 = z0 * s + z1 * tDir;
				w0 = w0 * s + w1 * tDir;

				// Normalize in case we just did a lerp:
				if ( s === 1 - t ) {

					const f = 1 / Math.sqrt( x0 * x0 + y0 * y0 + z0 * z0 + w0 * w0 );

					x0 *= f;
					y0 *= f;
					z0 *= f;
					w0 *= f;

				}

			}

			dst[ dstOffset ] = x0;
			dst[ dstOffset + 1 ] = y0;
			dst[ dstOffset + 2 ] = z0;
			dst[ dstOffset + 3 ] = w0;

		}

		static multiplyQuaternionsFlat( dst, dstOffset, src0, srcOffset0, src1, srcOffset1 ) {

			const x0 = src0[ srcOffset0 ];
			const y0 = src0[ srcOffset0 + 1 ];
			const z0 = src0[ srcOffset0 + 2 ];
			const w0 = src0[ srcOffset0 + 3 ];

			const x1 = src1[ srcOffset1 ];
			const y1 = src1[ srcOffset1 + 1 ];
			const z1 = src1[ srcOffset1 + 2 ];
			const w1 = src1[ srcOffset1 + 3 ];

			dst[ dstOffset ] = x0 * w1 + w0 * x1 + y0 * z1 - z0 * y1;
			dst[ dstOffset + 1 ] = y0 * w1 + w0 * y1 + z0 * x1 - x0 * z1;
			dst[ dstOffset + 2 ] = z0 * w1 + w0 * z1 + x0 * y1 - y0 * x1;
			dst[ dstOffset + 3 ] = w0 * w1 - x0 * x1 - y0 * y1 - z0 * z1;

			return dst;

		}

		get x() {

			return this._x;

		}

		set x( value ) {

			this._x = value;
			this._onChangeCallback();

		}

		get y() {

			return this._y;

		}

		set y( value ) {

			this._y = value;
			this._onChangeCallback();

		}

		get z() {

			return this._z;

		}

		set z( value ) {

			this._z = value;
			this._onChangeCallback();

		}

		get w() {

			return this._w;

		}

		set w( value ) {

			this._w = value;
			this._onChangeCallback();

		}

		set( x, y, z, w ) {

			this._x = x;
			this._y = y;
			this._z = z;
			this._w = w;

			this._onChangeCallback();

			return this;

		}

		clone() {

			return new this.constructor( this._x, this._y, this._z, this._w );

		}

		copy( quaternion ) {

			this._x = quaternion.x;
			this._y = quaternion.y;
			this._z = quaternion.z;
			this._w = quaternion.w;

			this._onChangeCallback();

			return this;

		}

		setFromEuler( euler, update = true ) {

			const x = euler._x, y = euler._y, z = euler._z, order = euler._order;

			// http://www.mathworks.com/matlabcentral/fileexchange/
			// 	20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors/
			//	content/SpinCalc.m

			const cos = Math.cos;
			const sin = Math.sin;

			const c1 = cos( x / 2 );
			const c2 = cos( y / 2 );
			const c3 = cos( z / 2 );

			const s1 = sin( x / 2 );
			const s2 = sin( y / 2 );
			const s3 = sin( z / 2 );

			switch ( order ) {

				case 'XYZ':
					this._x = s1 * c2 * c3 + c1 * s2 * s3;
					this._y = c1 * s2 * c3 - s1 * c2 * s3;
					this._z = c1 * c2 * s3 + s1 * s2 * c3;
					this._w = c1 * c2 * c3 - s1 * s2 * s3;
					break;

				case 'YXZ':
					this._x = s1 * c2 * c3 + c1 * s2 * s3;
					this._y = c1 * s2 * c3 - s1 * c2 * s3;
					this._z = c1 * c2 * s3 - s1 * s2 * c3;
					this._w = c1 * c2 * c3 + s1 * s2 * s3;
					break;

				case 'ZXY':
					this._x = s1 * c2 * c3 - c1 * s2 * s3;
					this._y = c1 * s2 * c3 + s1 * c2 * s3;
					this._z = c1 * c2 * s3 + s1 * s2 * c3;
					this._w = c1 * c2 * c3 - s1 * s2 * s3;
					break;

				case 'ZYX':
					this._x = s1 * c2 * c3 - c1 * s2 * s3;
					this._y = c1 * s2 * c3 + s1 * c2 * s3;
					this._z = c1 * c2 * s3 - s1 * s2 * c3;
					this._w = c1 * c2 * c3 + s1 * s2 * s3;
					break;

				case 'YZX':
					this._x = s1 * c2 * c3 + c1 * s2 * s3;
					this._y = c1 * s2 * c3 + s1 * c2 * s3;
					this._z = c1 * c2 * s3 - s1 * s2 * c3;
					this._w = c1 * c2 * c3 - s1 * s2 * s3;
					break;

				case 'XZY':
					this._x = s1 * c2 * c3 - c1 * s2 * s3;
					this._y = c1 * s2 * c3 - s1 * c2 * s3;
					this._z = c1 * c2 * s3 + s1 * s2 * c3;
					this._w = c1 * c2 * c3 + s1 * s2 * s3;
					break;

				default:
					console.warn( 'THREE.Quaternion: .setFromEuler() encountered an unknown order: ' + order );

			}

			if ( update === true ) this._onChangeCallback();

			return this;

		}

		setFromAxisAngle( axis, angle ) {

			// http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm

			// assumes axis is normalized

			const halfAngle = angle / 2, s = Math.sin( halfAngle );

			this._x = axis.x * s;
			this._y = axis.y * s;
			this._z = axis.z * s;
			this._w = Math.cos( halfAngle );

			this._onChangeCallback();

			return this;

		}

		setFromRotationMatrix( m ) {

			// http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm

			// assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

			const te = m.elements,

				m11 = te[ 0 ], m12 = te[ 4 ], m13 = te[ 8 ],
				m21 = te[ 1 ], m22 = te[ 5 ], m23 = te[ 9 ],
				m31 = te[ 2 ], m32 = te[ 6 ], m33 = te[ 10 ],

				trace = m11 + m22 + m33;

			if ( trace > 0 ) {

				const s = 0.5 / Math.sqrt( trace + 1.0 );

				this._w = 0.25 / s;
				this._x = ( m32 - m23 ) * s;
				this._y = ( m13 - m31 ) * s;
				this._z = ( m21 - m12 ) * s;

			} else if ( m11 > m22 && m11 > m33 ) {

				const s = 2.0 * Math.sqrt( 1.0 + m11 - m22 - m33 );

				this._w = ( m32 - m23 ) / s;
				this._x = 0.25 * s;
				this._y = ( m12 + m21 ) / s;
				this._z = ( m13 + m31 ) / s;

			} else if ( m22 > m33 ) {

				const s = 2.0 * Math.sqrt( 1.0 + m22 - m11 - m33 );

				this._w = ( m13 - m31 ) / s;
				this._x = ( m12 + m21 ) / s;
				this._y = 0.25 * s;
				this._z = ( m23 + m32 ) / s;

			} else {

				const s = 2.0 * Math.sqrt( 1.0 + m33 - m11 - m22 );

				this._w = ( m21 - m12 ) / s;
				this._x = ( m13 + m31 ) / s;
				this._y = ( m23 + m32 ) / s;
				this._z = 0.25 * s;

			}

			this._onChangeCallback();

			return this;

		}

		setFromUnitVectors( vFrom, vTo ) {

			// assumes direction vectors vFrom and vTo are normalized

			let r = vFrom.dot( vTo ) + 1;

			if ( r < Number.EPSILON ) {

				// vFrom and vTo point in opposite directions

				r = 0;

				if ( Math.abs( vFrom.x ) > Math.abs( vFrom.z ) ) {

					this._x = - vFrom.y;
					this._y = vFrom.x;
					this._z = 0;
					this._w = r;

				} else {

					this._x = 0;
					this._y = - vFrom.z;
					this._z = vFrom.y;
					this._w = r;

				}

			} else {

				// crossVectors( vFrom, vTo ); // inlined to avoid cyclic dependency on Vector3

				this._x = vFrom.y * vTo.z - vFrom.z * vTo.y;
				this._y = vFrom.z * vTo.x - vFrom.x * vTo.z;
				this._z = vFrom.x * vTo.y - vFrom.y * vTo.x;
				this._w = r;

			}

			return this.normalize();

		}

		angleTo( q ) {

			return 2 * Math.acos( Math.abs( clamp( this.dot( q ), - 1, 1 ) ) );

		}

		rotateTowards( q, step ) {

			const angle = this.angleTo( q );

			if ( angle === 0 ) return this;

			const t = Math.min( 1, step / angle );

			this.slerp( q, t );

			return this;

		}

		identity() {

			return this.set( 0, 0, 0, 1 );

		}

		invert() {

			// quaternion is assumed to have unit length

			return this.conjugate();

		}

		conjugate() {

			this._x *= - 1;
			this._y *= - 1;
			this._z *= - 1;

			this._onChangeCallback();

			return this;

		}

		dot( v ) {

			return this._x * v._x + this._y * v._y + this._z * v._z + this._w * v._w;

		}

		lengthSq() {

			return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w;

		}

		length() {

			return Math.sqrt( this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w );

		}

		normalize() {

			let l = this.length();

			if ( l === 0 ) {

				this._x = 0;
				this._y = 0;
				this._z = 0;
				this._w = 1;

			} else {

				l = 1 / l;

				this._x = this._x * l;
				this._y = this._y * l;
				this._z = this._z * l;
				this._w = this._w * l;

			}

			this._onChangeCallback();

			return this;

		}

		multiply( q ) {

			return this.multiplyQuaternions( this, q );

		}

		premultiply( q ) {

			return this.multiplyQuaternions( q, this );

		}

		multiplyQuaternions( a, b ) {

			// from http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm

			const qax = a._x, qay = a._y, qaz = a._z, qaw = a._w;
			const qbx = b._x, qby = b._y, qbz = b._z, qbw = b._w;

			this._x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
			this._y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
			this._z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
			this._w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;

			this._onChangeCallback();

			return this;

		}

		slerp( qb, t ) {

			if ( t === 0 ) return this;
			if ( t === 1 ) return this.copy( qb );

			const x = this._x, y = this._y, z = this._z, w = this._w;

			// http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/

			let cosHalfTheta = w * qb._w + x * qb._x + y * qb._y + z * qb._z;

			if ( cosHalfTheta < 0 ) {

				this._w = - qb._w;
				this._x = - qb._x;
				this._y = - qb._y;
				this._z = - qb._z;

				cosHalfTheta = - cosHalfTheta;

			} else {

				this.copy( qb );

			}

			if ( cosHalfTheta >= 1.0 ) {

				this._w = w;
				this._x = x;
				this._y = y;
				this._z = z;

				return this;

			}

			const sqrSinHalfTheta = 1.0 - cosHalfTheta * cosHalfTheta;

			if ( sqrSinHalfTheta <= Number.EPSILON ) {

				const s = 1 - t;
				this._w = s * w + t * this._w;
				this._x = s * x + t * this._x;
				this._y = s * y + t * this._y;
				this._z = s * z + t * this._z;

				this.normalize(); // normalize calls _onChangeCallback()

				return this;

			}

			const sinHalfTheta = Math.sqrt( sqrSinHalfTheta );
			const halfTheta = Math.atan2( sinHalfTheta, cosHalfTheta );
			const ratioA = Math.sin( ( 1 - t ) * halfTheta ) / sinHalfTheta,
				ratioB = Math.sin( t * halfTheta ) / sinHalfTheta;

			this._w = ( w * ratioA + this._w * ratioB );
			this._x = ( x * ratioA + this._x * ratioB );
			this._y = ( y * ratioA + this._y * ratioB );
			this._z = ( z * ratioA + this._z * ratioB );

			this._onChangeCallback();

			return this;

		}

		slerpQuaternions( qa, qb, t ) {

			return this.copy( qa ).slerp( qb, t );

		}

		random() {

			// sets this quaternion to a uniform random unit quaternnion

			// Ken Shoemake
			// Uniform random rotations
			// D. Kirk, editor, Graphics Gems III, pages 124-132. Academic Press, New York, 1992.

			const theta1 = 2 * Math.PI * Math.random();
			const theta2 = 2 * Math.PI * Math.random();

			const x0 = Math.random();
			const r1 = Math.sqrt( 1 - x0 );
			const r2 = Math.sqrt( x0 );

			return this.set(
				r1 * Math.sin( theta1 ),
				r1 * Math.cos( theta1 ),
				r2 * Math.sin( theta2 ),
				r2 * Math.cos( theta2 ),
			);

		}

		equals( quaternion ) {

			return ( quaternion._x === this._x ) && ( quaternion._y === this._y ) && ( quaternion._z === this._z ) && ( quaternion._w === this._w );

		}

		fromArray( array, offset = 0 ) {

			this._x = array[ offset ];
			this._y = array[ offset + 1 ];
			this._z = array[ offset + 2 ];
			this._w = array[ offset + 3 ];

			this._onChangeCallback();

			return this;

		}

		toArray( array = [], offset = 0 ) {

			array[ offset ] = this._x;
			array[ offset + 1 ] = this._y;
			array[ offset + 2 ] = this._z;
			array[ offset + 3 ] = this._w;

			return array;

		}

		fromBufferAttribute( attribute, index ) {

			this._x = attribute.getX( index );
			this._y = attribute.getY( index );
			this._z = attribute.getZ( index );
			this._w = attribute.getW( index );

			this._onChangeCallback();

			return this;

		}

		toJSON() {

			return this.toArray();

		}

		_onChange( callback ) {

			this._onChangeCallback = callback;

			return this;

		}

		_onChangeCallback() {}

		*[ Symbol.iterator ]() {

			yield this._x;
			yield this._y;
			yield this._z;
			yield this._w;

		}

	}

	class Vector3 {

		constructor( x = 0, y = 0, z = 0 ) {

			Vector3.prototype.isVector3 = true;

			this.x = x;
			this.y = y;
			this.z = z;

		}

		set( x, y, z ) {

			if ( z === undefined ) z = this.z; // sprite.scale.set(x,y)

			this.x = x;
			this.y = y;
			this.z = z;

			return this;

		}

		setScalar( scalar ) {

			this.x = scalar;
			this.y = scalar;
			this.z = scalar;

			return this;

		}

		setX( x ) {

			this.x = x;

			return this;

		}

		setY( y ) {

			this.y = y;

			return this;

		}

		setZ( z ) {

			this.z = z;

			return this;

		}

		setComponent( index, value ) {

			switch ( index ) {

				case 0: this.x = value; break;
				case 1: this.y = value; break;
				case 2: this.z = value; break;
				default: throw new Error( 'index is out of range: ' + index );

			}

			return this;

		}

		getComponent( index ) {

			switch ( index ) {

				case 0: return this.x;
				case 1: return this.y;
				case 2: return this.z;
				default: throw new Error( 'index is out of range: ' + index );

			}

		}

		clone() {

			return new this.constructor( this.x, this.y, this.z );

		}

		copy( v ) {

			this.x = v.x;
			this.y = v.y;
			this.z = v.z;

			return this;

		}

		add( v ) {

			this.x += v.x;
			this.y += v.y;
			this.z += v.z;

			return this;

		}

		addScalar( s ) {

			this.x += s;
			this.y += s;
			this.z += s;

			return this;

		}

		addVectors( a, b ) {

			this.x = a.x + b.x;
			this.y = a.y + b.y;
			this.z = a.z + b.z;

			return this;

		}

		addScaledVector( v, s ) {

			this.x += v.x * s;
			this.y += v.y * s;
			this.z += v.z * s;

			return this;

		}

		sub( v ) {

			this.x -= v.x;
			this.y -= v.y;
			this.z -= v.z;

			return this;

		}

		subScalar( s ) {

			this.x -= s;
			this.y -= s;
			this.z -= s;

			return this;

		}

		subVectors( a, b ) {

			this.x = a.x - b.x;
			this.y = a.y - b.y;
			this.z = a.z - b.z;

			return this;

		}

		multiply( v ) {

			this.x *= v.x;
			this.y *= v.y;
			this.z *= v.z;

			return this;

		}

		multiplyScalar( scalar ) {

			this.x *= scalar;
			this.y *= scalar;
			this.z *= scalar;

			return this;

		}

		multiplyVectors( a, b ) {

			this.x = a.x * b.x;
			this.y = a.y * b.y;
			this.z = a.z * b.z;

			return this;

		}

		applyEuler( euler ) {

			return this.applyQuaternion( _quaternion$2.setFromEuler( euler ) );

		}

		applyAxisAngle( axis, angle ) {

			return this.applyQuaternion( _quaternion$2.setFromAxisAngle( axis, angle ) );

		}

		applyMatrix3( m ) {

			const x = this.x, y = this.y, z = this.z;
			const e = m.elements;

			this.x = e[ 0 ] * x + e[ 3 ] * y + e[ 6 ] * z;
			this.y = e[ 1 ] * x + e[ 4 ] * y + e[ 7 ] * z;
			this.z = e[ 2 ] * x + e[ 5 ] * y + e[ 8 ] * z;

			return this;

		}

		applyNormalMatrix( m ) {

			return this.applyMatrix3( m ).normalize();

		}

		applyMatrix4( m ) {

			const x = this.x, y = this.y, z = this.z;
			const e = m.elements;

			const w = 1 / ( e[ 3 ] * x + e[ 7 ] * y + e[ 11 ] * z + e[ 15 ] );

			this.x = ( e[ 0 ] * x + e[ 4 ] * y + e[ 8 ] * z + e[ 12 ] ) * w;
			this.y = ( e[ 1 ] * x + e[ 5 ] * y + e[ 9 ] * z + e[ 13 ] ) * w;
			this.z = ( e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z + e[ 14 ] ) * w;

			return this;

		}

		applyQuaternion( q ) {

			// quaternion q is assumed to have unit length

			const vx = this.x, vy = this.y, vz = this.z;
			const qx = q.x, qy = q.y, qz = q.z, qw = q.w;

			// t = 2 * cross( q.xyz, v );
			const tx = 2 * ( qy * vz - qz * vy );
			const ty = 2 * ( qz * vx - qx * vz );
			const tz = 2 * ( qx * vy - qy * vx );

			// v + q.w * t + cross( q.xyz, t );
			this.x = vx + qw * tx + qy * tz - qz * ty;
			this.y = vy + qw * ty + qz * tx - qx * tz;
			this.z = vz + qw * tz + qx * ty - qy * tx;

			return this;

		}

		project( camera ) {

			return this.applyMatrix4( camera.matrixWorldInverse ).applyMatrix4( camera.projectionMatrix );

		}

		unproject( camera ) {

			return this.applyMatrix4( camera.projectionMatrixInverse ).applyMatrix4( camera.matrixWorld );

		}

		transformDirection( m ) {

			// input: THREE.Matrix4 affine matrix
			// vector interpreted as a direction

			const x = this.x, y = this.y, z = this.z;
			const e = m.elements;

			this.x = e[ 0 ] * x + e[ 4 ] * y + e[ 8 ] * z;
			this.y = e[ 1 ] * x + e[ 5 ] * y + e[ 9 ] * z;
			this.z = e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z;

			return this.normalize();

		}

		divide( v ) {

			this.x /= v.x;
			this.y /= v.y;
			this.z /= v.z;

			return this;

		}

		divideScalar( scalar ) {

			return this.multiplyScalar( 1 / scalar );

		}

		min( v ) {

			this.x = Math.min( this.x, v.x );
			this.y = Math.min( this.y, v.y );
			this.z = Math.min( this.z, v.z );

			return this;

		}

		max( v ) {

			this.x = Math.max( this.x, v.x );
			this.y = Math.max( this.y, v.y );
			this.z = Math.max( this.z, v.z );

			return this;

		}

		clamp( min, max ) {

			// assumes min < max, componentwise

			this.x = Math.max( min.x, Math.min( max.x, this.x ) );
			this.y = Math.max( min.y, Math.min( max.y, this.y ) );
			this.z = Math.max( min.z, Math.min( max.z, this.z ) );

			return this;

		}

		clampScalar( minVal, maxVal ) {

			this.x = Math.max( minVal, Math.min( maxVal, this.x ) );
			this.y = Math.max( minVal, Math.min( maxVal, this.y ) );
			this.z = Math.max( minVal, Math.min( maxVal, this.z ) );

			return this;

		}

		clampLength( min, max ) {

			const length = this.length();

			return this.divideScalar( length || 1 ).multiplyScalar( Math.max( min, Math.min( max, length ) ) );

		}

		floor() {

			this.x = Math.floor( this.x );
			this.y = Math.floor( this.y );
			this.z = Math.floor( this.z );

			return this;

		}

		ceil() {

			this.x = Math.ceil( this.x );
			this.y = Math.ceil( this.y );
			this.z = Math.ceil( this.z );

			return this;

		}

		round() {

			this.x = Math.round( this.x );
			this.y = Math.round( this.y );
			this.z = Math.round( this.z );

			return this;

		}

		roundToZero() {

			this.x = Math.trunc( this.x );
			this.y = Math.trunc( this.y );
			this.z = Math.trunc( this.z );

			return this;

		}

		negate() {

			this.x = - this.x;
			this.y = - this.y;
			this.z = - this.z;

			return this;

		}

		dot( v ) {

			return this.x * v.x + this.y * v.y + this.z * v.z;

		}

		// TODO lengthSquared?

		lengthSq() {

			return this.x * this.x + this.y * this.y + this.z * this.z;

		}

		length() {

			return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z );

		}

		manhattanLength() {

			return Math.abs( this.x ) + Math.abs( this.y ) + Math.abs( this.z );

		}

		normalize() {

			return this.divideScalar( this.length() || 1 );

		}

		setLength( length ) {

			return this.normalize().multiplyScalar( length );

		}

		lerp( v, alpha ) {

			this.x += ( v.x - this.x ) * alpha;
			this.y += ( v.y - this.y ) * alpha;
			this.z += ( v.z - this.z ) * alpha;

			return this;

		}

		lerpVectors( v1, v2, alpha ) {

			this.x = v1.x + ( v2.x - v1.x ) * alpha;
			this.y = v1.y + ( v2.y - v1.y ) * alpha;
			this.z = v1.z + ( v2.z - v1.z ) * alpha;

			return this;

		}

		cross( v ) {

			return this.crossVectors( this, v );

		}

		crossVectors( a, b ) {

			const ax = a.x, ay = a.y, az = a.z;
			const bx = b.x, by = b.y, bz = b.z;

			this.x = ay * bz - az * by;
			this.y = az * bx - ax * bz;
			this.z = ax * by - ay * bx;

			return this;

		}

		projectOnVector( v ) {

			const denominator = v.lengthSq();

			if ( denominator === 0 ) return this.set( 0, 0, 0 );

			const scalar = v.dot( this ) / denominator;

			return this.copy( v ).multiplyScalar( scalar );

		}

		projectOnPlane( planeNormal ) {

			_vector$4.copy( this ).projectOnVector( planeNormal );

			return this.sub( _vector$4 );

		}

		reflect( normal ) {

			// reflect incident vector off plane orthogonal to normal
			// normal is assumed to have unit length

			return this.sub( _vector$4.copy( normal ).multiplyScalar( 2 * this.dot( normal ) ) );

		}

		angleTo( v ) {

			const denominator = Math.sqrt( this.lengthSq() * v.lengthSq() );

			if ( denominator === 0 ) return Math.PI / 2;

			const theta = this.dot( v ) / denominator;

			// clamp, to handle numerical problems

			return Math.acos( clamp( theta, - 1, 1 ) );

		}

		distanceTo( v ) {

			return Math.sqrt( this.distanceToSquared( v ) );

		}

		distanceToSquared( v ) {

			const dx = this.x - v.x, dy = this.y - v.y, dz = this.z - v.z;

			return dx * dx + dy * dy + dz * dz;

		}

		manhattanDistanceTo( v ) {

			return Math.abs( this.x - v.x ) + Math.abs( this.y - v.y ) + Math.abs( this.z - v.z );

		}

		setFromSpherical( s ) {

			return this.setFromSphericalCoords( s.radius, s.phi, s.theta );

		}

		setFromSphericalCoords( radius, phi, theta ) {

			const sinPhiRadius = Math.sin( phi ) * radius;

			this.x = sinPhiRadius * Math.sin( theta );
			this.y = Math.cos( phi ) * radius;
			this.z = sinPhiRadius * Math.cos( theta );

			return this;

		}

		setFromCylindrical( c ) {

			return this.setFromCylindricalCoords( c.radius, c.theta, c.y );

		}

		setFromCylindricalCoords( radius, theta, y ) {

			this.x = radius * Math.sin( theta );
			this.y = y;
			this.z = radius * Math.cos( theta );

			return this;

		}

		setFromMatrixPosition( m ) {

			const e = m.elements;

			this.x = e[ 12 ];
			this.y = e[ 13 ];
			this.z = e[ 14 ];

			return this;

		}

		setFromMatrixScale( m ) {

			const sx = this.setFromMatrixColumn( m, 0 ).length();
			const sy = this.setFromMatrixColumn( m, 1 ).length();
			const sz = this.setFromMatrixColumn( m, 2 ).length();

			this.x = sx;
			this.y = sy;
			this.z = sz;

			return this;

		}

		setFromMatrixColumn( m, index ) {

			return this.fromArray( m.elements, index * 4 );

		}

		setFromMatrix3Column( m, index ) {

			return this.fromArray( m.elements, index * 3 );

		}

		setFromEuler( e ) {

			this.x = e._x;
			this.y = e._y;
			this.z = e._z;

			return this;

		}

		setFromColor( c ) {

			this.x = c.r;
			this.y = c.g;
			this.z = c.b;

			return this;

		}

		equals( v ) {

			return ( ( v.x === this.x ) && ( v.y === this.y ) && ( v.z === this.z ) );

		}

		fromArray( array, offset = 0 ) {

			this.x = array[ offset ];
			this.y = array[ offset + 1 ];
			this.z = array[ offset + 2 ];

			return this;

		}

		toArray( array = [], offset = 0 ) {

			array[ offset ] = this.x;
			array[ offset + 1 ] = this.y;
			array[ offset + 2 ] = this.z;

			return array;

		}

		fromBufferAttribute( attribute, index ) {

			this.x = attribute.getX( index );
			this.y = attribute.getY( index );
			this.z = attribute.getZ( index );

			return this;

		}

		random() {

			this.x = Math.random();
			this.y = Math.random();
			this.z = Math.random();

			return this;

		}

		randomDirection() {

			// https://mathworld.wolfram.com/SpherePointPicking.html

			const theta = Math.random() * Math.PI * 2;
			const u = Math.random() * 2 - 1;
			const c = Math.sqrt( 1 - u * u );

			this.x = c * Math.cos( theta );
			this.y = u;
			this.z = c * Math.sin( theta );

			return this;

		}

		*[ Symbol.iterator ]() {

			yield this.x;
			yield this.y;
			yield this.z;

		}

	}

	const _vector$4 = /*@__PURE__*/ new Vector3();
	const _quaternion$2 = /*@__PURE__*/ new Quaternion();

	class Vector2 {

		constructor( x = 0, y = 0 ) {

			Vector2.prototype.isVector2 = true;

			this.x = x;
			this.y = y;

		}

		get width() {

			return this.x;

		}

		set width( value ) {

			this.x = value;

		}

		get height() {

			return this.y;

		}

		set height( value ) {

			this.y = value;

		}

		set( x, y ) {

			this.x = x;
			this.y = y;

			return this;

		}

		setScalar( scalar ) {

			this.x = scalar;
			this.y = scalar;

			return this;

		}

		setX( x ) {

			this.x = x;

			return this;

		}

		setY( y ) {

			this.y = y;

			return this;

		}

		setComponent( index, value ) {

			switch ( index ) {

				case 0: this.x = value; break;
				case 1: this.y = value; break;
				default: throw new Error( 'index is out of range: ' + index );

			}

			return this;

		}

		getComponent( index ) {

			switch ( index ) {

				case 0: return this.x;
				case 1: return this.y;
				default: throw new Error( 'index is out of range: ' + index );

			}

		}

		clone() {

			return new this.constructor( this.x, this.y );

		}

		copy( v ) {

			this.x = v.x;
			this.y = v.y;

			return this;

		}

		add( v ) {

			this.x += v.x;
			this.y += v.y;

			return this;

		}

		addScalar( s ) {

			this.x += s;
			this.y += s;

			return this;

		}

		addVectors( a, b ) {

			this.x = a.x + b.x;
			this.y = a.y + b.y;

			return this;

		}

		addScaledVector( v, s ) {

			this.x += v.x * s;
			this.y += v.y * s;

			return this;

		}

		sub( v ) {

			this.x -= v.x;
			this.y -= v.y;

			return this;

		}

		subScalar( s ) {

			this.x -= s;
			this.y -= s;

			return this;

		}

		subVectors( a, b ) {

			this.x = a.x - b.x;
			this.y = a.y - b.y;

			return this;

		}

		multiply( v ) {

			this.x *= v.x;
			this.y *= v.y;

			return this;

		}

		multiplyScalar( scalar ) {

			this.x *= scalar;
			this.y *= scalar;

			return this;

		}

		divide( v ) {

			this.x /= v.x;
			this.y /= v.y;

			return this;

		}

		divideScalar( scalar ) {

			return this.multiplyScalar( 1 / scalar );

		}

		applyMatrix3( m ) {

			const x = this.x, y = this.y;
			const e = m.elements;

			this.x = e[ 0 ] * x + e[ 3 ] * y + e[ 6 ];
			this.y = e[ 1 ] * x + e[ 4 ] * y + e[ 7 ];

			return this;

		}

		min( v ) {

			this.x = Math.min( this.x, v.x );
			this.y = Math.min( this.y, v.y );

			return this;

		}

		max( v ) {

			this.x = Math.max( this.x, v.x );
			this.y = Math.max( this.y, v.y );

			return this;

		}

		clamp( min, max ) {

			// assumes min < max, componentwise

			this.x = Math.max( min.x, Math.min( max.x, this.x ) );
			this.y = Math.max( min.y, Math.min( max.y, this.y ) );

			return this;

		}

		clampScalar( minVal, maxVal ) {

			this.x = Math.max( minVal, Math.min( maxVal, this.x ) );
			this.y = Math.max( minVal, Math.min( maxVal, this.y ) );

			return this;

		}

		clampLength( min, max ) {

			const length = this.length();

			return this.divideScalar( length || 1 ).multiplyScalar( Math.max( min, Math.min( max, length ) ) );

		}

		floor() {

			this.x = Math.floor( this.x );
			this.y = Math.floor( this.y );

			return this;

		}

		ceil() {

			this.x = Math.ceil( this.x );
			this.y = Math.ceil( this.y );

			return this;

		}

		round() {

			this.x = Math.round( this.x );
			this.y = Math.round( this.y );

			return this;

		}

		roundToZero() {

			this.x = Math.trunc( this.x );
			this.y = Math.trunc( this.y );

			return this;

		}

		negate() {

			this.x = - this.x;
			this.y = - this.y;

			return this;

		}

		dot( v ) {

			return this.x * v.x + this.y * v.y;

		}

		cross( v ) {

			return this.x * v.y - this.y * v.x;

		}

		lengthSq() {

			return this.x * this.x + this.y * this.y;

		}

		length() {

			return Math.sqrt( this.x * this.x + this.y * this.y );

		}

		manhattanLength() {

			return Math.abs( this.x ) + Math.abs( this.y );

		}

		normalize() {

			return this.divideScalar( this.length() || 1 );

		}

		angle() {

			// computes the angle in radians with respect to the positive x-axis

			const angle = Math.atan2( - this.y, - this.x ) + Math.PI;

			return angle;

		}

		angleTo( v ) {

			const denominator = Math.sqrt( this.lengthSq() * v.lengthSq() );

			if ( denominator === 0 ) return Math.PI / 2;

			const theta = this.dot( v ) / denominator;

			// clamp, to handle numerical problems

			return Math.acos( clamp( theta, - 1, 1 ) );

		}

		distanceTo( v ) {

			return Math.sqrt( this.distanceToSquared( v ) );

		}

		distanceToSquared( v ) {

			const dx = this.x - v.x, dy = this.y - v.y;
			return dx * dx + dy * dy;

		}

		manhattanDistanceTo( v ) {

			return Math.abs( this.x - v.x ) + Math.abs( this.y - v.y );

		}

		setLength( length ) {

			return this.normalize().multiplyScalar( length );

		}

		lerp( v, alpha ) {

			this.x += ( v.x - this.x ) * alpha;
			this.y += ( v.y - this.y ) * alpha;

			return this;

		}

		lerpVectors( v1, v2, alpha ) {

			this.x = v1.x + ( v2.x - v1.x ) * alpha;
			this.y = v1.y + ( v2.y - v1.y ) * alpha;

			return this;

		}

		equals( v ) {

			return ( ( v.x === this.x ) && ( v.y === this.y ) );

		}

		fromArray( array, offset = 0 ) {

			this.x = array[ offset ];
			this.y = array[ offset + 1 ];

			return this;

		}

		toArray( array = [], offset = 0 ) {

			array[ offset ] = this.x;
			array[ offset + 1 ] = this.y;

			return array;

		}

		fromBufferAttribute( attribute, index ) {

			this.x = attribute.getX( index );
			this.y = attribute.getY( index );

			return this;

		}

		rotateAround( center, angle ) {

			const c = Math.cos( angle ), s = Math.sin( angle );

			const x = this.x - center.x;
			const y = this.y - center.y;

			this.x = x * c - y * s + center.x;
			this.y = x * s + y * c + center.y;

			return this;

		}

		random() {

			this.x = Math.random();
			this.y = Math.random();

			return this;

		}

		*[ Symbol.iterator ]() {

			yield this.x;
			yield this.y;

		}

	}

	class Box3 {

		constructor( min = new Vector3( + Infinity, + Infinity, + Infinity ), max = new Vector3( - Infinity, - Infinity, - Infinity ) ) {

			this.isBox3 = true;

			this.min = min;
			this.max = max;

		}

		set( min, max ) {

			this.min.copy( min );
			this.max.copy( max );

			return this;

		}

		setFromArray( array ) {

			this.makeEmpty();

			for ( let i = 0, il = array.length; i < il; i += 3 ) {

				this.expandByPoint( _vector$3.fromArray( array, i ) );

			}

			return this;

		}

		setFromBufferAttribute( attribute ) {

			this.makeEmpty();

			for ( let i = 0, il = attribute.count; i < il; i ++ ) {

				this.expandByPoint( _vector$3.fromBufferAttribute( attribute, i ) );

			}

			return this;

		}

		setFromPoints( points ) {

			this.makeEmpty();

			for ( let i = 0, il = points.length; i < il; i ++ ) {

				this.expandByPoint( points[ i ] );

			}

			return this;

		}

		setFromCenterAndSize( center, size ) {

			const halfSize = _vector$3.copy( size ).multiplyScalar( 0.5 );

			this.min.copy( center ).sub( halfSize );
			this.max.copy( center ).add( halfSize );

			return this;

		}

		setFromObject( object, precise = false ) {

			this.makeEmpty();

			return this.expandByObject( object, precise );

		}

		clone() {

			return new this.constructor().copy( this );

		}

		copy( box ) {

			this.min.copy( box.min );
			this.max.copy( box.max );

			return this;

		}

		makeEmpty() {

			this.min.x = this.min.y = this.min.z = + Infinity;
			this.max.x = this.max.y = this.max.z = - Infinity;

			return this;

		}

		isEmpty() {

			// this is a more robust check for empty than ( volume <= 0 ) because volume can get positive with two negative axes

			return ( this.max.x < this.min.x ) || ( this.max.y < this.min.y ) || ( this.max.z < this.min.z );

		}

		getCenter( target ) {

			return this.isEmpty() ? target.set( 0, 0, 0 ) : target.addVectors( this.min, this.max ).multiplyScalar( 0.5 );

		}

		getSize( target ) {

			return this.isEmpty() ? target.set( 0, 0, 0 ) : target.subVectors( this.max, this.min );

		}

		expandByPoint( point ) {

			this.min.min( point );
			this.max.max( point );

			return this;

		}

		expandByVector( vector ) {

			this.min.sub( vector );
			this.max.add( vector );

			return this;

		}

		expandByScalar( scalar ) {

			this.min.addScalar( - scalar );
			this.max.addScalar( scalar );

			return this;

		}

		expandByObject( object, precise = false ) {

			// Computes the world-axis-aligned bounding box of an object (including its children),
			// accounting for both the object's, and children's, world transforms

			object.updateWorldMatrix( false, false );

			const geometry = object.geometry;

			if ( geometry !== undefined ) {

				const positionAttribute = geometry.getAttribute( 'position' );

				// precise AABB computation based on vertex data requires at least a position attribute.
				// instancing isn't supported so far and uses the normal (conservative) code path.

				if ( precise === true && positionAttribute !== undefined && object.isInstancedMesh !== true ) {

					for ( let i = 0, l = positionAttribute.count; i < l; i ++ ) {

						if ( object.isMesh === true ) {

							object.getVertexPosition( i, _vector$3 );

						} else {

							_vector$3.fromBufferAttribute( positionAttribute, i );

						}

						_vector$3.applyMatrix4( object.matrixWorld );
						this.expandByPoint( _vector$3 );

					}

				} else {

					if ( object.boundingBox !== undefined ) {

						// object-level bounding box

						if ( object.boundingBox === null ) {

							object.computeBoundingBox();

						}

						_box$2.copy( object.boundingBox );


					} else {

						// geometry-level bounding box

						if ( geometry.boundingBox === null ) {

							geometry.computeBoundingBox();

						}

						_box$2.copy( geometry.boundingBox );

					}

					_box$2.applyMatrix4( object.matrixWorld );

					this.union( _box$2 );

				}

			}

			const children = object.children;

			for ( let i = 0, l = children.length; i < l; i ++ ) {

				this.expandByObject( children[ i ], precise );

			}

			return this;

		}

		containsPoint( point ) {

			return point.x < this.min.x || point.x > this.max.x ||
				point.y < this.min.y || point.y > this.max.y ||
				point.z < this.min.z || point.z > this.max.z ? false : true;

		}

		containsBox( box ) {

			return this.min.x <= box.min.x && box.max.x <= this.max.x &&
				this.min.y <= box.min.y && box.max.y <= this.max.y &&
				this.min.z <= box.min.z && box.max.z <= this.max.z;

		}

		getParameter( point, target ) {

			// This can potentially have a divide by zero if the box
			// has a size dimension of 0.

			return target.set(
				( point.x - this.min.x ) / ( this.max.x - this.min.x ),
				( point.y - this.min.y ) / ( this.max.y - this.min.y ),
				( point.z - this.min.z ) / ( this.max.z - this.min.z )
			);

		}

		intersectsBox( box ) {

			// using 6 splitting planes to rule out intersections.
			return box.max.x < this.min.x || box.min.x > this.max.x ||
				box.max.y < this.min.y || box.min.y > this.max.y ||
				box.max.z < this.min.z || box.min.z > this.max.z ? false : true;

		}

		intersectsSphere( sphere ) {

			// Find the point on the AABB closest to the sphere center.
			this.clampPoint( sphere.center, _vector$3 );

			// If that point is inside the sphere, the AABB and sphere intersect.
			return _vector$3.distanceToSquared( sphere.center ) <= ( sphere.radius * sphere.radius );

		}

		intersectsPlane( plane ) {

			// We compute the minimum and maximum dot product values. If those values
			// are on the same side (back or front) of the plane, then there is no intersection.

			let min, max;

			if ( plane.normal.x > 0 ) {

				min = plane.normal.x * this.min.x;
				max = plane.normal.x * this.max.x;

			} else {

				min = plane.normal.x * this.max.x;
				max = plane.normal.x * this.min.x;

			}

			if ( plane.normal.y > 0 ) {

				min += plane.normal.y * this.min.y;
				max += plane.normal.y * this.max.y;

			} else {

				min += plane.normal.y * this.max.y;
				max += plane.normal.y * this.min.y;

			}

			if ( plane.normal.z > 0 ) {

				min += plane.normal.z * this.min.z;
				max += plane.normal.z * this.max.z;

			} else {

				min += plane.normal.z * this.max.z;
				max += plane.normal.z * this.min.z;

			}

			return ( min <= - plane.constant && max >= - plane.constant );

		}

		intersectsTriangle( triangle ) {

			if ( this.isEmpty() ) {

				return false;

			}

			// compute box center and extents
			this.getCenter( _center );
			_extents.subVectors( this.max, _center );

			// translate triangle to aabb origin
			_v0$1.subVectors( triangle.a, _center );
			_v1$4.subVectors( triangle.b, _center );
			_v2$2.subVectors( triangle.c, _center );

			// compute edge vectors for triangle
			_f0.subVectors( _v1$4, _v0$1 );
			_f1.subVectors( _v2$2, _v1$4 );
			_f2.subVectors( _v0$1, _v2$2 );

			// test against axes that are given by cross product combinations of the edges of the triangle and the edges of the aabb
			// make an axis testing of each of the 3 sides of the aabb against each of the 3 sides of the triangle = 9 axis of separation
			// axis_ij = u_i x f_j (u0, u1, u2 = face normals of aabb = x,y,z axes vectors since aabb is axis aligned)
			let axes = [
				0, - _f0.z, _f0.y, 0, - _f1.z, _f1.y, 0, - _f2.z, _f2.y,
				_f0.z, 0, - _f0.x, _f1.z, 0, - _f1.x, _f2.z, 0, - _f2.x,
				- _f0.y, _f0.x, 0, - _f1.y, _f1.x, 0, - _f2.y, _f2.x, 0
			];
			if ( ! satForAxes( axes, _v0$1, _v1$4, _v2$2, _extents ) ) {

				return false;

			}

			// test 3 face normals from the aabb
			axes = [ 1, 0, 0, 0, 1, 0, 0, 0, 1 ];
			if ( ! satForAxes( axes, _v0$1, _v1$4, _v2$2, _extents ) ) {

				return false;

			}

			// finally testing the face normal of the triangle
			// use already existing triangle edge vectors here
			_triangleNormal.crossVectors( _f0, _f1 );
			axes = [ _triangleNormal.x, _triangleNormal.y, _triangleNormal.z ];

			return satForAxes( axes, _v0$1, _v1$4, _v2$2, _extents );

		}

		clampPoint( point, target ) {

			return target.copy( point ).clamp( this.min, this.max );

		}

		distanceToPoint( point ) {

			return this.clampPoint( point, _vector$3 ).distanceTo( point );

		}

		getBoundingSphere( target ) {

			if ( this.isEmpty() ) {

				target.makeEmpty();

			} else {

				this.getCenter( target.center );

				target.radius = this.getSize( _vector$3 ).length() * 0.5;

			}

			return target;

		}

		intersect( box ) {

			this.min.max( box.min );
			this.max.min( box.max );

			// ensure that if there is no overlap, the result is fully empty, not slightly empty with non-inf/+inf values that will cause subsequence intersects to erroneously return valid values.
			if ( this.isEmpty() ) this.makeEmpty();

			return this;

		}

		union( box ) {

			this.min.min( box.min );
			this.max.max( box.max );

			return this;

		}

		applyMatrix4( matrix ) {

			// transform of empty box is an empty box.
			if ( this.isEmpty() ) return this;

			// NOTE: I am using a binary pattern to specify all 2^3 combinations below
			_points[ 0 ].set( this.min.x, this.min.y, this.min.z ).applyMatrix4( matrix ); // 000
			_points[ 1 ].set( this.min.x, this.min.y, this.max.z ).applyMatrix4( matrix ); // 001
			_points[ 2 ].set( this.min.x, this.max.y, this.min.z ).applyMatrix4( matrix ); // 010
			_points[ 3 ].set( this.min.x, this.max.y, this.max.z ).applyMatrix4( matrix ); // 011
			_points[ 4 ].set( this.max.x, this.min.y, this.min.z ).applyMatrix4( matrix ); // 100
			_points[ 5 ].set( this.max.x, this.min.y, this.max.z ).applyMatrix4( matrix ); // 101
			_points[ 6 ].set( this.max.x, this.max.y, this.min.z ).applyMatrix4( matrix ); // 110
			_points[ 7 ].set( this.max.x, this.max.y, this.max.z ).applyMatrix4( matrix ); // 111

			this.setFromPoints( _points );

			return this;

		}

		translate( offset ) {

			this.min.add( offset );
			this.max.add( offset );

			return this;

		}

		equals( box ) {

			return box.min.equals( this.min ) && box.max.equals( this.max );

		}

	}

	const _points = [
		/*@__PURE__*/ new Vector3(),
		/*@__PURE__*/ new Vector3(),
		/*@__PURE__*/ new Vector3(),
		/*@__PURE__*/ new Vector3(),
		/*@__PURE__*/ new Vector3(),
		/*@__PURE__*/ new Vector3(),
		/*@__PURE__*/ new Vector3(),
		/*@__PURE__*/ new Vector3()
	];

	const _vector$3 = /*@__PURE__*/ new Vector3();

	const _box$2 = /*@__PURE__*/ new Box3();

	// triangle centered vertices

	const _v0$1 = /*@__PURE__*/ new Vector3();
	const _v1$4 = /*@__PURE__*/ new Vector3();
	const _v2$2 = /*@__PURE__*/ new Vector3();

	// triangle edge vectors

	const _f0 = /*@__PURE__*/ new Vector3();
	const _f1 = /*@__PURE__*/ new Vector3();
	const _f2 = /*@__PURE__*/ new Vector3();

	const _center = /*@__PURE__*/ new Vector3();
	const _extents = /*@__PURE__*/ new Vector3();
	const _triangleNormal = /*@__PURE__*/ new Vector3();
	const _testAxis = /*@__PURE__*/ new Vector3();

	function satForAxes( axes, v0, v1, v2, extents ) {

		for ( let i = 0, j = axes.length - 3; i <= j; i += 3 ) {

			_testAxis.fromArray( axes, i );
			// project the aabb onto the separating axis
			const r = extents.x * Math.abs( _testAxis.x ) + extents.y * Math.abs( _testAxis.y ) + extents.z * Math.abs( _testAxis.z );
			// project all 3 vertices of the triangle onto the separating axis
			const p0 = v0.dot( _testAxis );
			const p1 = v1.dot( _testAxis );
			const p2 = v2.dot( _testAxis );
			// actual test, basically see if either of the most extreme of the triangle points intersects r
			if ( Math.max( - Math.max( p0, p1, p2 ), Math.min( p0, p1, p2 ) ) > r ) {

				// points of the projected triangle are outside the projected half-length of the aabb
				// the axis is separating and we can exit
				return false;

			}

		}

		return true;

	}

	const _box$1 = /*@__PURE__*/ new Box3();
	const _v1$3 = /*@__PURE__*/ new Vector3();
	const _v2$1 = /*@__PURE__*/ new Vector3();

	class Sphere {

		constructor( center = new Vector3(), radius = - 1 ) {

			this.isSphere = true;

			this.center = center;
			this.radius = radius;

		}

		set( center, radius ) {

			this.center.copy( center );
			this.radius = radius;

			return this;

		}

		setFromPoints( points, optionalCenter ) {

			const center = this.center;

			if ( optionalCenter !== undefined ) {

				center.copy( optionalCenter );

			} else {

				_box$1.setFromPoints( points ).getCenter( center );

			}

			let maxRadiusSq = 0;

			for ( let i = 0, il = points.length; i < il; i ++ ) {

				maxRadiusSq = Math.max( maxRadiusSq, center.distanceToSquared( points[ i ] ) );

			}

			this.radius = Math.sqrt( maxRadiusSq );

			return this;

		}

		copy( sphere ) {

			this.center.copy( sphere.center );
			this.radius = sphere.radius;

			return this;

		}

		isEmpty() {

			return ( this.radius < 0 );

		}

		makeEmpty() {

			this.center.set( 0, 0, 0 );
			this.radius = - 1;

			return this;

		}

		containsPoint( point ) {

			return ( point.distanceToSquared( this.center ) <= ( this.radius * this.radius ) );

		}

		distanceToPoint( point ) {

			return ( point.distanceTo( this.center ) - this.radius );

		}

		intersectsSphere( sphere ) {

			const radiusSum = this.radius + sphere.radius;

			return sphere.center.distanceToSquared( this.center ) <= ( radiusSum * radiusSum );

		}

		intersectsBox( box ) {

			return box.intersectsSphere( this );

		}

		intersectsPlane( plane ) {

			return Math.abs( plane.distanceToPoint( this.center ) ) <= this.radius;

		}

		clampPoint( point, target ) {

			const deltaLengthSq = this.center.distanceToSquared( point );

			target.copy( point );

			if ( deltaLengthSq > ( this.radius * this.radius ) ) {

				target.sub( this.center ).normalize();
				target.multiplyScalar( this.radius ).add( this.center );

			}

			return target;

		}

		getBoundingBox( target ) {

			if ( this.isEmpty() ) {

				// Empty sphere produces empty bounding box
				target.makeEmpty();
				return target;

			}

			target.set( this.center, this.center );
			target.expandByScalar( this.radius );

			return target;

		}

		applyMatrix4( matrix ) {

			this.center.applyMatrix4( matrix );
			this.radius = this.radius * matrix.getMaxScaleOnAxis();

			return this;

		}

		translate( offset ) {

			this.center.add( offset );

			return this;

		}

		expandByPoint( point ) {

			if ( this.isEmpty() ) {

				this.center.copy( point );

				this.radius = 0;

				return this;

			}

			_v1$3.subVectors( point, this.center );

			const lengthSq = _v1$3.lengthSq();

			if ( lengthSq > ( this.radius * this.radius ) ) {

				// calculate the minimal sphere

				const length = Math.sqrt( lengthSq );

				const delta = ( length - this.radius ) * 0.5;

				this.center.addScaledVector( _v1$3, delta / length );

				this.radius += delta;

			}

			return this;

		}

		union( sphere ) {

			if ( sphere.isEmpty() ) {

				return this;

			}

			if ( this.isEmpty() ) {

				this.copy( sphere );

				return this;

			}

			if ( this.center.equals( sphere.center ) === true ) {

				 this.radius = Math.max( this.radius, sphere.radius );

			} else {

				_v2$1.subVectors( sphere.center, this.center ).setLength( sphere.radius );

				this.expandByPoint( _v1$3.copy( sphere.center ).add( _v2$1 ) );

				this.expandByPoint( _v1$3.copy( sphere.center ).sub( _v2$1 ) );

			}

			return this;

		}

		equals( sphere ) {

			return sphere.center.equals( this.center ) && ( sphere.radius === this.radius );

		}

		clone() {

			return new this.constructor().copy( this );

		}

	}

	const _vector$2 = /*@__PURE__*/ new Vector3();
	const _segCenter = /*@__PURE__*/ new Vector3();
	const _segDir = /*@__PURE__*/ new Vector3();
	const _diff = /*@__PURE__*/ new Vector3();

	const _edge1 = /*@__PURE__*/ new Vector3();
	const _edge2 = /*@__PURE__*/ new Vector3();
	const _normal = /*@__PURE__*/ new Vector3();

	class Ray {

		constructor( origin = new Vector3(), direction = new Vector3( 0, 0, - 1 ) ) {

			this.origin = origin;
			this.direction = direction;

		}

		set( origin, direction ) {

			this.origin.copy( origin );
			this.direction.copy( direction );

			return this;

		}

		copy( ray ) {

			this.origin.copy( ray.origin );
			this.direction.copy( ray.direction );

			return this;

		}

		at( t, target ) {

			return target.copy( this.origin ).addScaledVector( this.direction, t );

		}

		lookAt( v ) {

			this.direction.copy( v ).sub( this.origin ).normalize();

			return this;

		}

		recast( t ) {

			this.origin.copy( this.at( t, _vector$2 ) );

			return this;

		}

		closestPointToPoint( point, target ) {

			target.subVectors( point, this.origin );

			const directionDistance = target.dot( this.direction );

			if ( directionDistance < 0 ) {

				return target.copy( this.origin );

			}

			return target.copy( this.origin ).addScaledVector( this.direction, directionDistance );

		}

		distanceToPoint( point ) {

			return Math.sqrt( this.distanceSqToPoint( point ) );

		}

		distanceSqToPoint( point ) {

			const directionDistance = _vector$2.subVectors( point, this.origin ).dot( this.direction );

			// point behind the ray

			if ( directionDistance < 0 ) {

				return this.origin.distanceToSquared( point );

			}

			_vector$2.copy( this.origin ).addScaledVector( this.direction, directionDistance );

			return _vector$2.distanceToSquared( point );

		}

		distanceSqToSegment( v0, v1, optionalPointOnRay, optionalPointOnSegment ) {

			// from https://github.com/pmjoniak/GeometricTools/blob/master/GTEngine/Include/Mathematics/GteDistRaySegment.h
			// It returns the min distance between the ray and the segment
			// defined by v0 and v1
			// It can also set two optional targets :
			// - The closest point on the ray
			// - The closest point on the segment

			_segCenter.copy( v0 ).add( v1 ).multiplyScalar( 0.5 );
			_segDir.copy( v1 ).sub( v0 ).normalize();
			_diff.copy( this.origin ).sub( _segCenter );

			const segExtent = v0.distanceTo( v1 ) * 0.5;
			const a01 = - this.direction.dot( _segDir );
			const b0 = _diff.dot( this.direction );
			const b1 = - _diff.dot( _segDir );
			const c = _diff.lengthSq();
			const det = Math.abs( 1 - a01 * a01 );
			let s0, s1, sqrDist, extDet;

			if ( det > 0 ) {

				// The ray and segment are not parallel.

				s0 = a01 * b1 - b0;
				s1 = a01 * b0 - b1;
				extDet = segExtent * det;

				if ( s0 >= 0 ) {

					if ( s1 >= - extDet ) {

						if ( s1 <= extDet ) {

							// region 0
							// Minimum at interior points of ray and segment.

							const invDet = 1 / det;
							s0 *= invDet;
							s1 *= invDet;
							sqrDist = s0 * ( s0 + a01 * s1 + 2 * b0 ) + s1 * ( a01 * s0 + s1 + 2 * b1 ) + c;

						} else {

							// region 1

							s1 = segExtent;
							s0 = Math.max( 0, - ( a01 * s1 + b0 ) );
							sqrDist = - s0 * s0 + s1 * ( s1 + 2 * b1 ) + c;

						}

					} else {

						// region 5

						s1 = - segExtent;
						s0 = Math.max( 0, - ( a01 * s1 + b0 ) );
						sqrDist = - s0 * s0 + s1 * ( s1 + 2 * b1 ) + c;

					}

				} else {

					if ( s1 <= - extDet ) {

						// region 4

						s0 = Math.max( 0, - ( - a01 * segExtent + b0 ) );
						s1 = ( s0 > 0 ) ? - segExtent : Math.min( Math.max( - segExtent, - b1 ), segExtent );
						sqrDist = - s0 * s0 + s1 * ( s1 + 2 * b1 ) + c;

					} else if ( s1 <= extDet ) {

						// region 3

						s0 = 0;
						s1 = Math.min( Math.max( - segExtent, - b1 ), segExtent );
						sqrDist = s1 * ( s1 + 2 * b1 ) + c;

					} else {

						// region 2

						s0 = Math.max( 0, - ( a01 * segExtent + b0 ) );
						s1 = ( s0 > 0 ) ? segExtent : Math.min( Math.max( - segExtent, - b1 ), segExtent );
						sqrDist = - s0 * s0 + s1 * ( s1 + 2 * b1 ) + c;

					}

				}

			} else {

				// Ray and segment are parallel.

				s1 = ( a01 > 0 ) ? - segExtent : segExtent;
				s0 = Math.max( 0, - ( a01 * s1 + b0 ) );
				sqrDist = - s0 * s0 + s1 * ( s1 + 2 * b1 ) + c;

			}

			if ( optionalPointOnRay ) {

				optionalPointOnRay.copy( this.origin ).addScaledVector( this.direction, s0 );

			}

			if ( optionalPointOnSegment ) {

				optionalPointOnSegment.copy( _segCenter ).addScaledVector( _segDir, s1 );

			}

			return sqrDist;

		}

		intersectSphere( sphere, target ) {

			_vector$2.subVectors( sphere.center, this.origin );
			const tca = _vector$2.dot( this.direction );
			const d2 = _vector$2.dot( _vector$2 ) - tca * tca;
			const radius2 = sphere.radius * sphere.radius;

			if ( d2 > radius2 ) return null;

			const thc = Math.sqrt( radius2 - d2 );

			// t0 = first intersect point - entrance on front of sphere
			const t0 = tca - thc;

			// t1 = second intersect point - exit point on back of sphere
			const t1 = tca + thc;

			// test to see if t1 is behind the ray - if so, return null
			if ( t1 < 0 ) return null;

			// test to see if t0 is behind the ray:
			// if it is, the ray is inside the sphere, so return the second exit point scaled by t1,
			// in order to always return an intersect point that is in front of the ray.
			if ( t0 < 0 ) return this.at( t1, target );

			// else t0 is in front of the ray, so return the first collision point scaled by t0
			return this.at( t0, target );

		}

		intersectsSphere( sphere ) {

			return this.distanceSqToPoint( sphere.center ) <= ( sphere.radius * sphere.radius );

		}

		distanceToPlane( plane ) {

			const denominator = plane.normal.dot( this.direction );

			if ( denominator === 0 ) {

				// line is coplanar, return origin
				if ( plane.distanceToPoint( this.origin ) === 0 ) {

					return 0;

				}

				// Null is preferable to undefined since undefined means.... it is undefined

				return null;

			}

			const t = - ( this.origin.dot( plane.normal ) + plane.constant ) / denominator;

			// Return if the ray never intersects the plane

			return t >= 0 ? t : null;

		}

		intersectPlane( plane, target ) {

			const t = this.distanceToPlane( plane );

			if ( t === null ) {

				return null;

			}

			return this.at( t, target );

		}

		intersectsPlane( plane ) {

			// check if the ray lies on the plane first

			const distToPoint = plane.distanceToPoint( this.origin );

			if ( distToPoint === 0 ) {

				return true;

			}

			const denominator = plane.normal.dot( this.direction );

			if ( denominator * distToPoint < 0 ) {

				return true;

			}

			// ray origin is behind the plane (and is pointing behind it)

			return false;

		}

		intersectBox( box, target ) {

			let tmin, tmax, tymin, tymax, tzmin, tzmax;

			const invdirx = 1 / this.direction.x,
				invdiry = 1 / this.direction.y,
				invdirz = 1 / this.direction.z;

			const origin = this.origin;

			if ( invdirx >= 0 ) {

				tmin = ( box.min.x - origin.x ) * invdirx;
				tmax = ( box.max.x - origin.x ) * invdirx;

			} else {

				tmin = ( box.max.x - origin.x ) * invdirx;
				tmax = ( box.min.x - origin.x ) * invdirx;

			}

			if ( invdiry >= 0 ) {

				tymin = ( box.min.y - origin.y ) * invdiry;
				tymax = ( box.max.y - origin.y ) * invdiry;

			} else {

				tymin = ( box.max.y - origin.y ) * invdiry;
				tymax = ( box.min.y - origin.y ) * invdiry;

			}

			if ( ( tmin > tymax ) || ( tymin > tmax ) ) return null;

			if ( tymin > tmin || isNaN( tmin ) ) tmin = tymin;

			if ( tymax < tmax || isNaN( tmax ) ) tmax = tymax;

			if ( invdirz >= 0 ) {

				tzmin = ( box.min.z - origin.z ) * invdirz;
				tzmax = ( box.max.z - origin.z ) * invdirz;

			} else {

				tzmin = ( box.max.z - origin.z ) * invdirz;
				tzmax = ( box.min.z - origin.z ) * invdirz;

			}

			if ( ( tmin > tzmax ) || ( tzmin > tmax ) ) return null;

			if ( tzmin > tmin || tmin !== tmin ) tmin = tzmin;

			if ( tzmax < tmax || tmax !== tmax ) tmax = tzmax;

			//return point closest to the ray (positive side)

			if ( tmax < 0 ) return null;

			return this.at( tmin >= 0 ? tmin : tmax, target );

		}

		intersectsBox( box ) {

			return this.intersectBox( box, _vector$2 ) !== null;

		}

		intersectTriangle( a, b, c, backfaceCulling, target ) {

			// Compute the offset origin, edges, and normal.

			// from https://github.com/pmjoniak/GeometricTools/blob/master/GTEngine/Include/Mathematics/GteIntrRay3Triangle3.h

			_edge1.subVectors( b, a );
			_edge2.subVectors( c, a );
			_normal.crossVectors( _edge1, _edge2 );

			// Solve Q + t*D = b1*E1 + b2*E2 (Q = kDiff, D = ray direction,
			// E1 = kEdge1, E2 = kEdge2, N = Cross(E1,E2)) by
			//   |Dot(D,N)|*b1 = sign(Dot(D,N))*Dot(D,Cross(Q,E2))
			//   |Dot(D,N)|*b2 = sign(Dot(D,N))*Dot(D,Cross(E1,Q))
			//   |Dot(D,N)|*t = -sign(Dot(D,N))*Dot(Q,N)
			let DdN = this.direction.dot( _normal );
			let sign;

			if ( DdN > 0 ) {

				if ( backfaceCulling ) return null;
				sign = 1;

			} else if ( DdN < 0 ) {

				sign = - 1;
				DdN = - DdN;

			} else {

				return null;

			}

			_diff.subVectors( this.origin, a );
			const DdQxE2 = sign * this.direction.dot( _edge2.crossVectors( _diff, _edge2 ) );

			// b1 < 0, no intersection
			if ( DdQxE2 < 0 ) {

				return null;

			}

			const DdE1xQ = sign * this.direction.dot( _edge1.cross( _diff ) );

			// b2 < 0, no intersection
			if ( DdE1xQ < 0 ) {

				return null;

			}

			// b1+b2 > 1, no intersection
			if ( DdQxE2 + DdE1xQ > DdN ) {

				return null;

			}

			// Line intersects triangle, check if ray does.
			const QdN = - sign * _diff.dot( _normal );

			// t < 0, no intersection
			if ( QdN < 0 ) {

				return null;

			}

			// Ray intersects triangle.
			return this.at( QdN / DdN, target );

		}

		applyMatrix4( matrix4 ) {

			this.origin.applyMatrix4( matrix4 );
			this.direction.transformDirection( matrix4 );

			return this;

		}

		equals( ray ) {

			return ray.origin.equals( this.origin ) && ray.direction.equals( this.direction );

		}

		clone() {

			return new this.constructor().copy( this );

		}

	}

	class Matrix4 {

		constructor( n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44 ) {

			Matrix4.prototype.isMatrix4 = true;

			this.elements = [

				1, 0, 0, 0,
				0, 1, 0, 0,
				0, 0, 1, 0,
				0, 0, 0, 1

			];

			if ( n11 !== undefined ) {

				this.set( n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44 );

			}

		}

		set( n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44 ) {

			const te = this.elements;

			te[ 0 ] = n11; te[ 4 ] = n12; te[ 8 ] = n13; te[ 12 ] = n14;
			te[ 1 ] = n21; te[ 5 ] = n22; te[ 9 ] = n23; te[ 13 ] = n24;
			te[ 2 ] = n31; te[ 6 ] = n32; te[ 10 ] = n33; te[ 14 ] = n34;
			te[ 3 ] = n41; te[ 7 ] = n42; te[ 11 ] = n43; te[ 15 ] = n44;

			return this;

		}

		identity() {

			this.set(

				1, 0, 0, 0,
				0, 1, 0, 0,
				0, 0, 1, 0,
				0, 0, 0, 1

			);

			return this;

		}

		clone() {

			return new Matrix4().fromArray( this.elements );

		}

		copy( m ) {

			const te = this.elements;
			const me = m.elements;

			te[ 0 ] = me[ 0 ]; te[ 1 ] = me[ 1 ]; te[ 2 ] = me[ 2 ]; te[ 3 ] = me[ 3 ];
			te[ 4 ] = me[ 4 ]; te[ 5 ] = me[ 5 ]; te[ 6 ] = me[ 6 ]; te[ 7 ] = me[ 7 ];
			te[ 8 ] = me[ 8 ]; te[ 9 ] = me[ 9 ]; te[ 10 ] = me[ 10 ]; te[ 11 ] = me[ 11 ];
			te[ 12 ] = me[ 12 ]; te[ 13 ] = me[ 13 ]; te[ 14 ] = me[ 14 ]; te[ 15 ] = me[ 15 ];

			return this;

		}

		copyPosition( m ) {

			const te = this.elements, me = m.elements;

			te[ 12 ] = me[ 12 ];
			te[ 13 ] = me[ 13 ];
			te[ 14 ] = me[ 14 ];

			return this;

		}

		setFromMatrix3( m ) {

			const me = m.elements;

			this.set(

				me[ 0 ], me[ 3 ], me[ 6 ], 0,
				me[ 1 ], me[ 4 ], me[ 7 ], 0,
				me[ 2 ], me[ 5 ], me[ 8 ], 0,
				0, 0, 0, 1

			);

			return this;

		}

		extractBasis( xAxis, yAxis, zAxis ) {

			xAxis.setFromMatrixColumn( this, 0 );
			yAxis.setFromMatrixColumn( this, 1 );
			zAxis.setFromMatrixColumn( this, 2 );

			return this;

		}

		makeBasis( xAxis, yAxis, zAxis ) {

			this.set(
				xAxis.x, yAxis.x, zAxis.x, 0,
				xAxis.y, yAxis.y, zAxis.y, 0,
				xAxis.z, yAxis.z, zAxis.z, 0,
				0, 0, 0, 1
			);

			return this;

		}

		extractRotation( m ) {

			// this method does not support reflection matrices

			const te = this.elements;
			const me = m.elements;

			const scaleX = 1 / _v1$2.setFromMatrixColumn( m, 0 ).length();
			const scaleY = 1 / _v1$2.setFromMatrixColumn( m, 1 ).length();
			const scaleZ = 1 / _v1$2.setFromMatrixColumn( m, 2 ).length();

			te[ 0 ] = me[ 0 ] * scaleX;
			te[ 1 ] = me[ 1 ] * scaleX;
			te[ 2 ] = me[ 2 ] * scaleX;
			te[ 3 ] = 0;

			te[ 4 ] = me[ 4 ] * scaleY;
			te[ 5 ] = me[ 5 ] * scaleY;
			te[ 6 ] = me[ 6 ] * scaleY;
			te[ 7 ] = 0;

			te[ 8 ] = me[ 8 ] * scaleZ;
			te[ 9 ] = me[ 9 ] * scaleZ;
			te[ 10 ] = me[ 10 ] * scaleZ;
			te[ 11 ] = 0;

			te[ 12 ] = 0;
			te[ 13 ] = 0;
			te[ 14 ] = 0;
			te[ 15 ] = 1;

			return this;

		}

		makeRotationFromEuler( euler ) {

			const te = this.elements;

			const x = euler.x, y = euler.y, z = euler.z;
			const a = Math.cos( x ), b = Math.sin( x );
			const c = Math.cos( y ), d = Math.sin( y );
			const e = Math.cos( z ), f = Math.sin( z );

			if ( euler.order === 'XYZ' ) {

				const ae = a * e, af = a * f, be = b * e, bf = b * f;

				te[ 0 ] = c * e;
				te[ 4 ] = - c * f;
				te[ 8 ] = d;

				te[ 1 ] = af + be * d;
				te[ 5 ] = ae - bf * d;
				te[ 9 ] = - b * c;

				te[ 2 ] = bf - ae * d;
				te[ 6 ] = be + af * d;
				te[ 10 ] = a * c;

			} else if ( euler.order === 'YXZ' ) {

				const ce = c * e, cf = c * f, de = d * e, df = d * f;

				te[ 0 ] = ce + df * b;
				te[ 4 ] = de * b - cf;
				te[ 8 ] = a * d;

				te[ 1 ] = a * f;
				te[ 5 ] = a * e;
				te[ 9 ] = - b;

				te[ 2 ] = cf * b - de;
				te[ 6 ] = df + ce * b;
				te[ 10 ] = a * c;

			} else if ( euler.order === 'ZXY' ) {

				const ce = c * e, cf = c * f, de = d * e, df = d * f;

				te[ 0 ] = ce - df * b;
				te[ 4 ] = - a * f;
				te[ 8 ] = de + cf * b;

				te[ 1 ] = cf + de * b;
				te[ 5 ] = a * e;
				te[ 9 ] = df - ce * b;

				te[ 2 ] = - a * d;
				te[ 6 ] = b;
				te[ 10 ] = a * c;

			} else if ( euler.order === 'ZYX' ) {

				const ae = a * e, af = a * f, be = b * e, bf = b * f;

				te[ 0 ] = c * e;
				te[ 4 ] = be * d - af;
				te[ 8 ] = ae * d + bf;

				te[ 1 ] = c * f;
				te[ 5 ] = bf * d + ae;
				te[ 9 ] = af * d - be;

				te[ 2 ] = - d;
				te[ 6 ] = b * c;
				te[ 10 ] = a * c;

			} else if ( euler.order === 'YZX' ) {

				const ac = a * c, ad = a * d, bc = b * c, bd = b * d;

				te[ 0 ] = c * e;
				te[ 4 ] = bd - ac * f;
				te[ 8 ] = bc * f + ad;

				te[ 1 ] = f;
				te[ 5 ] = a * e;
				te[ 9 ] = - b * e;

				te[ 2 ] = - d * e;
				te[ 6 ] = ad * f + bc;
				te[ 10 ] = ac - bd * f;

			} else if ( euler.order === 'XZY' ) {

				const ac = a * c, ad = a * d, bc = b * c, bd = b * d;

				te[ 0 ] = c * e;
				te[ 4 ] = - f;
				te[ 8 ] = d * e;

				te[ 1 ] = ac * f + bd;
				te[ 5 ] = a * e;
				te[ 9 ] = ad * f - bc;

				te[ 2 ] = bc * f - ad;
				te[ 6 ] = b * e;
				te[ 10 ] = bd * f + ac;

			}

			// bottom row
			te[ 3 ] = 0;
			te[ 7 ] = 0;
			te[ 11 ] = 0;

			// last column
			te[ 12 ] = 0;
			te[ 13 ] = 0;
			te[ 14 ] = 0;
			te[ 15 ] = 1;

			return this;

		}

		makeRotationFromQuaternion( q ) {

			return this.compose( _zero, q, _one );

		}

		lookAt( eye, target, up ) {

			const te = this.elements;

			_z.subVectors( eye, target );

			if ( _z.lengthSq() === 0 ) {

				// eye and target are in the same position

				_z.z = 1;

			}

			_z.normalize();
			_x.crossVectors( up, _z );

			if ( _x.lengthSq() === 0 ) {

				// up and z are parallel

				if ( Math.abs( up.z ) === 1 ) {

					_z.x += 0.0001;

				} else {

					_z.z += 0.0001;

				}

				_z.normalize();
				_x.crossVectors( up, _z );

			}

			_x.normalize();
			_y.crossVectors( _z, _x );

			te[ 0 ] = _x.x; te[ 4 ] = _y.x; te[ 8 ] = _z.x;
			te[ 1 ] = _x.y; te[ 5 ] = _y.y; te[ 9 ] = _z.y;
			te[ 2 ] = _x.z; te[ 6 ] = _y.z; te[ 10 ] = _z.z;

			return this;

		}

		multiply( m ) {

			return this.multiplyMatrices( this, m );

		}

		premultiply( m ) {

			return this.multiplyMatrices( m, this );

		}

		multiplyMatrices( a, b ) {

			const ae = a.elements;
			const be = b.elements;
			const te = this.elements;

			const a11 = ae[ 0 ], a12 = ae[ 4 ], a13 = ae[ 8 ], a14 = ae[ 12 ];
			const a21 = ae[ 1 ], a22 = ae[ 5 ], a23 = ae[ 9 ], a24 = ae[ 13 ];
			const a31 = ae[ 2 ], a32 = ae[ 6 ], a33 = ae[ 10 ], a34 = ae[ 14 ];
			const a41 = ae[ 3 ], a42 = ae[ 7 ], a43 = ae[ 11 ], a44 = ae[ 15 ];

			const b11 = be[ 0 ], b12 = be[ 4 ], b13 = be[ 8 ], b14 = be[ 12 ];
			const b21 = be[ 1 ], b22 = be[ 5 ], b23 = be[ 9 ], b24 = be[ 13 ];
			const b31 = be[ 2 ], b32 = be[ 6 ], b33 = be[ 10 ], b34 = be[ 14 ];
			const b41 = be[ 3 ], b42 = be[ 7 ], b43 = be[ 11 ], b44 = be[ 15 ];

			te[ 0 ] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
			te[ 4 ] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
			te[ 8 ] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
			te[ 12 ] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

			te[ 1 ] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
			te[ 5 ] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
			te[ 9 ] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
			te[ 13 ] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

			te[ 2 ] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
			te[ 6 ] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
			te[ 10 ] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
			te[ 14 ] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

			te[ 3 ] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
			te[ 7 ] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
			te[ 11 ] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
			te[ 15 ] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

			return this;

		}

		multiplyScalar( s ) {

			const te = this.elements;

			te[ 0 ] *= s; te[ 4 ] *= s; te[ 8 ] *= s; te[ 12 ] *= s;
			te[ 1 ] *= s; te[ 5 ] *= s; te[ 9 ] *= s; te[ 13 ] *= s;
			te[ 2 ] *= s; te[ 6 ] *= s; te[ 10 ] *= s; te[ 14 ] *= s;
			te[ 3 ] *= s; te[ 7 ] *= s; te[ 11 ] *= s; te[ 15 ] *= s;

			return this;

		}

		determinant() {

			const te = this.elements;

			const n11 = te[ 0 ], n12 = te[ 4 ], n13 = te[ 8 ], n14 = te[ 12 ];
			const n21 = te[ 1 ], n22 = te[ 5 ], n23 = te[ 9 ], n24 = te[ 13 ];
			const n31 = te[ 2 ], n32 = te[ 6 ], n33 = te[ 10 ], n34 = te[ 14 ];
			const n41 = te[ 3 ], n42 = te[ 7 ], n43 = te[ 11 ], n44 = te[ 15 ];

			//TODO: make this more efficient
			//( based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm )

			return (
				n41 * (
					+ n14 * n23 * n32
					 - n13 * n24 * n32
					 - n14 * n22 * n33
					 + n12 * n24 * n33
					 + n13 * n22 * n34
					 - n12 * n23 * n34
				) +
				n42 * (
					+ n11 * n23 * n34
					 - n11 * n24 * n33
					 + n14 * n21 * n33
					 - n13 * n21 * n34
					 + n13 * n24 * n31
					 - n14 * n23 * n31
				) +
				n43 * (
					+ n11 * n24 * n32
					 - n11 * n22 * n34
					 - n14 * n21 * n32
					 + n12 * n21 * n34
					 + n14 * n22 * n31
					 - n12 * n24 * n31
				) +
				n44 * (
					- n13 * n22 * n31
					 - n11 * n23 * n32
					 + n11 * n22 * n33
					 + n13 * n21 * n32
					 - n12 * n21 * n33
					 + n12 * n23 * n31
				)

			);

		}

		transpose() {

			const te = this.elements;
			let tmp;

			tmp = te[ 1 ]; te[ 1 ] = te[ 4 ]; te[ 4 ] = tmp;
			tmp = te[ 2 ]; te[ 2 ] = te[ 8 ]; te[ 8 ] = tmp;
			tmp = te[ 6 ]; te[ 6 ] = te[ 9 ]; te[ 9 ] = tmp;

			tmp = te[ 3 ]; te[ 3 ] = te[ 12 ]; te[ 12 ] = tmp;
			tmp = te[ 7 ]; te[ 7 ] = te[ 13 ]; te[ 13 ] = tmp;
			tmp = te[ 11 ]; te[ 11 ] = te[ 14 ]; te[ 14 ] = tmp;

			return this;

		}

		setPosition( x, y, z ) {

			const te = this.elements;

			if ( x.isVector3 ) {

				te[ 12 ] = x.x;
				te[ 13 ] = x.y;
				te[ 14 ] = x.z;

			} else {

				te[ 12 ] = x;
				te[ 13 ] = y;
				te[ 14 ] = z;

			}

			return this;

		}

		invert() {

			// based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
			const te = this.elements,

				n11 = te[ 0 ], n21 = te[ 1 ], n31 = te[ 2 ], n41 = te[ 3 ],
				n12 = te[ 4 ], n22 = te[ 5 ], n32 = te[ 6 ], n42 = te[ 7 ],
				n13 = te[ 8 ], n23 = te[ 9 ], n33 = te[ 10 ], n43 = te[ 11 ],
				n14 = te[ 12 ], n24 = te[ 13 ], n34 = te[ 14 ], n44 = te[ 15 ],

				t11 = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44,
				t12 = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44,
				t13 = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44,
				t14 = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;

			const det = n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14;

			if ( det === 0 ) return this.set( 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 );

			const detInv = 1 / det;

			te[ 0 ] = t11 * detInv;
			te[ 1 ] = ( n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44 ) * detInv;
			te[ 2 ] = ( n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44 ) * detInv;
			te[ 3 ] = ( n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43 ) * detInv;

			te[ 4 ] = t12 * detInv;
			te[ 5 ] = ( n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44 ) * detInv;
			te[ 6 ] = ( n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44 ) * detInv;
			te[ 7 ] = ( n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43 ) * detInv;

			te[ 8 ] = t13 * detInv;
			te[ 9 ] = ( n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44 ) * detInv;
			te[ 10 ] = ( n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44 ) * detInv;
			te[ 11 ] = ( n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43 ) * detInv;

			te[ 12 ] = t14 * detInv;
			te[ 13 ] = ( n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34 ) * detInv;
			te[ 14 ] = ( n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34 ) * detInv;
			te[ 15 ] = ( n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33 ) * detInv;

			return this;

		}

		scale( v ) {

			const te = this.elements;
			const x = v.x, y = v.y, z = v.z;

			te[ 0 ] *= x; te[ 4 ] *= y; te[ 8 ] *= z;
			te[ 1 ] *= x; te[ 5 ] *= y; te[ 9 ] *= z;
			te[ 2 ] *= x; te[ 6 ] *= y; te[ 10 ] *= z;
			te[ 3 ] *= x; te[ 7 ] *= y; te[ 11 ] *= z;

			return this;

		}

		getMaxScaleOnAxis() {

			const te = this.elements;

			const scaleXSq = te[ 0 ] * te[ 0 ] + te[ 1 ] * te[ 1 ] + te[ 2 ] * te[ 2 ];
			const scaleYSq = te[ 4 ] * te[ 4 ] + te[ 5 ] * te[ 5 ] + te[ 6 ] * te[ 6 ];
			const scaleZSq = te[ 8 ] * te[ 8 ] + te[ 9 ] * te[ 9 ] + te[ 10 ] * te[ 10 ];

			return Math.sqrt( Math.max( scaleXSq, scaleYSq, scaleZSq ) );

		}

		makeTranslation( x, y, z ) {

			if ( x.isVector3 ) {

				this.set(

					1, 0, 0, x.x,
					0, 1, 0, x.y,
					0, 0, 1, x.z,
					0, 0, 0, 1

				);

			} else {

				this.set(

					1, 0, 0, x,
					0, 1, 0, y,
					0, 0, 1, z,
					0, 0, 0, 1

				);

			}

			return this;

		}

		makeRotationX( theta ) {

			const c = Math.cos( theta ), s = Math.sin( theta );

			this.set(

				1, 0, 0, 0,
				0, c, - s, 0,
				0, s, c, 0,
				0, 0, 0, 1

			);

			return this;

		}

		makeRotationY( theta ) {

			const c = Math.cos( theta ), s = Math.sin( theta );

			this.set(

				 c, 0, s, 0,
				 0, 1, 0, 0,
				- s, 0, c, 0,
				 0, 0, 0, 1

			);

			return this;

		}

		makeRotationZ( theta ) {

			const c = Math.cos( theta ), s = Math.sin( theta );

			this.set(

				c, - s, 0, 0,
				s, c, 0, 0,
				0, 0, 1, 0,
				0, 0, 0, 1

			);

			return this;

		}

		makeRotationAxis( axis, angle ) {

			// Based on http://www.gamedev.net/reference/articles/article1199.asp

			const c = Math.cos( angle );
			const s = Math.sin( angle );
			const t = 1 - c;
			const x = axis.x, y = axis.y, z = axis.z;
			const tx = t * x, ty = t * y;

			this.set(

				tx * x + c, tx * y - s * z, tx * z + s * y, 0,
				tx * y + s * z, ty * y + c, ty * z - s * x, 0,
				tx * z - s * y, ty * z + s * x, t * z * z + c, 0,
				0, 0, 0, 1

			);

			return this;

		}

		makeScale( x, y, z ) {

			this.set(

				x, 0, 0, 0,
				0, y, 0, 0,
				0, 0, z, 0,
				0, 0, 0, 1

			);

			return this;

		}

		makeShear( xy, xz, yx, yz, zx, zy ) {

			this.set(

				1, yx, zx, 0,
				xy, 1, zy, 0,
				xz, yz, 1, 0,
				0, 0, 0, 1

			);

			return this;

		}

		compose( position, quaternion, scale ) {

			const te = this.elements;

			const x = quaternion._x, y = quaternion._y, z = quaternion._z, w = quaternion._w;
			const x2 = x + x,	y2 = y + y, z2 = z + z;
			const xx = x * x2, xy = x * y2, xz = x * z2;
			const yy = y * y2, yz = y * z2, zz = z * z2;
			const wx = w * x2, wy = w * y2, wz = w * z2;

			const sx = scale.x, sy = scale.y, sz = scale.z;

			te[ 0 ] = ( 1 - ( yy + zz ) ) * sx;
			te[ 1 ] = ( xy + wz ) * sx;
			te[ 2 ] = ( xz - wy ) * sx;
			te[ 3 ] = 0;

			te[ 4 ] = ( xy - wz ) * sy;
			te[ 5 ] = ( 1 - ( xx + zz ) ) * sy;
			te[ 6 ] = ( yz + wx ) * sy;
			te[ 7 ] = 0;

			te[ 8 ] = ( xz + wy ) * sz;
			te[ 9 ] = ( yz - wx ) * sz;
			te[ 10 ] = ( 1 - ( xx + yy ) ) * sz;
			te[ 11 ] = 0;

			te[ 12 ] = position.x;
			te[ 13 ] = position.y;
			te[ 14 ] = position.z;
			te[ 15 ] = 1;

			return this;

		}

		decompose( position, quaternion, scale ) {

			const te = this.elements;

			let sx = _v1$2.set( te[ 0 ], te[ 1 ], te[ 2 ] ).length();
			const sy = _v1$2.set( te[ 4 ], te[ 5 ], te[ 6 ] ).length();
			const sz = _v1$2.set( te[ 8 ], te[ 9 ], te[ 10 ] ).length();

			// if determine is negative, we need to invert one scale
			const det = this.determinant();
			if ( det < 0 ) sx = - sx;

			position.x = te[ 12 ];
			position.y = te[ 13 ];
			position.z = te[ 14 ];

			// scale the rotation part
			_m1$2.copy( this );

			const invSX = 1 / sx;
			const invSY = 1 / sy;
			const invSZ = 1 / sz;

			_m1$2.elements[ 0 ] *= invSX;
			_m1$2.elements[ 1 ] *= invSX;
			_m1$2.elements[ 2 ] *= invSX;

			_m1$2.elements[ 4 ] *= invSY;
			_m1$2.elements[ 5 ] *= invSY;
			_m1$2.elements[ 6 ] *= invSY;

			_m1$2.elements[ 8 ] *= invSZ;
			_m1$2.elements[ 9 ] *= invSZ;
			_m1$2.elements[ 10 ] *= invSZ;

			quaternion.setFromRotationMatrix( _m1$2 );

			scale.x = sx;
			scale.y = sy;
			scale.z = sz;

			return this;

		}

		makePerspective( left, right, top, bottom, near, far, coordinateSystem = WebGLCoordinateSystem ) {

			const te = this.elements;
			const x = 2 * near / ( right - left );
			const y = 2 * near / ( top - bottom );

			const a = ( right + left ) / ( right - left );
			const b = ( top + bottom ) / ( top - bottom );

			let c, d;

			if ( coordinateSystem === WebGLCoordinateSystem ) {

				c = - ( far + near ) / ( far - near );
				d = ( - 2 * far * near ) / ( far - near );

			} else if ( coordinateSystem === WebGPUCoordinateSystem ) {

				c = - far / ( far - near );
				d = ( - far * near ) / ( far - near );

			} else {

				throw new Error( 'THREE.Matrix4.makePerspective(): Invalid coordinate system: ' + coordinateSystem );

			}

			te[ 0 ] = x;	te[ 4 ] = 0;	te[ 8 ] = a; 	te[ 12 ] = 0;
			te[ 1 ] = 0;	te[ 5 ] = y;	te[ 9 ] = b; 	te[ 13 ] = 0;
			te[ 2 ] = 0;	te[ 6 ] = 0;	te[ 10 ] = c; 	te[ 14 ] = d;
			te[ 3 ] = 0;	te[ 7 ] = 0;	te[ 11 ] = - 1;	te[ 15 ] = 0;

			return this;

		}

		makeOrthographic( left, right, top, bottom, near, far, coordinateSystem = WebGLCoordinateSystem ) {

			const te = this.elements;
			const w = 1.0 / ( right - left );
			const h = 1.0 / ( top - bottom );
			const p = 1.0 / ( far - near );

			const x = ( right + left ) * w;
			const y = ( top + bottom ) * h;

			let z, zInv;

			if ( coordinateSystem === WebGLCoordinateSystem ) {

				z = ( far + near ) * p;
				zInv = - 2 * p;

			} else if ( coordinateSystem === WebGPUCoordinateSystem ) {

				z = near * p;
				zInv = - 1 * p;

			} else {

				throw new Error( 'THREE.Matrix4.makeOrthographic(): Invalid coordinate system: ' + coordinateSystem );

			}

			te[ 0 ] = 2 * w;	te[ 4 ] = 0;		te[ 8 ] = 0; 		te[ 12 ] = - x;
			te[ 1 ] = 0; 		te[ 5 ] = 2 * h;	te[ 9 ] = 0; 		te[ 13 ] = - y;
			te[ 2 ] = 0; 		te[ 6 ] = 0;		te[ 10 ] = zInv;	te[ 14 ] = - z;
			te[ 3 ] = 0; 		te[ 7 ] = 0;		te[ 11 ] = 0;		te[ 15 ] = 1;

			return this;

		}

		equals( matrix ) {

			const te = this.elements;
			const me = matrix.elements;

			for ( let i = 0; i < 16; i ++ ) {

				if ( te[ i ] !== me[ i ] ) return false;

			}

			return true;

		}

		fromArray( array, offset = 0 ) {

			for ( let i = 0; i < 16; i ++ ) {

				this.elements[ i ] = array[ i + offset ];

			}

			return this;

		}

		toArray( array = [], offset = 0 ) {

			const te = this.elements;

			array[ offset ] = te[ 0 ];
			array[ offset + 1 ] = te[ 1 ];
			array[ offset + 2 ] = te[ 2 ];
			array[ offset + 3 ] = te[ 3 ];

			array[ offset + 4 ] = te[ 4 ];
			array[ offset + 5 ] = te[ 5 ];
			array[ offset + 6 ] = te[ 6 ];
			array[ offset + 7 ] = te[ 7 ];

			array[ offset + 8 ] = te[ 8 ];
			array[ offset + 9 ] = te[ 9 ];
			array[ offset + 10 ] = te[ 10 ];
			array[ offset + 11 ] = te[ 11 ];

			array[ offset + 12 ] = te[ 12 ];
			array[ offset + 13 ] = te[ 13 ];
			array[ offset + 14 ] = te[ 14 ];
			array[ offset + 15 ] = te[ 15 ];

			return array;

		}

	}

	const _v1$2 = /*@__PURE__*/ new Vector3();
	const _m1$2 = /*@__PURE__*/ new Matrix4();
	const _zero = /*@__PURE__*/ new Vector3( 0, 0, 0 );
	const _one = /*@__PURE__*/ new Vector3( 1, 1, 1 );
	const _x = /*@__PURE__*/ new Vector3();
	const _y = /*@__PURE__*/ new Vector3();
	const _z = /*@__PURE__*/ new Vector3();

	/**
	 * https://github.com/mrdoob/eventdispatcher.js/
	 */

	class EventDispatcher {

		addEventListener( type, listener ) {

			if ( this._listeners === undefined ) this._listeners = {};

			const listeners = this._listeners;

			if ( listeners[ type ] === undefined ) {

				listeners[ type ] = [];

			}

			if ( listeners[ type ].indexOf( listener ) === - 1 ) {

				listeners[ type ].push( listener );

			}

		}

		hasEventListener( type, listener ) {

			if ( this._listeners === undefined ) return false;

			const listeners = this._listeners;

			return listeners[ type ] !== undefined && listeners[ type ].indexOf( listener ) !== - 1;

		}

		removeEventListener( type, listener ) {

			if ( this._listeners === undefined ) return;

			const listeners = this._listeners;
			const listenerArray = listeners[ type ];

			if ( listenerArray !== undefined ) {

				const index = listenerArray.indexOf( listener );

				if ( index !== - 1 ) {

					listenerArray.splice( index, 1 );

				}

			}

		}

		dispatchEvent( event ) {

			if ( this._listeners === undefined ) return;

			const listeners = this._listeners;
			const listenerArray = listeners[ event.type ];

			if ( listenerArray !== undefined ) {

				event.target = this;

				// Make a copy, in case listeners are removed while iterating.
				const array = listenerArray.slice( 0 );

				for ( let i = 0, l = array.length; i < l; i ++ ) {

					array[ i ].call( this, event );

				}

				event.target = null;

			}

		}

	}

	const _matrix = /*@__PURE__*/ new Matrix4();
	const _quaternion$1 = /*@__PURE__*/ new Quaternion();

	class Euler {

		constructor( x = 0, y = 0, z = 0, order = Euler.DEFAULT_ORDER ) {

			this.isEuler = true;

			this._x = x;
			this._y = y;
			this._z = z;
			this._order = order;

		}

		get x() {

			return this._x;

		}

		set x( value ) {

			this._x = value;
			this._onChangeCallback();

		}

		get y() {

			return this._y;

		}

		set y( value ) {

			this._y = value;
			this._onChangeCallback();

		}

		get z() {

			return this._z;

		}

		set z( value ) {

			this._z = value;
			this._onChangeCallback();

		}

		get order() {

			return this._order;

		}

		set order( value ) {

			this._order = value;
			this._onChangeCallback();

		}

		set( x, y, z, order = this._order ) {

			this._x = x;
			this._y = y;
			this._z = z;
			this._order = order;

			this._onChangeCallback();

			return this;

		}

		clone() {

			return new this.constructor( this._x, this._y, this._z, this._order );

		}

		copy( euler ) {

			this._x = euler._x;
			this._y = euler._y;
			this._z = euler._z;
			this._order = euler._order;

			this._onChangeCallback();

			return this;

		}

		setFromRotationMatrix( m, order = this._order, update = true ) {

			// assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

			const te = m.elements;
			const m11 = te[ 0 ], m12 = te[ 4 ], m13 = te[ 8 ];
			const m21 = te[ 1 ], m22 = te[ 5 ], m23 = te[ 9 ];
			const m31 = te[ 2 ], m32 = te[ 6 ], m33 = te[ 10 ];

			switch ( order ) {

				case 'XYZ':

					this._y = Math.asin( clamp( m13, - 1, 1 ) );

					if ( Math.abs( m13 ) < 0.9999999 ) {

						this._x = Math.atan2( - m23, m33 );
						this._z = Math.atan2( - m12, m11 );

					} else {

						this._x = Math.atan2( m32, m22 );
						this._z = 0;

					}

					break;

				case 'YXZ':

					this._x = Math.asin( - clamp( m23, - 1, 1 ) );

					if ( Math.abs( m23 ) < 0.9999999 ) {

						this._y = Math.atan2( m13, m33 );
						this._z = Math.atan2( m21, m22 );

					} else {

						this._y = Math.atan2( - m31, m11 );
						this._z = 0;

					}

					break;

				case 'ZXY':

					this._x = Math.asin( clamp( m32, - 1, 1 ) );

					if ( Math.abs( m32 ) < 0.9999999 ) {

						this._y = Math.atan2( - m31, m33 );
						this._z = Math.atan2( - m12, m22 );

					} else {

						this._y = 0;
						this._z = Math.atan2( m21, m11 );

					}

					break;

				case 'ZYX':

					this._y = Math.asin( - clamp( m31, - 1, 1 ) );

					if ( Math.abs( m31 ) < 0.9999999 ) {

						this._x = Math.atan2( m32, m33 );
						this._z = Math.atan2( m21, m11 );

					} else {

						this._x = 0;
						this._z = Math.atan2( - m12, m22 );

					}

					break;

				case 'YZX':

					this._z = Math.asin( clamp( m21, - 1, 1 ) );

					if ( Math.abs( m21 ) < 0.9999999 ) {

						this._x = Math.atan2( - m23, m22 );
						this._y = Math.atan2( - m31, m11 );

					} else {

						this._x = 0;
						this._y = Math.atan2( m13, m33 );

					}

					break;

				case 'XZY':

					this._z = Math.asin( - clamp( m12, - 1, 1 ) );

					if ( Math.abs( m12 ) < 0.9999999 ) {

						this._x = Math.atan2( m32, m22 );
						this._y = Math.atan2( m13, m11 );

					} else {

						this._x = Math.atan2( - m23, m33 );
						this._y = 0;

					}

					break;

				default:

					console.warn( 'THREE.Euler: .setFromRotationMatrix() encountered an unknown order: ' + order );

			}

			this._order = order;

			if ( update === true ) this._onChangeCallback();

			return this;

		}

		setFromQuaternion( q, order, update ) {

			_matrix.makeRotationFromQuaternion( q );

			return this.setFromRotationMatrix( _matrix, order, update );

		}

		setFromVector3( v, order = this._order ) {

			return this.set( v.x, v.y, v.z, order );

		}

		reorder( newOrder ) {

			// WARNING: this discards revolution information -bhouston

			_quaternion$1.setFromEuler( this );

			return this.setFromQuaternion( _quaternion$1, newOrder );

		}

		equals( euler ) {

			return ( euler._x === this._x ) && ( euler._y === this._y ) && ( euler._z === this._z ) && ( euler._order === this._order );

		}

		fromArray( array ) {

			this._x = array[ 0 ];
			this._y = array[ 1 ];
			this._z = array[ 2 ];
			if ( array[ 3 ] !== undefined ) this._order = array[ 3 ];

			this._onChangeCallback();

			return this;

		}

		toArray( array = [], offset = 0 ) {

			array[ offset ] = this._x;
			array[ offset + 1 ] = this._y;
			array[ offset + 2 ] = this._z;
			array[ offset + 3 ] = this._order;

			return array;

		}

		_onChange( callback ) {

			this._onChangeCallback = callback;

			return this;

		}

		_onChangeCallback() {}

		*[ Symbol.iterator ]() {

			yield this._x;
			yield this._y;
			yield this._z;
			yield this._order;

		}

	}

	Euler.DEFAULT_ORDER = 'XYZ';

	class Layers {

		constructor() {

			this.mask = 1 | 0;

		}

		set( channel ) {

			this.mask = ( 1 << channel | 0 ) >>> 0;

		}

		enable( channel ) {

			this.mask |= 1 << channel | 0;

		}

		enableAll() {

			this.mask = 0xffffffff | 0;

		}

		toggle( channel ) {

			this.mask ^= 1 << channel | 0;

		}

		disable( channel ) {

			this.mask &= ~ ( 1 << channel | 0 );

		}

		disableAll() {

			this.mask = 0;

		}

		test( layers ) {

			return ( this.mask & layers.mask ) !== 0;

		}

		isEnabled( channel ) {

			return ( this.mask & ( 1 << channel | 0 ) ) !== 0;

		}

	}

	let _object3DId = 0;

	const _v1$1 = /*@__PURE__*/ new Vector3();
	const _q1 = /*@__PURE__*/ new Quaternion();
	const _m1$1 = /*@__PURE__*/ new Matrix4();
	const _target = /*@__PURE__*/ new Vector3();

	const _position = /*@__PURE__*/ new Vector3();
	const _scale = /*@__PURE__*/ new Vector3();
	const _quaternion = /*@__PURE__*/ new Quaternion();

	const _xAxis = /*@__PURE__*/ new Vector3( 1, 0, 0 );
	const _yAxis = /*@__PURE__*/ new Vector3( 0, 1, 0 );
	const _zAxis = /*@__PURE__*/ new Vector3( 0, 0, 1 );

	const _addedEvent = { type: 'added' };
	const _removedEvent = { type: 'removed' };

	const _childaddedEvent = { type: 'childadded', child: null };
	const _childremovedEvent = { type: 'childremoved', child: null };

	class Object3D extends EventDispatcher {

		constructor() {

			super();

			this.isObject3D = true;

			Object.defineProperty( this, 'id', { value: _object3DId ++ } );

			this.uuid = generateUUID();

			this.name = '';
			this.type = 'Object3D';

			this.parent = null;
			this.children = [];

			this.up = Object3D.DEFAULT_UP.clone();

			const position = new Vector3();
			const rotation = new Euler();
			const quaternion = new Quaternion();
			const scale = new Vector3( 1, 1, 1 );

			function onRotationChange() {

				quaternion.setFromEuler( rotation, false );

			}

			function onQuaternionChange() {

				rotation.setFromQuaternion( quaternion, undefined, false );

			}

			rotation._onChange( onRotationChange );
			quaternion._onChange( onQuaternionChange );

			Object.defineProperties( this, {
				position: {
					configurable: true,
					enumerable: true,
					value: position
				},
				rotation: {
					configurable: true,
					enumerable: true,
					value: rotation
				},
				quaternion: {
					configurable: true,
					enumerable: true,
					value: quaternion
				},
				scale: {
					configurable: true,
					enumerable: true,
					value: scale
				},
				modelViewMatrix: {
					value: new Matrix4()
				},
				normalMatrix: {
					value: new Matrix3()
				}
			} );

			this.matrix = new Matrix4();
			this.matrixWorld = new Matrix4();

			this.matrixAutoUpdate = Object3D.DEFAULT_MATRIX_AUTO_UPDATE;

			this.matrixWorldAutoUpdate = Object3D.DEFAULT_MATRIX_WORLD_AUTO_UPDATE; // checked by the renderer
			this.matrixWorldNeedsUpdate = false;

			this.layers = new Layers();
			this.visible = true;

			this.castShadow = false;
			this.receiveShadow = false;

			this.frustumCulled = true;
			this.renderOrder = 0;

			this.animations = [];

			this.userData = {};

		}

		onBeforeShadow( /* renderer, object, camera, shadowCamera, geometry, depthMaterial, group */ ) {}

		onAfterShadow( /* renderer, object, camera, shadowCamera, geometry, depthMaterial, group */ ) {}

		onBeforeRender( /* renderer, scene, camera, geometry, material, group */ ) {}

		onAfterRender( /* renderer, scene, camera, geometry, material, group */ ) {}

		applyMatrix4( matrix ) {

			if ( this.matrixAutoUpdate ) this.updateMatrix();

			this.matrix.premultiply( matrix );

			this.matrix.decompose( this.position, this.quaternion, this.scale );

		}

		applyQuaternion( q ) {

			this.quaternion.premultiply( q );

			return this;

		}

		setRotationFromAxisAngle( axis, angle ) {

			// assumes axis is normalized

			this.quaternion.setFromAxisAngle( axis, angle );

		}

		setRotationFromEuler( euler ) {

			this.quaternion.setFromEuler( euler, true );

		}

		setRotationFromMatrix( m ) {

			// assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

			this.quaternion.setFromRotationMatrix( m );

		}

		setRotationFromQuaternion( q ) {

			// assumes q is normalized

			this.quaternion.copy( q );

		}

		rotateOnAxis( axis, angle ) {

			// rotate object on axis in object space
			// axis is assumed to be normalized

			_q1.setFromAxisAngle( axis, angle );

			this.quaternion.multiply( _q1 );

			return this;

		}

		rotateOnWorldAxis( axis, angle ) {

			// rotate object on axis in world space
			// axis is assumed to be normalized
			// method assumes no rotated parent

			_q1.setFromAxisAngle( axis, angle );

			this.quaternion.premultiply( _q1 );

			return this;

		}

		rotateX( angle ) {

			return this.rotateOnAxis( _xAxis, angle );

		}

		rotateY( angle ) {

			return this.rotateOnAxis( _yAxis, angle );

		}

		rotateZ( angle ) {

			return this.rotateOnAxis( _zAxis, angle );

		}

		translateOnAxis( axis, distance ) {

			// translate object by distance along axis in object space
			// axis is assumed to be normalized

			_v1$1.copy( axis ).applyQuaternion( this.quaternion );

			this.position.add( _v1$1.multiplyScalar( distance ) );

			return this;

		}

		translateX( distance ) {

			return this.translateOnAxis( _xAxis, distance );

		}

		translateY( distance ) {

			return this.translateOnAxis( _yAxis, distance );

		}

		translateZ( distance ) {

			return this.translateOnAxis( _zAxis, distance );

		}

		localToWorld( vector ) {

			this.updateWorldMatrix( true, false );

			return vector.applyMatrix4( this.matrixWorld );

		}

		worldToLocal( vector ) {

			this.updateWorldMatrix( true, false );

			return vector.applyMatrix4( _m1$1.copy( this.matrixWorld ).invert() );

		}

		lookAt( x, y, z ) {

			// This method does not support objects having non-uniformly-scaled parent(s)

			if ( x.isVector3 ) {

				_target.copy( x );

			} else {

				_target.set( x, y, z );

			}

			const parent = this.parent;

			this.updateWorldMatrix( true, false );

			_position.setFromMatrixPosition( this.matrixWorld );

			if ( this.isCamera || this.isLight ) {

				_m1$1.lookAt( _position, _target, this.up );

			} else {

				_m1$1.lookAt( _target, _position, this.up );

			}

			this.quaternion.setFromRotationMatrix( _m1$1 );

			if ( parent ) {

				_m1$1.extractRotation( parent.matrixWorld );
				_q1.setFromRotationMatrix( _m1$1 );
				this.quaternion.premultiply( _q1.invert() );

			}

		}

		add( object ) {

			if ( arguments.length > 1 ) {

				for ( let i = 0; i < arguments.length; i ++ ) {

					this.add( arguments[ i ] );

				}

				return this;

			}

			if ( object === this ) {

				console.error( 'THREE.Object3D.add: object can\'t be added as a child of itself.', object );
				return this;

			}

			if ( object && object.isObject3D ) {

				if ( object.parent !== null ) {

					object.parent.remove( object );

				}

				object.parent = this;
				this.children.push( object );

				object.dispatchEvent( _addedEvent );

				_childaddedEvent.child = object;
				this.dispatchEvent( _childaddedEvent );
				_childaddedEvent.child = null;

			} else {

				console.error( 'THREE.Object3D.add: object not an instance of THREE.Object3D.', object );

			}

			return this;

		}

		remove( object ) {

			if ( arguments.length > 1 ) {

				for ( let i = 0; i < arguments.length; i ++ ) {

					this.remove( arguments[ i ] );

				}

				return this;

			}

			const index = this.children.indexOf( object );

			if ( index !== - 1 ) {

				object.parent = null;
				this.children.splice( index, 1 );

				object.dispatchEvent( _removedEvent );

				_childremovedEvent.child = object;
				this.dispatchEvent( _childremovedEvent );
				_childremovedEvent.child = null;

			}

			return this;

		}

		removeFromParent() {

			const parent = this.parent;

			if ( parent !== null ) {

				parent.remove( this );

			}

			return this;

		}

		clear() {

			return this.remove( ... this.children );

		}

		attach( object ) {

			// adds object as a child of this, while maintaining the object's world transform

			// Note: This method does not support scene graphs having non-uniformly-scaled nodes(s)

			this.updateWorldMatrix( true, false );

			_m1$1.copy( this.matrixWorld ).invert();

			if ( object.parent !== null ) {

				object.parent.updateWorldMatrix( true, false );

				_m1$1.multiply( object.parent.matrixWorld );

			}

			object.applyMatrix4( _m1$1 );

			this.add( object );

			object.updateWorldMatrix( false, true );

			return this;

		}

		getObjectById( id ) {

			return this.getObjectByProperty( 'id', id );

		}

		getObjectByName( name ) {

			return this.getObjectByProperty( 'name', name );

		}

		getObjectByProperty( name, value ) {

			if ( this[ name ] === value ) return this;

			for ( let i = 0, l = this.children.length; i < l; i ++ ) {

				const child = this.children[ i ];
				const object = child.getObjectByProperty( name, value );

				if ( object !== undefined ) {

					return object;

				}

			}

			return undefined;

		}

		getObjectsByProperty( name, value, result = [] ) {

			if ( this[ name ] === value ) result.push( this );

			const children = this.children;

			for ( let i = 0, l = children.length; i < l; i ++ ) {

				children[ i ].getObjectsByProperty( name, value, result );

			}

			return result;

		}

		getWorldPosition( target ) {

			this.updateWorldMatrix( true, false );

			return target.setFromMatrixPosition( this.matrixWorld );

		}

		getWorldQuaternion( target ) {

			this.updateWorldMatrix( true, false );

			this.matrixWorld.decompose( _position, target, _scale );

			return target;

		}

		getWorldScale( target ) {

			this.updateWorldMatrix( true, false );

			this.matrixWorld.decompose( _position, _quaternion, target );

			return target;

		}

		getWorldDirection( target ) {

			this.updateWorldMatrix( true, false );

			const e = this.matrixWorld.elements;

			return target.set( e[ 8 ], e[ 9 ], e[ 10 ] ).normalize();

		}

		raycast( /* raycaster, intersects */ ) {}

		traverse( callback ) {

			callback( this );

			const children = this.children;

			for ( let i = 0, l = children.length; i < l; i ++ ) {

				children[ i ].traverse( callback );

			}

		}

		traverseVisible( callback ) {

			if ( this.visible === false ) return;

			callback( this );

			const children = this.children;

			for ( let i = 0, l = children.length; i < l; i ++ ) {

				children[ i ].traverseVisible( callback );

			}

		}

		traverseAncestors( callback ) {

			const parent = this.parent;

			if ( parent !== null ) {

				callback( parent );

				parent.traverseAncestors( callback );

			}

		}

		updateMatrix() {

			this.matrix.compose( this.position, this.quaternion, this.scale );

			this.matrixWorldNeedsUpdate = true;

		}

		updateMatrixWorld( force ) {

			if ( this.matrixAutoUpdate ) this.updateMatrix();

			if ( this.matrixWorldNeedsUpdate || force ) {

				if ( this.parent === null ) {

					this.matrixWorld.copy( this.matrix );

				} else {

					this.matrixWorld.multiplyMatrices( this.parent.matrixWorld, this.matrix );

				}

				this.matrixWorldNeedsUpdate = false;

				force = true;

			}

			// update children

			const children = this.children;

			for ( let i = 0, l = children.length; i < l; i ++ ) {

				const child = children[ i ];

				if ( child.matrixWorldAutoUpdate === true || force === true ) {

					child.updateMatrixWorld( force );

				}

			}

		}

		updateWorldMatrix( updateParents, updateChildren ) {

			const parent = this.parent;

			if ( updateParents === true && parent !== null && parent.matrixWorldAutoUpdate === true ) {

				parent.updateWorldMatrix( true, false );

			}

			if ( this.matrixAutoUpdate ) this.updateMatrix();

			if ( this.parent === null ) {

				this.matrixWorld.copy( this.matrix );

			} else {

				this.matrixWorld.multiplyMatrices( this.parent.matrixWorld, this.matrix );

			}

			// update children

			if ( updateChildren === true ) {

				const children = this.children;

				for ( let i = 0, l = children.length; i < l; i ++ ) {

					const child = children[ i ];

					if ( child.matrixWorldAutoUpdate === true ) {

						child.updateWorldMatrix( false, true );

					}

				}

			}

		}

		toJSON( meta ) {

			// meta is a string when called from JSON.stringify
			const isRootObject = ( meta === undefined || typeof meta === 'string' );

			const output = {};

			// meta is a hash used to collect geometries, materials.
			// not providing it implies that this is the root object
			// being serialized.
			if ( isRootObject ) {

				// initialize meta obj
				meta = {
					geometries: {},
					materials: {},
					textures: {},
					images: {},
					shapes: {},
					skeletons: {},
					animations: {},
					nodes: {}
				};

				output.metadata = {
					version: 4.6,
					type: 'Object',
					generator: 'Object3D.toJSON'
				};

			}

			// standard Object3D serialization

			const object = {};

			object.uuid = this.uuid;
			object.type = this.type;

			if ( this.name !== '' ) object.name = this.name;
			if ( this.castShadow === true ) object.castShadow = true;
			if ( this.receiveShadow === true ) object.receiveShadow = true;
			if ( this.visible === false ) object.visible = false;
			if ( this.frustumCulled === false ) object.frustumCulled = false;
			if ( this.renderOrder !== 0 ) object.renderOrder = this.renderOrder;
			if ( Object.keys( this.userData ).length > 0 ) object.userData = this.userData;

			object.layers = this.layers.mask;
			object.matrix = this.matrix.toArray();
			object.up = this.up.toArray();

			if ( this.matrixAutoUpdate === false ) object.matrixAutoUpdate = false;

			// object specific properties

			if ( this.isInstancedMesh ) {

				object.type = 'InstancedMesh';
				object.count = this.count;
				object.instanceMatrix = this.instanceMatrix.toJSON();
				if ( this.instanceColor !== null ) object.instanceColor = this.instanceColor.toJSON();

			}

			if ( this.isBatchedMesh ) {

				object.type = 'BatchedMesh';
				object.perObjectFrustumCulled = this.perObjectFrustumCulled;
				object.sortObjects = this.sortObjects;

				object.drawRanges = this._drawRanges;
				object.reservedRanges = this._reservedRanges;

				object.visibility = this._visibility;
				object.active = this._active;
				object.bounds = this._bounds.map( bound => ( {
					boxInitialized: bound.boxInitialized,
					boxMin: bound.box.min.toArray(),
					boxMax: bound.box.max.toArray(),

					sphereInitialized: bound.sphereInitialized,
					sphereRadius: bound.sphere.radius,
					sphereCenter: bound.sphere.center.toArray()
				} ) );

				object.maxGeometryCount = this._maxGeometryCount;
				object.maxVertexCount = this._maxVertexCount;
				object.maxIndexCount = this._maxIndexCount;

				object.geometryInitialized = this._geometryInitialized;
				object.geometryCount = this._geometryCount;

				object.matricesTexture = this._matricesTexture.toJSON( meta );

				if ( this.boundingSphere !== null ) {

					object.boundingSphere = {
						center: object.boundingSphere.center.toArray(),
						radius: object.boundingSphere.radius
					};

				}

				if ( this.boundingBox !== null ) {

					object.boundingBox = {
						min: object.boundingBox.min.toArray(),
						max: object.boundingBox.max.toArray()
					};

				}

			}

			//

			function serialize( library, element ) {

				if ( library[ element.uuid ] === undefined ) {

					library[ element.uuid ] = element.toJSON( meta );

				}

				return element.uuid;

			}

			if ( this.isScene ) {

				if ( this.background ) {

					if ( this.background.isColor ) {

						object.background = this.background.toJSON();

					} else if ( this.background.isTexture ) {

						object.background = this.background.toJSON( meta ).uuid;

					}

				}

				if ( this.environment && this.environment.isTexture && this.environment.isRenderTargetTexture !== true ) {

					object.environment = this.environment.toJSON( meta ).uuid;

				}

			} else if ( this.isMesh || this.isLine || this.isPoints ) {

				object.geometry = serialize( meta.geometries, this.geometry );

				const parameters = this.geometry.parameters;

				if ( parameters !== undefined && parameters.shapes !== undefined ) {

					const shapes = parameters.shapes;

					if ( Array.isArray( shapes ) ) {

						for ( let i = 0, l = shapes.length; i < l; i ++ ) {

							const shape = shapes[ i ];

							serialize( meta.shapes, shape );

						}

					} else {

						serialize( meta.shapes, shapes );

					}

				}

			}

			if ( this.isSkinnedMesh ) {

				object.bindMode = this.bindMode;
				object.bindMatrix = this.bindMatrix.toArray();

				if ( this.skeleton !== undefined ) {

					serialize( meta.skeletons, this.skeleton );

					object.skeleton = this.skeleton.uuid;

				}

			}

			if ( this.material !== undefined ) {

				if ( Array.isArray( this.material ) ) {

					const uuids = [];

					for ( let i = 0, l = this.material.length; i < l; i ++ ) {

						uuids.push( serialize( meta.materials, this.material[ i ] ) );

					}

					object.material = uuids;

				} else {

					object.material = serialize( meta.materials, this.material );

				}

			}

			//

			if ( this.children.length > 0 ) {

				object.children = [];

				for ( let i = 0; i < this.children.length; i ++ ) {

					object.children.push( this.children[ i ].toJSON( meta ).object );

				}

			}

			//

			if ( this.animations.length > 0 ) {

				object.animations = [];

				for ( let i = 0; i < this.animations.length; i ++ ) {

					const animation = this.animations[ i ];

					object.animations.push( serialize( meta.animations, animation ) );

				}

			}

			if ( isRootObject ) {

				const geometries = extractFromCache( meta.geometries );
				const materials = extractFromCache( meta.materials );
				const textures = extractFromCache( meta.textures );
				const images = extractFromCache( meta.images );
				const shapes = extractFromCache( meta.shapes );
				const skeletons = extractFromCache( meta.skeletons );
				const animations = extractFromCache( meta.animations );
				const nodes = extractFromCache( meta.nodes );

				if ( geometries.length > 0 ) output.geometries = geometries;
				if ( materials.length > 0 ) output.materials = materials;
				if ( textures.length > 0 ) output.textures = textures;
				if ( images.length > 0 ) output.images = images;
				if ( shapes.length > 0 ) output.shapes = shapes;
				if ( skeletons.length > 0 ) output.skeletons = skeletons;
				if ( animations.length > 0 ) output.animations = animations;
				if ( nodes.length > 0 ) output.nodes = nodes;

			}

			output.object = object;

			return output;

			// extract data from the cache hash
			// remove metadata on each item
			// and return as array
			function extractFromCache( cache ) {

				const values = [];
				for ( const key in cache ) {

					const data = cache[ key ];
					delete data.metadata;
					values.push( data );

				}

				return values;

			}

		}

		clone( recursive ) {

			return new this.constructor().copy( this, recursive );

		}

		copy( source, recursive = true ) {

			this.name = source.name;

			this.up.copy( source.up );

			this.position.copy( source.position );
			this.rotation.order = source.rotation.order;
			this.quaternion.copy( source.quaternion );
			this.scale.copy( source.scale );

			this.matrix.copy( source.matrix );
			this.matrixWorld.copy( source.matrixWorld );

			this.matrixAutoUpdate = source.matrixAutoUpdate;

			this.matrixWorldAutoUpdate = source.matrixWorldAutoUpdate;
			this.matrixWorldNeedsUpdate = source.matrixWorldNeedsUpdate;

			this.layers.mask = source.layers.mask;
			this.visible = source.visible;

			this.castShadow = source.castShadow;
			this.receiveShadow = source.receiveShadow;

			this.frustumCulled = source.frustumCulled;
			this.renderOrder = source.renderOrder;

			this.animations = source.animations.slice();

			this.userData = JSON.parse( JSON.stringify( source.userData ) );

			if ( recursive === true ) {

				for ( let i = 0; i < source.children.length; i ++ ) {

					const child = source.children[ i ];
					this.add( child.clone() );

				}

			}

			return this;

		}

	}

	Object3D.DEFAULT_UP = /*@__PURE__*/ new Vector3( 0, 1, 0 );
	Object3D.DEFAULT_MATRIX_AUTO_UPDATE = true;
	Object3D.DEFAULT_MATRIX_WORLD_AUTO_UPDATE = true;

	const _v0 = /*@__PURE__*/ new Vector3();
	const _v1 = /*@__PURE__*/ new Vector3();
	const _v2 = /*@__PURE__*/ new Vector3();
	const _v3$1 = /*@__PURE__*/ new Vector3();

	const _vab = /*@__PURE__*/ new Vector3();
	const _vac = /*@__PURE__*/ new Vector3();
	const _vbc = /*@__PURE__*/ new Vector3();
	const _vap = /*@__PURE__*/ new Vector3();
	const _vbp = /*@__PURE__*/ new Vector3();
	const _vcp = /*@__PURE__*/ new Vector3();

	class Triangle {

		constructor( a = new Vector3(), b = new Vector3(), c = new Vector3() ) {

			this.a = a;
			this.b = b;
			this.c = c;

		}

		static getNormal( a, b, c, target ) {

			target.subVectors( c, b );
			_v0.subVectors( a, b );
			target.cross( _v0 );

			const targetLengthSq = target.lengthSq();
			if ( targetLengthSq > 0 ) {

				return target.multiplyScalar( 1 / Math.sqrt( targetLengthSq ) );

			}

			return target.set( 0, 0, 0 );

		}

		// static/instance method to calculate barycentric coordinates
		// based on: http://www.blackpawn.com/texts/pointinpoly/default.html
		static getBarycoord( point, a, b, c, target ) {

			_v0.subVectors( c, a );
			_v1.subVectors( b, a );
			_v2.subVectors( point, a );

			const dot00 = _v0.dot( _v0 );
			const dot01 = _v0.dot( _v1 );
			const dot02 = _v0.dot( _v2 );
			const dot11 = _v1.dot( _v1 );
			const dot12 = _v1.dot( _v2 );

			const denom = ( dot00 * dot11 - dot01 * dot01 );

			// collinear or singular triangle
			if ( denom === 0 ) {

				target.set( 0, 0, 0 );
				return null;

			}

			const invDenom = 1 / denom;
			const u = ( dot11 * dot02 - dot01 * dot12 ) * invDenom;
			const v = ( dot00 * dot12 - dot01 * dot02 ) * invDenom;

			// barycentric coordinates must always sum to 1
			return target.set( 1 - u - v, v, u );

		}

		static containsPoint( point, a, b, c ) {

			// if the triangle is degenerate then we can't contain a point
			if ( this.getBarycoord( point, a, b, c, _v3$1 ) === null ) {

				return false;

			}

			return ( _v3$1.x >= 0 ) && ( _v3$1.y >= 0 ) && ( ( _v3$1.x + _v3$1.y ) <= 1 );

		}

		static getInterpolation( point, p1, p2, p3, v1, v2, v3, target ) {

			if ( this.getBarycoord( point, p1, p2, p3, _v3$1 ) === null ) {

				target.x = 0;
				target.y = 0;
				if ( 'z' in target ) target.z = 0;
				if ( 'w' in target ) target.w = 0;
				return null;

			}

			target.setScalar( 0 );
			target.addScaledVector( v1, _v3$1.x );
			target.addScaledVector( v2, _v3$1.y );
			target.addScaledVector( v3, _v3$1.z );

			return target;

		}

		static isFrontFacing( a, b, c, direction ) {

			_v0.subVectors( c, b );
			_v1.subVectors( a, b );

			// strictly front facing
			return ( _v0.cross( _v1 ).dot( direction ) < 0 ) ? true : false;

		}

		set( a, b, c ) {

			this.a.copy( a );
			this.b.copy( b );
			this.c.copy( c );

			return this;

		}

		setFromPointsAndIndices( points, i0, i1, i2 ) {

			this.a.copy( points[ i0 ] );
			this.b.copy( points[ i1 ] );
			this.c.copy( points[ i2 ] );

			return this;

		}

		setFromAttributeAndIndices( attribute, i0, i1, i2 ) {

			this.a.fromBufferAttribute( attribute, i0 );
			this.b.fromBufferAttribute( attribute, i1 );
			this.c.fromBufferAttribute( attribute, i2 );

			return this;

		}

		clone() {

			return new this.constructor().copy( this );

		}

		copy( triangle ) {

			this.a.copy( triangle.a );
			this.b.copy( triangle.b );
			this.c.copy( triangle.c );

			return this;

		}

		getArea() {

			_v0.subVectors( this.c, this.b );
			_v1.subVectors( this.a, this.b );

			return _v0.cross( _v1 ).length() * 0.5;

		}

		getMidpoint( target ) {

			return target.addVectors( this.a, this.b ).add( this.c ).multiplyScalar( 1 / 3 );

		}

		getNormal( target ) {

			return Triangle.getNormal( this.a, this.b, this.c, target );

		}

		getPlane( target ) {

			return target.setFromCoplanarPoints( this.a, this.b, this.c );

		}

		getBarycoord( point, target ) {

			return Triangle.getBarycoord( point, this.a, this.b, this.c, target );

		}

		getInterpolation( point, v1, v2, v3, target ) {

			return Triangle.getInterpolation( point, this.a, this.b, this.c, v1, v2, v3, target );

		}

		containsPoint( point ) {

			return Triangle.containsPoint( point, this.a, this.b, this.c );

		}

		isFrontFacing( direction ) {

			return Triangle.isFrontFacing( this.a, this.b, this.c, direction );

		}

		intersectsBox( box ) {

			return box.intersectsTriangle( this );

		}

		closestPointToPoint( p, target ) {

			const a = this.a, b = this.b, c = this.c;
			let v, w;

			// algorithm thanks to Real-Time Collision Detection by Christer Ericson,
			// published by Morgan Kaufmann Publishers, (c) 2005 Elsevier Inc.,
			// under the accompanying license; see chapter 5.1.5 for detailed explanation.
			// basically, we're distinguishing which of the voronoi regions of the triangle
			// the point lies in with the minimum amount of redundant computation.

			_vab.subVectors( b, a );
			_vac.subVectors( c, a );
			_vap.subVectors( p, a );
			const d1 = _vab.dot( _vap );
			const d2 = _vac.dot( _vap );
			if ( d1 <= 0 && d2 <= 0 ) {

				// vertex region of A; barycentric coords (1, 0, 0)
				return target.copy( a );

			}

			_vbp.subVectors( p, b );
			const d3 = _vab.dot( _vbp );
			const d4 = _vac.dot( _vbp );
			if ( d3 >= 0 && d4 <= d3 ) {

				// vertex region of B; barycentric coords (0, 1, 0)
				return target.copy( b );

			}

			const vc = d1 * d4 - d3 * d2;
			if ( vc <= 0 && d1 >= 0 && d3 <= 0 ) {

				v = d1 / ( d1 - d3 );
				// edge region of AB; barycentric coords (1-v, v, 0)
				return target.copy( a ).addScaledVector( _vab, v );

			}

			_vcp.subVectors( p, c );
			const d5 = _vab.dot( _vcp );
			const d6 = _vac.dot( _vcp );
			if ( d6 >= 0 && d5 <= d6 ) {

				// vertex region of C; barycentric coords (0, 0, 1)
				return target.copy( c );

			}

			const vb = d5 * d2 - d1 * d6;
			if ( vb <= 0 && d2 >= 0 && d6 <= 0 ) {

				w = d2 / ( d2 - d6 );
				// edge region of AC; barycentric coords (1-w, 0, w)
				return target.copy( a ).addScaledVector( _vac, w );

			}

			const va = d3 * d6 - d5 * d4;
			if ( va <= 0 && ( d4 - d3 ) >= 0 && ( d5 - d6 ) >= 0 ) {

				_vbc.subVectors( c, b );
				w = ( d4 - d3 ) / ( ( d4 - d3 ) + ( d5 - d6 ) );
				// edge region of BC; barycentric coords (0, 1-w, w)
				return target.copy( b ).addScaledVector( _vbc, w ); // edge region of BC

			}

			// face region
			const denom = 1 / ( va + vb + vc );
			// u = va * denom
			v = vb * denom;
			w = vc * denom;

			return target.copy( a ).addScaledVector( _vab, v ).addScaledVector( _vac, w );

		}

		equals( triangle ) {

			return triangle.a.equals( this.a ) && triangle.b.equals( this.b ) && triangle.c.equals( this.c );

		}

	}

	const _colorKeywords = { 'aliceblue': 0xF0F8FF, 'antiquewhite': 0xFAEBD7, 'aqua': 0x00FFFF, 'aquamarine': 0x7FFFD4, 'azure': 0xF0FFFF,
		'beige': 0xF5F5DC, 'bisque': 0xFFE4C4, 'black': 0x000000, 'blanchedalmond': 0xFFEBCD, 'blue': 0x0000FF, 'blueviolet': 0x8A2BE2,
		'brown': 0xA52A2A, 'burlywood': 0xDEB887, 'cadetblue': 0x5F9EA0, 'chartreuse': 0x7FFF00, 'chocolate': 0xD2691E, 'coral': 0xFF7F50,
		'cornflowerblue': 0x6495ED, 'cornsilk': 0xFFF8DC, 'crimson': 0xDC143C, 'cyan': 0x00FFFF, 'darkblue': 0x00008B, 'darkcyan': 0x008B8B,
		'darkgoldenrod': 0xB8860B, 'darkgray': 0xA9A9A9, 'darkgreen': 0x006400, 'darkgrey': 0xA9A9A9, 'darkkhaki': 0xBDB76B, 'darkmagenta': 0x8B008B,
		'darkolivegreen': 0x556B2F, 'darkorange': 0xFF8C00, 'darkorchid': 0x9932CC, 'darkred': 0x8B0000, 'darksalmon': 0xE9967A, 'darkseagreen': 0x8FBC8F,
		'darkslateblue': 0x483D8B, 'darkslategray': 0x2F4F4F, 'darkslategrey': 0x2F4F4F, 'darkturquoise': 0x00CED1, 'darkviolet': 0x9400D3,
		'deeppink': 0xFF1493, 'deepskyblue': 0x00BFFF, 'dimgray': 0x696969, 'dimgrey': 0x696969, 'dodgerblue': 0x1E90FF, 'firebrick': 0xB22222,
		'floralwhite': 0xFFFAF0, 'forestgreen': 0x228B22, 'fuchsia': 0xFF00FF, 'gainsboro': 0xDCDCDC, 'ghostwhite': 0xF8F8FF, 'gold': 0xFFD700,
		'goldenrod': 0xDAA520, 'gray': 0x808080, 'green': 0x008000, 'greenyellow': 0xADFF2F, 'grey': 0x808080, 'honeydew': 0xF0FFF0, 'hotpink': 0xFF69B4,
		'indianred': 0xCD5C5C, 'indigo': 0x4B0082, 'ivory': 0xFFFFF0, 'khaki': 0xF0E68C, 'lavender': 0xE6E6FA, 'lavenderblush': 0xFFF0F5, 'lawngreen': 0x7CFC00,
		'lemonchiffon': 0xFFFACD, 'lightblue': 0xADD8E6, 'lightcoral': 0xF08080, 'lightcyan': 0xE0FFFF, 'lightgoldenrodyellow': 0xFAFAD2, 'lightgray': 0xD3D3D3,
		'lightgreen': 0x90EE90, 'lightgrey': 0xD3D3D3, 'lightpink': 0xFFB6C1, 'lightsalmon': 0xFFA07A, 'lightseagreen': 0x20B2AA, 'lightskyblue': 0x87CEFA,
		'lightslategray': 0x778899, 'lightslategrey': 0x778899, 'lightsteelblue': 0xB0C4DE, 'lightyellow': 0xFFFFE0, 'lime': 0x00FF00, 'limegreen': 0x32CD32,
		'linen': 0xFAF0E6, 'magenta': 0xFF00FF, 'maroon': 0x800000, 'mediumaquamarine': 0x66CDAA, 'mediumblue': 0x0000CD, 'mediumorchid': 0xBA55D3,
		'mediumpurple': 0x9370DB, 'mediumseagreen': 0x3CB371, 'mediumslateblue': 0x7B68EE, 'mediumspringgreen': 0x00FA9A, 'mediumturquoise': 0x48D1CC,
		'mediumvioletred': 0xC71585, 'midnightblue': 0x191970, 'mintcream': 0xF5FFFA, 'mistyrose': 0xFFE4E1, 'moccasin': 0xFFE4B5, 'navajowhite': 0xFFDEAD,
		'navy': 0x000080, 'oldlace': 0xFDF5E6, 'olive': 0x808000, 'olivedrab': 0x6B8E23, 'orange': 0xFFA500, 'orangered': 0xFF4500, 'orchid': 0xDA70D6,
		'palegoldenrod': 0xEEE8AA, 'palegreen': 0x98FB98, 'paleturquoise': 0xAFEEEE, 'palevioletred': 0xDB7093, 'papayawhip': 0xFFEFD5, 'peachpuff': 0xFFDAB9,
		'peru': 0xCD853F, 'pink': 0xFFC0CB, 'plum': 0xDDA0DD, 'powderblue': 0xB0E0E6, 'purple': 0x800080, 'rebeccapurple': 0x663399, 'red': 0xFF0000, 'rosybrown': 0xBC8F8F,
		'royalblue': 0x4169E1, 'saddlebrown': 0x8B4513, 'salmon': 0xFA8072, 'sandybrown': 0xF4A460, 'seagreen': 0x2E8B57, 'seashell': 0xFFF5EE,
		'sienna': 0xA0522D, 'silver': 0xC0C0C0, 'skyblue': 0x87CEEB, 'slateblue': 0x6A5ACD, 'slategray': 0x708090, 'slategrey': 0x708090, 'snow': 0xFFFAFA,
		'springgreen': 0x00FF7F, 'steelblue': 0x4682B4, 'tan': 0xD2B48C, 'teal': 0x008080, 'thistle': 0xD8BFD8, 'tomato': 0xFF6347, 'turquoise': 0x40E0D0,
		'violet': 0xEE82EE, 'wheat': 0xF5DEB3, 'white': 0xFFFFFF, 'whitesmoke': 0xF5F5F5, 'yellow': 0xFFFF00, 'yellowgreen': 0x9ACD32 };

	const _hslA = { h: 0, s: 0, l: 0 };
	const _hslB = { h: 0, s: 0, l: 0 };

	function hue2rgb( p, q, t ) {

		if ( t < 0 ) t += 1;
		if ( t > 1 ) t -= 1;
		if ( t < 1 / 6 ) return p + ( q - p ) * 6 * t;
		if ( t < 1 / 2 ) return q;
		if ( t < 2 / 3 ) return p + ( q - p ) * 6 * ( 2 / 3 - t );
		return p;

	}

	class Color {

		constructor( r, g, b ) {

			this.isColor = true;

			this.r = 1;
			this.g = 1;
			this.b = 1;

			return this.set( r, g, b );

		}

		set( r, g, b ) {

			if ( g === undefined && b === undefined ) {

				// r is THREE.Color, hex or string

				const value = r;

				if ( value && value.isColor ) {

					this.copy( value );

				} else if ( typeof value === 'number' ) {

					this.setHex( value );

				} else if ( typeof value === 'string' ) {

					this.setStyle( value );

				}

			} else {

				this.setRGB( r, g, b );

			}

			return this;

		}

		setScalar( scalar ) {

			this.r = scalar;
			this.g = scalar;
			this.b = scalar;

			return this;

		}

		setHex( hex, colorSpace = SRGBColorSpace ) {

			hex = Math.floor( hex );

			this.r = ( hex >> 16 & 255 ) / 255;
			this.g = ( hex >> 8 & 255 ) / 255;
			this.b = ( hex & 255 ) / 255;

			ColorManagement.toWorkingColorSpace( this, colorSpace );

			return this;

		}

		setRGB( r, g, b, colorSpace = ColorManagement.workingColorSpace ) {

			this.r = r;
			this.g = g;
			this.b = b;

			ColorManagement.toWorkingColorSpace( this, colorSpace );

			return this;

		}

		setHSL( h, s, l, colorSpace = ColorManagement.workingColorSpace ) {

			// h,s,l ranges are in 0.0 - 1.0
			h = euclideanModulo( h, 1 );
			s = clamp( s, 0, 1 );
			l = clamp( l, 0, 1 );

			if ( s === 0 ) {

				this.r = this.g = this.b = l;

			} else {

				const p = l <= 0.5 ? l * ( 1 + s ) : l + s - ( l * s );
				const q = ( 2 * l ) - p;

				this.r = hue2rgb( q, p, h + 1 / 3 );
				this.g = hue2rgb( q, p, h );
				this.b = hue2rgb( q, p, h - 1 / 3 );

			}

			ColorManagement.toWorkingColorSpace( this, colorSpace );

			return this;

		}

		setStyle( style, colorSpace = SRGBColorSpace ) {

			function handleAlpha( string ) {

				if ( string === undefined ) return;

				if ( parseFloat( string ) < 1 ) {

					console.warn( 'THREE.Color: Alpha component of ' + style + ' will be ignored.' );

				}

			}


			let m;

			if ( m = /^(\w+)\(([^\)]*)\)/.exec( style ) ) {

				// rgb / hsl

				let color;
				const name = m[ 1 ];
				const components = m[ 2 ];

				switch ( name ) {

					case 'rgb':
					case 'rgba':

						if ( color = /^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec( components ) ) {

							// rgb(255,0,0) rgba(255,0,0,0.5)

							handleAlpha( color[ 4 ] );

							return this.setRGB(
								Math.min( 255, parseInt( color[ 1 ], 10 ) ) / 255,
								Math.min( 255, parseInt( color[ 2 ], 10 ) ) / 255,
								Math.min( 255, parseInt( color[ 3 ], 10 ) ) / 255,
								colorSpace
							);

						}

						if ( color = /^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec( components ) ) {

							// rgb(100%,0%,0%) rgba(100%,0%,0%,0.5)

							handleAlpha( color[ 4 ] );

							return this.setRGB(
								Math.min( 100, parseInt( color[ 1 ], 10 ) ) / 100,
								Math.min( 100, parseInt( color[ 2 ], 10 ) ) / 100,
								Math.min( 100, parseInt( color[ 3 ], 10 ) ) / 100,
								colorSpace
							);

						}

						break;

					case 'hsl':
					case 'hsla':

						if ( color = /^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec( components ) ) {

							// hsl(120,50%,50%) hsla(120,50%,50%,0.5)

							handleAlpha( color[ 4 ] );

							return this.setHSL(
								parseFloat( color[ 1 ] ) / 360,
								parseFloat( color[ 2 ] ) / 100,
								parseFloat( color[ 3 ] ) / 100,
								colorSpace
							);

						}

						break;

					default:

						console.warn( 'THREE.Color: Unknown color model ' + style );

				}

			} else if ( m = /^\#([A-Fa-f\d]+)$/.exec( style ) ) {

				// hex color

				const hex = m[ 1 ];
				const size = hex.length;

				if ( size === 3 ) {

					// #ff0
					return this.setRGB(
						parseInt( hex.charAt( 0 ), 16 ) / 15,
						parseInt( hex.charAt( 1 ), 16 ) / 15,
						parseInt( hex.charAt( 2 ), 16 ) / 15,
						colorSpace
					);

				} else if ( size === 6 ) {

					// #ff0000
					return this.setHex( parseInt( hex, 16 ), colorSpace );

				} else {

					console.warn( 'THREE.Color: Invalid hex color ' + style );

				}

			} else if ( style && style.length > 0 ) {

				return this.setColorName( style, colorSpace );

			}

			return this;

		}

		setColorName( style, colorSpace = SRGBColorSpace ) {

			// color keywords
			const hex = _colorKeywords[ style.toLowerCase() ];

			if ( hex !== undefined ) {

				// red
				this.setHex( hex, colorSpace );

			} else {

				// unknown color
				console.warn( 'THREE.Color: Unknown color ' + style );

			}

			return this;

		}

		clone() {

			return new this.constructor( this.r, this.g, this.b );

		}

		copy( color ) {

			this.r = color.r;
			this.g = color.g;
			this.b = color.b;

			return this;

		}

		copySRGBToLinear( color ) {

			this.r = SRGBToLinear( color.r );
			this.g = SRGBToLinear( color.g );
			this.b = SRGBToLinear( color.b );

			return this;

		}

		copyLinearToSRGB( color ) {

			this.r = LinearToSRGB( color.r );
			this.g = LinearToSRGB( color.g );
			this.b = LinearToSRGB( color.b );

			return this;

		}

		convertSRGBToLinear() {

			this.copySRGBToLinear( this );

			return this;

		}

		convertLinearToSRGB() {

			this.copyLinearToSRGB( this );

			return this;

		}

		getHex( colorSpace = SRGBColorSpace ) {

			ColorManagement.fromWorkingColorSpace( _color.copy( this ), colorSpace );

			return Math.round( clamp( _color.r * 255, 0, 255 ) ) * 65536 + Math.round( clamp( _color.g * 255, 0, 255 ) ) * 256 + Math.round( clamp( _color.b * 255, 0, 255 ) );

		}

		getHexString( colorSpace = SRGBColorSpace ) {

			return ( '000000' + this.getHex( colorSpace ).toString( 16 ) ).slice( - 6 );

		}

		getHSL( target, colorSpace = ColorManagement.workingColorSpace ) {

			// h,s,l ranges are in 0.0 - 1.0

			ColorManagement.fromWorkingColorSpace( _color.copy( this ), colorSpace );

			const r = _color.r, g = _color.g, b = _color.b;

			const max = Math.max( r, g, b );
			const min = Math.min( r, g, b );

			let hue, saturation;
			const lightness = ( min + max ) / 2.0;

			if ( min === max ) {

				hue = 0;
				saturation = 0;

			} else {

				const delta = max - min;

				saturation = lightness <= 0.5 ? delta / ( max + min ) : delta / ( 2 - max - min );

				switch ( max ) {

					case r: hue = ( g - b ) / delta + ( g < b ? 6 : 0 ); break;
					case g: hue = ( b - r ) / delta + 2; break;
					case b: hue = ( r - g ) / delta + 4; break;

				}

				hue /= 6;

			}

			target.h = hue;
			target.s = saturation;
			target.l = lightness;

			return target;

		}

		getRGB( target, colorSpace = ColorManagement.workingColorSpace ) {

			ColorManagement.fromWorkingColorSpace( _color.copy( this ), colorSpace );

			target.r = _color.r;
			target.g = _color.g;
			target.b = _color.b;

			return target;

		}

		getStyle( colorSpace = SRGBColorSpace ) {

			ColorManagement.fromWorkingColorSpace( _color.copy( this ), colorSpace );

			const r = _color.r, g = _color.g, b = _color.b;

			if ( colorSpace !== SRGBColorSpace ) {

				// Requires CSS Color Module Level 4 (https://www.w3.org/TR/css-color-4/).
				return `color(${ colorSpace } ${ r.toFixed( 3 ) } ${ g.toFixed( 3 ) } ${ b.toFixed( 3 ) })`;

			}

			return `rgb(${ Math.round( r * 255 ) },${ Math.round( g * 255 ) },${ Math.round( b * 255 ) })`;

		}

		offsetHSL( h, s, l ) {

			this.getHSL( _hslA );

			return this.setHSL( _hslA.h + h, _hslA.s + s, _hslA.l + l );

		}

		add( color ) {

			this.r += color.r;
			this.g += color.g;
			this.b += color.b;

			return this;

		}

		addColors( color1, color2 ) {

			this.r = color1.r + color2.r;
			this.g = color1.g + color2.g;
			this.b = color1.b + color2.b;

			return this;

		}

		addScalar( s ) {

			this.r += s;
			this.g += s;
			this.b += s;

			return this;

		}

		sub( color ) {

			this.r = Math.max( 0, this.r - color.r );
			this.g = Math.max( 0, this.g - color.g );
			this.b = Math.max( 0, this.b - color.b );

			return this;

		}

		multiply( color ) {

			this.r *= color.r;
			this.g *= color.g;
			this.b *= color.b;

			return this;

		}

		multiplyScalar( s ) {

			this.r *= s;
			this.g *= s;
			this.b *= s;

			return this;

		}

		lerp( color, alpha ) {

			this.r += ( color.r - this.r ) * alpha;
			this.g += ( color.g - this.g ) * alpha;
			this.b += ( color.b - this.b ) * alpha;

			return this;

		}

		lerpColors( color1, color2, alpha ) {

			this.r = color1.r + ( color2.r - color1.r ) * alpha;
			this.g = color1.g + ( color2.g - color1.g ) * alpha;
			this.b = color1.b + ( color2.b - color1.b ) * alpha;

			return this;

		}

		lerpHSL( color, alpha ) {

			this.getHSL( _hslA );
			color.getHSL( _hslB );

			const h = lerp( _hslA.h, _hslB.h, alpha );
			const s = lerp( _hslA.s, _hslB.s, alpha );
			const l = lerp( _hslA.l, _hslB.l, alpha );

			this.setHSL( h, s, l );

			return this;

		}

		setFromVector3( v ) {

			this.r = v.x;
			this.g = v.y;
			this.b = v.z;

			return this;

		}

		applyMatrix3( m ) {

			const r = this.r, g = this.g, b = this.b;
			const e = m.elements;

			this.r = e[ 0 ] * r + e[ 3 ] * g + e[ 6 ] * b;
			this.g = e[ 1 ] * r + e[ 4 ] * g + e[ 7 ] * b;
			this.b = e[ 2 ] * r + e[ 5 ] * g + e[ 8 ] * b;

			return this;

		}

		equals( c ) {

			return ( c.r === this.r ) && ( c.g === this.g ) && ( c.b === this.b );

		}

		fromArray( array, offset = 0 ) {

			this.r = array[ offset ];
			this.g = array[ offset + 1 ];
			this.b = array[ offset + 2 ];

			return this;

		}

		toArray( array = [], offset = 0 ) {

			array[ offset ] = this.r;
			array[ offset + 1 ] = this.g;
			array[ offset + 2 ] = this.b;

			return array;

		}

		fromBufferAttribute( attribute, index ) {

			this.r = attribute.getX( index );
			this.g = attribute.getY( index );
			this.b = attribute.getZ( index );

			return this;

		}

		toJSON() {

			return this.getHex();

		}

		*[ Symbol.iterator ]() {

			yield this.r;
			yield this.g;
			yield this.b;

		}

	}

	const _color = /*@__PURE__*/ new Color();

	Color.NAMES = _colorKeywords;

	let _materialId = 0;

	class Material extends EventDispatcher {

		constructor() {

			super();

			this.isMaterial = true;

			Object.defineProperty( this, 'id', { value: _materialId ++ } );

			this.uuid = generateUUID();

			this.name = '';
			this.type = 'Material';

			this.blending = NormalBlending;
			this.side = FrontSide;
			this.vertexColors = false;

			this.opacity = 1;
			this.transparent = false;
			this.alphaHash = false;

			this.blendSrc = SrcAlphaFactor;
			this.blendDst = OneMinusSrcAlphaFactor;
			this.blendEquation = AddEquation;
			this.blendSrcAlpha = null;
			this.blendDstAlpha = null;
			this.blendEquationAlpha = null;
			this.blendColor = new Color( 0, 0, 0 );
			this.blendAlpha = 0;

			this.depthFunc = LessEqualDepth;
			this.depthTest = true;
			this.depthWrite = true;

			this.stencilWriteMask = 0xff;
			this.stencilFunc = AlwaysStencilFunc;
			this.stencilRef = 0;
			this.stencilFuncMask = 0xff;
			this.stencilFail = KeepStencilOp;
			this.stencilZFail = KeepStencilOp;
			this.stencilZPass = KeepStencilOp;
			this.stencilWrite = false;

			this.clippingPlanes = null;
			this.clipIntersection = false;
			this.clipShadows = false;

			this.shadowSide = null;

			this.colorWrite = true;

			this.precision = null; // override the renderer's default precision for this material

			this.polygonOffset = false;
			this.polygonOffsetFactor = 0;
			this.polygonOffsetUnits = 0;

			this.dithering = false;

			this.alphaToCoverage = false;
			this.premultipliedAlpha = false;
			this.forceSinglePass = false;

			this.visible = true;

			this.toneMapped = true;

			this.userData = {};

			this.version = 0;

			this._alphaTest = 0;

		}

		get alphaTest() {

			return this._alphaTest;

		}

		set alphaTest( value ) {

			if ( this._alphaTest > 0 !== value > 0 ) {

				this.version ++;

			}

			this._alphaTest = value;

		}

		onBuild( /* shaderobject, renderer */ ) {}

		onBeforeRender( /* renderer, scene, camera, geometry, object, group */ ) {}

		onBeforeCompile( /* shaderobject, renderer */ ) {}

		customProgramCacheKey() {

			return this.onBeforeCompile.toString();

		}

		setValues( values ) {

			if ( values === undefined ) return;

			for ( const key in values ) {

				const newValue = values[ key ];

				if ( newValue === undefined ) {

					console.warn( `THREE.Material: parameter '${ key }' has value of undefined.` );
					continue;

				}

				const currentValue = this[ key ];

				if ( currentValue === undefined ) {

					console.warn( `THREE.Material: '${ key }' is not a property of THREE.${ this.type }.` );
					continue;

				}

				if ( currentValue && currentValue.isColor ) {

					currentValue.set( newValue );

				} else if ( ( currentValue && currentValue.isVector3 ) && ( newValue && newValue.isVector3 ) ) {

					currentValue.copy( newValue );

				} else {

					this[ key ] = newValue;

				}

			}

		}

		toJSON( meta ) {

			const isRootObject = ( meta === undefined || typeof meta === 'string' );

			if ( isRootObject ) {

				meta = {
					textures: {},
					images: {}
				};

			}

			const data = {
				metadata: {
					version: 4.6,
					type: 'Material',
					generator: 'Material.toJSON'
				}
			};

			// standard Material serialization
			data.uuid = this.uuid;
			data.type = this.type;

			if ( this.name !== '' ) data.name = this.name;

			if ( this.color && this.color.isColor ) data.color = this.color.getHex();

			if ( this.roughness !== undefined ) data.roughness = this.roughness;
			if ( this.metalness !== undefined ) data.metalness = this.metalness;

			if ( this.sheen !== undefined ) data.sheen = this.sheen;
			if ( this.sheenColor && this.sheenColor.isColor ) data.sheenColor = this.sheenColor.getHex();
			if ( this.sheenRoughness !== undefined ) data.sheenRoughness = this.sheenRoughness;
			if ( this.emissive && this.emissive.isColor ) data.emissive = this.emissive.getHex();
			if ( this.emissiveIntensity !== undefined && this.emissiveIntensity !== 1 ) data.emissiveIntensity = this.emissiveIntensity;

			if ( this.specular && this.specular.isColor ) data.specular = this.specular.getHex();
			if ( this.specularIntensity !== undefined ) data.specularIntensity = this.specularIntensity;
			if ( this.specularColor && this.specularColor.isColor ) data.specularColor = this.specularColor.getHex();
			if ( this.shininess !== undefined ) data.shininess = this.shininess;
			if ( this.clearcoat !== undefined ) data.clearcoat = this.clearcoat;
			if ( this.clearcoatRoughness !== undefined ) data.clearcoatRoughness = this.clearcoatRoughness;

			if ( this.clearcoatMap && this.clearcoatMap.isTexture ) {

				data.clearcoatMap = this.clearcoatMap.toJSON( meta ).uuid;

			}

			if ( this.clearcoatRoughnessMap && this.clearcoatRoughnessMap.isTexture ) {

				data.clearcoatRoughnessMap = this.clearcoatRoughnessMap.toJSON( meta ).uuid;

			}

			if ( this.clearcoatNormalMap && this.clearcoatNormalMap.isTexture ) {

				data.clearcoatNormalMap = this.clearcoatNormalMap.toJSON( meta ).uuid;
				data.clearcoatNormalScale = this.clearcoatNormalScale.toArray();

			}

			if ( this.iridescence !== undefined ) data.iridescence = this.iridescence;
			if ( this.iridescenceIOR !== undefined ) data.iridescenceIOR = this.iridescenceIOR;
			if ( this.iridescenceThicknessRange !== undefined ) data.iridescenceThicknessRange = this.iridescenceThicknessRange;

			if ( this.iridescenceMap && this.iridescenceMap.isTexture ) {

				data.iridescenceMap = this.iridescenceMap.toJSON( meta ).uuid;

			}

			if ( this.iridescenceThicknessMap && this.iridescenceThicknessMap.isTexture ) {

				data.iridescenceThicknessMap = this.iridescenceThicknessMap.toJSON( meta ).uuid;

			}

			if ( this.anisotropy !== undefined ) data.anisotropy = this.anisotropy;
			if ( this.anisotropyRotation !== undefined ) data.anisotropyRotation = this.anisotropyRotation;

			if ( this.anisotropyMap && this.anisotropyMap.isTexture ) {

				data.anisotropyMap = this.anisotropyMap.toJSON( meta ).uuid;

			}

			if ( this.map && this.map.isTexture ) data.map = this.map.toJSON( meta ).uuid;
			if ( this.matcap && this.matcap.isTexture ) data.matcap = this.matcap.toJSON( meta ).uuid;
			if ( this.alphaMap && this.alphaMap.isTexture ) data.alphaMap = this.alphaMap.toJSON( meta ).uuid;

			if ( this.lightMap && this.lightMap.isTexture ) {

				data.lightMap = this.lightMap.toJSON( meta ).uuid;
				data.lightMapIntensity = this.lightMapIntensity;

			}

			if ( this.aoMap && this.aoMap.isTexture ) {

				data.aoMap = this.aoMap.toJSON( meta ).uuid;
				data.aoMapIntensity = this.aoMapIntensity;

			}

			if ( this.bumpMap && this.bumpMap.isTexture ) {

				data.bumpMap = this.bumpMap.toJSON( meta ).uuid;
				data.bumpScale = this.bumpScale;

			}

			if ( this.normalMap && this.normalMap.isTexture ) {

				data.normalMap = this.normalMap.toJSON( meta ).uuid;
				data.normalMapType = this.normalMapType;
				data.normalScale = this.normalScale.toArray();

			}

			if ( this.displacementMap && this.displacementMap.isTexture ) {

				data.displacementMap = this.displacementMap.toJSON( meta ).uuid;
				data.displacementScale = this.displacementScale;
				data.displacementBias = this.displacementBias;

			}

			if ( this.roughnessMap && this.roughnessMap.isTexture ) data.roughnessMap = this.roughnessMap.toJSON( meta ).uuid;
			if ( this.metalnessMap && this.metalnessMap.isTexture ) data.metalnessMap = this.metalnessMap.toJSON( meta ).uuid;

			if ( this.emissiveMap && this.emissiveMap.isTexture ) data.emissiveMap = this.emissiveMap.toJSON( meta ).uuid;
			if ( this.specularMap && this.specularMap.isTexture ) data.specularMap = this.specularMap.toJSON( meta ).uuid;
			if ( this.specularIntensityMap && this.specularIntensityMap.isTexture ) data.specularIntensityMap = this.specularIntensityMap.toJSON( meta ).uuid;
			if ( this.specularColorMap && this.specularColorMap.isTexture ) data.specularColorMap = this.specularColorMap.toJSON( meta ).uuid;

			if ( this.envMap && this.envMap.isTexture ) {

				data.envMap = this.envMap.toJSON( meta ).uuid;

				if ( this.combine !== undefined ) data.combine = this.combine;

			}

			if ( this.envMapRotation !== undefined ) data.envMapRotation = this.envMapRotation.toArray();
			if ( this.envMapIntensity !== undefined ) data.envMapIntensity = this.envMapIntensity;
			if ( this.reflectivity !== undefined ) data.reflectivity = this.reflectivity;
			if ( this.refractionRatio !== undefined ) data.refractionRatio = this.refractionRatio;

			if ( this.gradientMap && this.gradientMap.isTexture ) {

				data.gradientMap = this.gradientMap.toJSON( meta ).uuid;

			}

			if ( this.transmission !== undefined ) data.transmission = this.transmission;
			if ( this.transmissionMap && this.transmissionMap.isTexture ) data.transmissionMap = this.transmissionMap.toJSON( meta ).uuid;
			if ( this.thickness !== undefined ) data.thickness = this.thickness;
			if ( this.thicknessMap && this.thicknessMap.isTexture ) data.thicknessMap = this.thicknessMap.toJSON( meta ).uuid;
			if ( this.attenuationDistance !== undefined && this.attenuationDistance !== Infinity ) data.attenuationDistance = this.attenuationDistance;
			if ( this.attenuationColor !== undefined ) data.attenuationColor = this.attenuationColor.getHex();

			if ( this.size !== undefined ) data.size = this.size;
			if ( this.shadowSide !== null ) data.shadowSide = this.shadowSide;
			if ( this.sizeAttenuation !== undefined ) data.sizeAttenuation = this.sizeAttenuation;

			if ( this.blending !== NormalBlending ) data.blending = this.blending;
			if ( this.side !== FrontSide ) data.side = this.side;
			if ( this.vertexColors === true ) data.vertexColors = true;

			if ( this.opacity < 1 ) data.opacity = this.opacity;
			if ( this.transparent === true ) data.transparent = true;

			if ( this.blendSrc !== SrcAlphaFactor ) data.blendSrc = this.blendSrc;
			if ( this.blendDst !== OneMinusSrcAlphaFactor ) data.blendDst = this.blendDst;
			if ( this.blendEquation !== AddEquation ) data.blendEquation = this.blendEquation;
			if ( this.blendSrcAlpha !== null ) data.blendSrcAlpha = this.blendSrcAlpha;
			if ( this.blendDstAlpha !== null ) data.blendDstAlpha = this.blendDstAlpha;
			if ( this.blendEquationAlpha !== null ) data.blendEquationAlpha = this.blendEquationAlpha;
			if ( this.blendColor && this.blendColor.isColor ) data.blendColor = this.blendColor.getHex();
			if ( this.blendAlpha !== 0 ) data.blendAlpha = this.blendAlpha;

			if ( this.depthFunc !== LessEqualDepth ) data.depthFunc = this.depthFunc;
			if ( this.depthTest === false ) data.depthTest = this.depthTest;
			if ( this.depthWrite === false ) data.depthWrite = this.depthWrite;
			if ( this.colorWrite === false ) data.colorWrite = this.colorWrite;

			if ( this.stencilWriteMask !== 0xff ) data.stencilWriteMask = this.stencilWriteMask;
			if ( this.stencilFunc !== AlwaysStencilFunc ) data.stencilFunc = this.stencilFunc;
			if ( this.stencilRef !== 0 ) data.stencilRef = this.stencilRef;
			if ( this.stencilFuncMask !== 0xff ) data.stencilFuncMask = this.stencilFuncMask;
			if ( this.stencilFail !== KeepStencilOp ) data.stencilFail = this.stencilFail;
			if ( this.stencilZFail !== KeepStencilOp ) data.stencilZFail = this.stencilZFail;
			if ( this.stencilZPass !== KeepStencilOp ) data.stencilZPass = this.stencilZPass;
			if ( this.stencilWrite === true ) data.stencilWrite = this.stencilWrite;

			// rotation (SpriteMaterial)
			if ( this.rotation !== undefined && this.rotation !== 0 ) data.rotation = this.rotation;

			if ( this.polygonOffset === true ) data.polygonOffset = true;
			if ( this.polygonOffsetFactor !== 0 ) data.polygonOffsetFactor = this.polygonOffsetFactor;
			if ( this.polygonOffsetUnits !== 0 ) data.polygonOffsetUnits = this.polygonOffsetUnits;

			if ( this.linewidth !== undefined && this.linewidth !== 1 ) data.linewidth = this.linewidth;
			if ( this.dashSize !== undefined ) data.dashSize = this.dashSize;
			if ( this.gapSize !== undefined ) data.gapSize = this.gapSize;
			if ( this.scale !== undefined ) data.scale = this.scale;

			if ( this.dithering === true ) data.dithering = true;

			if ( this.alphaTest > 0 ) data.alphaTest = this.alphaTest;
			if ( this.alphaHash === true ) data.alphaHash = true;
			if ( this.alphaToCoverage === true ) data.alphaToCoverage = true;
			if ( this.premultipliedAlpha === true ) data.premultipliedAlpha = true;
			if ( this.forceSinglePass === true ) data.forceSinglePass = true;

			if ( this.wireframe === true ) data.wireframe = true;
			if ( this.wireframeLinewidth > 1 ) data.wireframeLinewidth = this.wireframeLinewidth;
			if ( this.wireframeLinecap !== 'round' ) data.wireframeLinecap = this.wireframeLinecap;
			if ( this.wireframeLinejoin !== 'round' ) data.wireframeLinejoin = this.wireframeLinejoin;

			if ( this.flatShading === true ) data.flatShading = true;

			if ( this.visible === false ) data.visible = false;

			if ( this.toneMapped === false ) data.toneMapped = false;

			if ( this.fog === false ) data.fog = false;

			if ( Object.keys( this.userData ).length > 0 ) data.userData = this.userData;

			// TODO: Copied from Object3D.toJSON

			function extractFromCache( cache ) {

				const values = [];

				for ( const key in cache ) {

					const data = cache[ key ];
					delete data.metadata;
					values.push( data );

				}

				return values;

			}

			if ( isRootObject ) {

				const textures = extractFromCache( meta.textures );
				const images = extractFromCache( meta.images );

				if ( textures.length > 0 ) data.textures = textures;
				if ( images.length > 0 ) data.images = images;

			}

			return data;

		}

		clone() {

			return new this.constructor().copy( this );

		}

		copy( source ) {

			this.name = source.name;

			this.blending = source.blending;
			this.side = source.side;
			this.vertexColors = source.vertexColors;

			this.opacity = source.opacity;
			this.transparent = source.transparent;

			this.blendSrc = source.blendSrc;
			this.blendDst = source.blendDst;
			this.blendEquation = source.blendEquation;
			this.blendSrcAlpha = source.blendSrcAlpha;
			this.blendDstAlpha = source.blendDstAlpha;
			this.blendEquationAlpha = source.blendEquationAlpha;
			this.blendColor.copy( source.blendColor );
			this.blendAlpha = source.blendAlpha;

			this.depthFunc = source.depthFunc;
			this.depthTest = source.depthTest;
			this.depthWrite = source.depthWrite;

			this.stencilWriteMask = source.stencilWriteMask;
			this.stencilFunc = source.stencilFunc;
			this.stencilRef = source.stencilRef;
			this.stencilFuncMask = source.stencilFuncMask;
			this.stencilFail = source.stencilFail;
			this.stencilZFail = source.stencilZFail;
			this.stencilZPass = source.stencilZPass;
			this.stencilWrite = source.stencilWrite;

			const srcPlanes = source.clippingPlanes;
			let dstPlanes = null;

			if ( srcPlanes !== null ) {

				const n = srcPlanes.length;
				dstPlanes = new Array( n );

				for ( let i = 0; i !== n; ++ i ) {

					dstPlanes[ i ] = srcPlanes[ i ].clone();

				}

			}

			this.clippingPlanes = dstPlanes;
			this.clipIntersection = source.clipIntersection;
			this.clipShadows = source.clipShadows;

			this.shadowSide = source.shadowSide;

			this.colorWrite = source.colorWrite;

			this.precision = source.precision;

			this.polygonOffset = source.polygonOffset;
			this.polygonOffsetFactor = source.polygonOffsetFactor;
			this.polygonOffsetUnits = source.polygonOffsetUnits;

			this.dithering = source.dithering;

			this.alphaTest = source.alphaTest;
			this.alphaHash = source.alphaHash;
			this.alphaToCoverage = source.alphaToCoverage;
			this.premultipliedAlpha = source.premultipliedAlpha;
			this.forceSinglePass = source.forceSinglePass;

			this.visible = source.visible;

			this.toneMapped = source.toneMapped;

			this.userData = JSON.parse( JSON.stringify( source.userData ) );

			return this;

		}

		dispose() {

			this.dispatchEvent( { type: 'dispose' } );

		}

		set needsUpdate( value ) {

			if ( value === true ) this.version ++;

		}

	}

	class MeshBasicMaterial extends Material {

		constructor( parameters ) {

			super();

			this.isMeshBasicMaterial = true;

			this.type = 'MeshBasicMaterial';

			this.color = new Color( 0xffffff ); // emissive

			this.map = null;

			this.lightMap = null;
			this.lightMapIntensity = 1.0;

			this.aoMap = null;
			this.aoMapIntensity = 1.0;

			this.specularMap = null;

			this.alphaMap = null;

			this.envMap = null;
			this.envMapRotation = new Euler();
			this.combine = MultiplyOperation;
			this.reflectivity = 1;
			this.refractionRatio = 0.98;

			this.wireframe = false;
			this.wireframeLinewidth = 1;
			this.wireframeLinecap = 'round';
			this.wireframeLinejoin = 'round';

			this.fog = true;

			this.setValues( parameters );

		}

		copy( source ) {

			super.copy( source );

			this.color.copy( source.color );

			this.map = source.map;

			this.lightMap = source.lightMap;
			this.lightMapIntensity = source.lightMapIntensity;

			this.aoMap = source.aoMap;
			this.aoMapIntensity = source.aoMapIntensity;

			this.specularMap = source.specularMap;

			this.alphaMap = source.alphaMap;

			this.envMap = source.envMap;
			this.envMapRotation.copy( source.envMapRotation );
			this.combine = source.combine;
			this.reflectivity = source.reflectivity;
			this.refractionRatio = source.refractionRatio;

			this.wireframe = source.wireframe;
			this.wireframeLinewidth = source.wireframeLinewidth;
			this.wireframeLinecap = source.wireframeLinecap;
			this.wireframeLinejoin = source.wireframeLinejoin;

			this.fog = source.fog;

			return this;

		}

	}

	function arrayNeedsUint32( array ) {

		// assumes larger values usually on last

		for ( let i = array.length - 1; i >= 0; -- i ) {

			if ( array[ i ] >= 65535 ) return true; // account for PRIMITIVE_RESTART_FIXED_INDEX, #24565

		}

		return false;

	}

	const _cache = {};

	function warnOnce( message ) {

		if ( message in _cache ) return;

		_cache[ message ] = true;

		console.warn( message );

	}

	const _vector$1 = /*@__PURE__*/ new Vector3();
	const _vector2 = /*@__PURE__*/ new Vector2();

	class BufferAttribute {

		constructor( array, itemSize, normalized = false ) {

			if ( Array.isArray( array ) ) {

				throw new TypeError( 'THREE.BufferAttribute: array should be a Typed Array.' );

			}

			this.isBufferAttribute = true;

			this.name = '';

			this.array = array;
			this.itemSize = itemSize;
			this.count = array !== undefined ? array.length / itemSize : 0;
			this.normalized = normalized;

			this.usage = StaticDrawUsage;
			this._updateRange = { offset: 0, count: - 1 };
			this.updateRanges = [];
			this.gpuType = FloatType;

			this.version = 0;

		}

		onUploadCallback() {}

		set needsUpdate( value ) {

			if ( value === true ) this.version ++;

		}

		get updateRange() {

			warnOnce( 'THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead.' ); // @deprecated, r159
			return this._updateRange;

		}

		setUsage( value ) {

			this.usage = value;

			return this;

		}

		addUpdateRange( start, count ) {

			this.updateRanges.push( { start, count } );

		}

		clearUpdateRanges() {

			this.updateRanges.length = 0;

		}

		copy( source ) {

			this.name = source.name;
			this.array = new source.array.constructor( source.array );
			this.itemSize = source.itemSize;
			this.count = source.count;
			this.normalized = source.normalized;

			this.usage = source.usage;
			this.gpuType = source.gpuType;

			return this;

		}

		copyAt( index1, attribute, index2 ) {

			index1 *= this.itemSize;
			index2 *= attribute.itemSize;

			for ( let i = 0, l = this.itemSize; i < l; i ++ ) {

				this.array[ index1 + i ] = attribute.array[ index2 + i ];

			}

			return this;

		}

		copyArray( array ) {

			this.array.set( array );

			return this;

		}

		applyMatrix3( m ) {

			if ( this.itemSize === 2 ) {

				for ( let i = 0, l = this.count; i < l; i ++ ) {

					_vector2.fromBufferAttribute( this, i );
					_vector2.applyMatrix3( m );

					this.setXY( i, _vector2.x, _vector2.y );

				}

			} else if ( this.itemSize === 3 ) {

				for ( let i = 0, l = this.count; i < l; i ++ ) {

					_vector$1.fromBufferAttribute( this, i );
					_vector$1.applyMatrix3( m );

					this.setXYZ( i, _vector$1.x, _vector$1.y, _vector$1.z );

				}

			}

			return this;

		}

		applyMatrix4( m ) {

			for ( let i = 0, l = this.count; i < l; i ++ ) {

				_vector$1.fromBufferAttribute( this, i );

				_vector$1.applyMatrix4( m );

				this.setXYZ( i, _vector$1.x, _vector$1.y, _vector$1.z );

			}

			return this;

		}

		applyNormalMatrix( m ) {

			for ( let i = 0, l = this.count; i < l; i ++ ) {

				_vector$1.fromBufferAttribute( this, i );

				_vector$1.applyNormalMatrix( m );

				this.setXYZ( i, _vector$1.x, _vector$1.y, _vector$1.z );

			}

			return this;

		}

		transformDirection( m ) {

			for ( let i = 0, l = this.count; i < l; i ++ ) {

				_vector$1.fromBufferAttribute( this, i );

				_vector$1.transformDirection( m );

				this.setXYZ( i, _vector$1.x, _vector$1.y, _vector$1.z );

			}

			return this;

		}

		set( value, offset = 0 ) {

			// Matching BufferAttribute constructor, do not normalize the array.
			this.array.set( value, offset );

			return this;

		}

		getComponent( index, component ) {

			let value = this.array[ index * this.itemSize + component ];

			if ( this.normalized ) value = denormalize( value, this.array );

			return value;

		}

		setComponent( index, component, value ) {

			if ( this.normalized ) value = normalize( value, this.array );

			this.array[ index * this.itemSize + component ] = value;

			return this;

		}

		getX( index ) {

			let x = this.array[ index * this.itemSize ];

			if ( this.normalized ) x = denormalize( x, this.array );

			return x;

		}

		setX( index, x ) {

			if ( this.normalized ) x = normalize( x, this.array );

			this.array[ index * this.itemSize ] = x;

			return this;

		}

		getY( index ) {

			let y = this.array[ index * this.itemSize + 1 ];

			if ( this.normalized ) y = denormalize( y, this.array );

			return y;

		}

		setY( index, y ) {

			if ( this.normalized ) y = normalize( y, this.array );

			this.array[ index * this.itemSize + 1 ] = y;

			return this;

		}

		getZ( index ) {

			let z = this.array[ index * this.itemSize + 2 ];

			if ( this.normalized ) z = denormalize( z, this.array );

			return z;

		}

		setZ( index, z ) {

			if ( this.normalized ) z = normalize( z, this.array );

			this.array[ index * this.itemSize + 2 ] = z;

			return this;

		}

		getW( index ) {

			let w = this.array[ index * this.itemSize + 3 ];

			if ( this.normalized ) w = denormalize( w, this.array );

			return w;

		}

		setW( index, w ) {

			if ( this.normalized ) w = normalize( w, this.array );

			this.array[ index * this.itemSize + 3 ] = w;

			return this;

		}

		setXY( index, x, y ) {

			index *= this.itemSize;

			if ( this.normalized ) {

				x = normalize( x, this.array );
				y = normalize( y, this.array );

			}

			this.array[ index + 0 ] = x;
			this.array[ index + 1 ] = y;

			return this;

		}

		setXYZ( index, x, y, z ) {

			index *= this.itemSize;

			if ( this.normalized ) {

				x = normalize( x, this.array );
				y = normalize( y, this.array );
				z = normalize( z, this.array );

			}

			this.array[ index + 0 ] = x;
			this.array[ index + 1 ] = y;
			this.array[ index + 2 ] = z;

			return this;

		}

		setXYZW( index, x, y, z, w ) {

			index *= this.itemSize;

			if ( this.normalized ) {

				x = normalize( x, this.array );
				y = normalize( y, this.array );
				z = normalize( z, this.array );
				w = normalize( w, this.array );

			}

			this.array[ index + 0 ] = x;
			this.array[ index + 1 ] = y;
			this.array[ index + 2 ] = z;
			this.array[ index + 3 ] = w;

			return this;

		}

		onUpload( callback ) {

			this.onUploadCallback = callback;

			return this;

		}

		clone() {

			return new this.constructor( this.array, this.itemSize ).copy( this );

		}

		toJSON() {

			const data = {
				itemSize: this.itemSize,
				type: this.array.constructor.name,
				array: Array.from( this.array ),
				normalized: this.normalized
			};

			if ( this.name !== '' ) data.name = this.name;
			if ( this.usage !== StaticDrawUsage ) data.usage = this.usage;

			return data;

		}

	}

	class Uint16BufferAttribute extends BufferAttribute {

		constructor( array, itemSize, normalized ) {

			super( new Uint16Array( array ), itemSize, normalized );

		}

	}

	class Uint32BufferAttribute extends BufferAttribute {

		constructor( array, itemSize, normalized ) {

			super( new Uint32Array( array ), itemSize, normalized );

		}

	}


	class Float32BufferAttribute extends BufferAttribute {

		constructor( array, itemSize, normalized ) {

			super( new Float32Array( array ), itemSize, normalized );

		}

	}

	let _id = 0;

	const _m1 = /*@__PURE__*/ new Matrix4();
	const _obj = /*@__PURE__*/ new Object3D();
	const _offset = /*@__PURE__*/ new Vector3();
	const _box = /*@__PURE__*/ new Box3();
	const _boxMorphTargets = /*@__PURE__*/ new Box3();
	const _vector = /*@__PURE__*/ new Vector3();

	class BufferGeometry extends EventDispatcher {

		constructor() {

			super();

			this.isBufferGeometry = true;

			Object.defineProperty( this, 'id', { value: _id ++ } );

			this.uuid = generateUUID();

			this.name = '';
			this.type = 'BufferGeometry';

			this.index = null;
			this.attributes = {};

			this.morphAttributes = {};
			this.morphTargetsRelative = false;

			this.groups = [];

			this.boundingBox = null;
			this.boundingSphere = null;

			this.drawRange = { start: 0, count: Infinity };

			this.userData = {};

		}

		getIndex() {

			return this.index;

		}

		setIndex( index ) {

			if ( Array.isArray( index ) ) {

				this.index = new ( arrayNeedsUint32( index ) ? Uint32BufferAttribute : Uint16BufferAttribute )( index, 1 );

			} else {

				this.index = index;

			}

			return this;

		}

		getAttribute( name ) {

			return this.attributes[ name ];

		}

		setAttribute( name, attribute ) {

			this.attributes[ name ] = attribute;

			return this;

		}

		deleteAttribute( name ) {

			delete this.attributes[ name ];

			return this;

		}

		hasAttribute( name ) {

			return this.attributes[ name ] !== undefined;

		}

		addGroup( start, count, materialIndex = 0 ) {

			this.groups.push( {

				start: start,
				count: count,
				materialIndex: materialIndex

			} );

		}

		clearGroups() {

			this.groups = [];

		}

		setDrawRange( start, count ) {

			this.drawRange.start = start;
			this.drawRange.count = count;

		}

		applyMatrix4( matrix ) {

			const position = this.attributes.position;

			if ( position !== undefined ) {

				position.applyMatrix4( matrix );

				position.needsUpdate = true;

			}

			const normal = this.attributes.normal;

			if ( normal !== undefined ) {

				const normalMatrix = new Matrix3().getNormalMatrix( matrix );

				normal.applyNormalMatrix( normalMatrix );

				normal.needsUpdate = true;

			}

			const tangent = this.attributes.tangent;

			if ( tangent !== undefined ) {

				tangent.transformDirection( matrix );

				tangent.needsUpdate = true;

			}

			if ( this.boundingBox !== null ) {

				this.computeBoundingBox();

			}

			if ( this.boundingSphere !== null ) {

				this.computeBoundingSphere();

			}

			return this;

		}

		applyQuaternion( q ) {

			_m1.makeRotationFromQuaternion( q );

			this.applyMatrix4( _m1 );

			return this;

		}

		rotateX( angle ) {

			// rotate geometry around world x-axis

			_m1.makeRotationX( angle );

			this.applyMatrix4( _m1 );

			return this;

		}

		rotateY( angle ) {

			// rotate geometry around world y-axis

			_m1.makeRotationY( angle );

			this.applyMatrix4( _m1 );

			return this;

		}

		rotateZ( angle ) {

			// rotate geometry around world z-axis

			_m1.makeRotationZ( angle );

			this.applyMatrix4( _m1 );

			return this;

		}

		translate( x, y, z ) {

			// translate geometry

			_m1.makeTranslation( x, y, z );

			this.applyMatrix4( _m1 );

			return this;

		}

		scale( x, y, z ) {

			// scale geometry

			_m1.makeScale( x, y, z );

			this.applyMatrix4( _m1 );

			return this;

		}

		lookAt( vector ) {

			_obj.lookAt( vector );

			_obj.updateMatrix();

			this.applyMatrix4( _obj.matrix );

			return this;

		}

		center() {

			this.computeBoundingBox();

			this.boundingBox.getCenter( _offset ).negate();

			this.translate( _offset.x, _offset.y, _offset.z );

			return this;

		}

		setFromPoints( points ) {

			const position = [];

			for ( let i = 0, l = points.length; i < l; i ++ ) {

				const point = points[ i ];
				position.push( point.x, point.y, point.z || 0 );

			}

			this.setAttribute( 'position', new Float32BufferAttribute( position, 3 ) );

			return this;

		}

		computeBoundingBox() {

			if ( this.boundingBox === null ) {

				this.boundingBox = new Box3();

			}

			const position = this.attributes.position;
			const morphAttributesPosition = this.morphAttributes.position;

			if ( position && position.isGLBufferAttribute ) {

				console.error( 'THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.', this );

				this.boundingBox.set(
					new Vector3( - Infinity, - Infinity, - Infinity ),
					new Vector3( + Infinity, + Infinity, + Infinity )
				);

				return;

			}

			if ( position !== undefined ) {

				this.boundingBox.setFromBufferAttribute( position );

				// process morph attributes if present

				if ( morphAttributesPosition ) {

					for ( let i = 0, il = morphAttributesPosition.length; i < il; i ++ ) {

						const morphAttribute = morphAttributesPosition[ i ];
						_box.setFromBufferAttribute( morphAttribute );

						if ( this.morphTargetsRelative ) {

							_vector.addVectors( this.boundingBox.min, _box.min );
							this.boundingBox.expandByPoint( _vector );

							_vector.addVectors( this.boundingBox.max, _box.max );
							this.boundingBox.expandByPoint( _vector );

						} else {

							this.boundingBox.expandByPoint( _box.min );
							this.boundingBox.expandByPoint( _box.max );

						}

					}

				}

			} else {

				this.boundingBox.makeEmpty();

			}

			if ( isNaN( this.boundingBox.min.x ) || isNaN( this.boundingBox.min.y ) || isNaN( this.boundingBox.min.z ) ) {

				console.error( 'THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.', this );

			}

		}

		computeBoundingSphere() {

			if ( this.boundingSphere === null ) {

				this.boundingSphere = new Sphere();

			}

			const position = this.attributes.position;
			const morphAttributesPosition = this.morphAttributes.position;

			if ( position && position.isGLBufferAttribute ) {

				console.error( 'THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.', this );

				this.boundingSphere.set( new Vector3(), Infinity );

				return;

			}

			if ( position ) {

				// first, find the center of the bounding sphere

				const center = this.boundingSphere.center;

				_box.setFromBufferAttribute( position );

				// process morph attributes if present

				if ( morphAttributesPosition ) {

					for ( let i = 0, il = morphAttributesPosition.length; i < il; i ++ ) {

						const morphAttribute = morphAttributesPosition[ i ];
						_boxMorphTargets.setFromBufferAttribute( morphAttribute );

						if ( this.morphTargetsRelative ) {

							_vector.addVectors( _box.min, _boxMorphTargets.min );
							_box.expandByPoint( _vector );

							_vector.addVectors( _box.max, _boxMorphTargets.max );
							_box.expandByPoint( _vector );

						} else {

							_box.expandByPoint( _boxMorphTargets.min );
							_box.expandByPoint( _boxMorphTargets.max );

						}

					}

				}

				_box.getCenter( center );

				// second, try to find a boundingSphere with a radius smaller than the
				// boundingSphere of the boundingBox: sqrt(3) smaller in the best case

				let maxRadiusSq = 0;

				for ( let i = 0, il = position.count; i < il; i ++ ) {

					_vector.fromBufferAttribute( position, i );

					maxRadiusSq = Math.max( maxRadiusSq, center.distanceToSquared( _vector ) );

				}

				// process morph attributes if present

				if ( morphAttributesPosition ) {

					for ( let i = 0, il = morphAttributesPosition.length; i < il; i ++ ) {

						const morphAttribute = morphAttributesPosition[ i ];
						const morphTargetsRelative = this.morphTargetsRelative;

						for ( let j = 0, jl = morphAttribute.count; j < jl; j ++ ) {

							_vector.fromBufferAttribute( morphAttribute, j );

							if ( morphTargetsRelative ) {

								_offset.fromBufferAttribute( position, j );
								_vector.add( _offset );

							}

							maxRadiusSq = Math.max( maxRadiusSq, center.distanceToSquared( _vector ) );

						}

					}

				}

				this.boundingSphere.radius = Math.sqrt( maxRadiusSq );

				if ( isNaN( this.boundingSphere.radius ) ) {

					console.error( 'THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.', this );

				}

			}

		}

		computeTangents() {

			const index = this.index;
			const attributes = this.attributes;

			// based on http://www.terathon.com/code/tangent.html
			// (per vertex tangents)

			if ( index === null ||
				 attributes.position === undefined ||
				 attributes.normal === undefined ||
				 attributes.uv === undefined ) {

				console.error( 'THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)' );
				return;

			}

			const positionAttribute = attributes.position;
			const normalAttribute = attributes.normal;
			const uvAttribute = attributes.uv;

			if ( this.hasAttribute( 'tangent' ) === false ) {

				this.setAttribute( 'tangent', new BufferAttribute( new Float32Array( 4 * positionAttribute.count ), 4 ) );

			}

			const tangentAttribute = this.getAttribute( 'tangent' );

			const tan1 = [], tan2 = [];

			for ( let i = 0; i < positionAttribute.count; i ++ ) {

				tan1[ i ] = new Vector3();
				tan2[ i ] = new Vector3();

			}

			const vA = new Vector3(),
				vB = new Vector3(),
				vC = new Vector3(),

				uvA = new Vector2(),
				uvB = new Vector2(),
				uvC = new Vector2(),

				sdir = new Vector3(),
				tdir = new Vector3();

			function handleTriangle( a, b, c ) {

				vA.fromBufferAttribute( positionAttribute, a );
				vB.fromBufferAttribute( positionAttribute, b );
				vC.fromBufferAttribute( positionAttribute, c );

				uvA.fromBufferAttribute( uvAttribute, a );
				uvB.fromBufferAttribute( uvAttribute, b );
				uvC.fromBufferAttribute( uvAttribute, c );

				vB.sub( vA );
				vC.sub( vA );

				uvB.sub( uvA );
				uvC.sub( uvA );

				const r = 1.0 / ( uvB.x * uvC.y - uvC.x * uvB.y );

				// silently ignore degenerate uv triangles having coincident or colinear vertices

				if ( ! isFinite( r ) ) return;

				sdir.copy( vB ).multiplyScalar( uvC.y ).addScaledVector( vC, - uvB.y ).multiplyScalar( r );
				tdir.copy( vC ).multiplyScalar( uvB.x ).addScaledVector( vB, - uvC.x ).multiplyScalar( r );

				tan1[ a ].add( sdir );
				tan1[ b ].add( sdir );
				tan1[ c ].add( sdir );

				tan2[ a ].add( tdir );
				tan2[ b ].add( tdir );
				tan2[ c ].add( tdir );

			}

			let groups = this.groups;

			if ( groups.length === 0 ) {

				groups = [ {
					start: 0,
					count: index.count
				} ];

			}

			for ( let i = 0, il = groups.length; i < il; ++ i ) {

				const group = groups[ i ];

				const start = group.start;
				const count = group.count;

				for ( let j = start, jl = start + count; j < jl; j += 3 ) {

					handleTriangle(
						index.getX( j + 0 ),
						index.getX( j + 1 ),
						index.getX( j + 2 )
					);

				}

			}

			const tmp = new Vector3(), tmp2 = new Vector3();
			const n = new Vector3(), n2 = new Vector3();

			function handleVertex( v ) {

				n.fromBufferAttribute( normalAttribute, v );
				n2.copy( n );

				const t = tan1[ v ];

				// Gram-Schmidt orthogonalize

				tmp.copy( t );
				tmp.sub( n.multiplyScalar( n.dot( t ) ) ).normalize();

				// Calculate handedness

				tmp2.crossVectors( n2, t );
				const test = tmp2.dot( tan2[ v ] );
				const w = ( test < 0.0 ) ? - 1.0 : 1.0;

				tangentAttribute.setXYZW( v, tmp.x, tmp.y, tmp.z, w );

			}

			for ( let i = 0, il = groups.length; i < il; ++ i ) {

				const group = groups[ i ];

				const start = group.start;
				const count = group.count;

				for ( let j = start, jl = start + count; j < jl; j += 3 ) {

					handleVertex( index.getX( j + 0 ) );
					handleVertex( index.getX( j + 1 ) );
					handleVertex( index.getX( j + 2 ) );

				}

			}

		}

		computeVertexNormals() {

			const index = this.index;
			const positionAttribute = this.getAttribute( 'position' );

			if ( positionAttribute !== undefined ) {

				let normalAttribute = this.getAttribute( 'normal' );

				if ( normalAttribute === undefined ) {

					normalAttribute = new BufferAttribute( new Float32Array( positionAttribute.count * 3 ), 3 );
					this.setAttribute( 'normal', normalAttribute );

				} else {

					// reset existing normals to zero

					for ( let i = 0, il = normalAttribute.count; i < il; i ++ ) {

						normalAttribute.setXYZ( i, 0, 0, 0 );

					}

				}

				const pA = new Vector3(), pB = new Vector3(), pC = new Vector3();
				const nA = new Vector3(), nB = new Vector3(), nC = new Vector3();
				const cb = new Vector3(), ab = new Vector3();

				// indexed elements

				if ( index ) {

					for ( let i = 0, il = index.count; i < il; i += 3 ) {

						const vA = index.getX( i + 0 );
						const vB = index.getX( i + 1 );
						const vC = index.getX( i + 2 );

						pA.fromBufferAttribute( positionAttribute, vA );
						pB.fromBufferAttribute( positionAttribute, vB );
						pC.fromBufferAttribute( positionAttribute, vC );

						cb.subVectors( pC, pB );
						ab.subVectors( pA, pB );
						cb.cross( ab );

						nA.fromBufferAttribute( normalAttribute, vA );
						nB.fromBufferAttribute( normalAttribute, vB );
						nC.fromBufferAttribute( normalAttribute, vC );

						nA.add( cb );
						nB.add( cb );
						nC.add( cb );

						normalAttribute.setXYZ( vA, nA.x, nA.y, nA.z );
						normalAttribute.setXYZ( vB, nB.x, nB.y, nB.z );
						normalAttribute.setXYZ( vC, nC.x, nC.y, nC.z );

					}

				} else {

					// non-indexed elements (unconnected triangle soup)

					for ( let i = 0, il = positionAttribute.count; i < il; i += 3 ) {

						pA.fromBufferAttribute( positionAttribute, i + 0 );
						pB.fromBufferAttribute( positionAttribute, i + 1 );
						pC.fromBufferAttribute( positionAttribute, i + 2 );

						cb.subVectors( pC, pB );
						ab.subVectors( pA, pB );
						cb.cross( ab );

						normalAttribute.setXYZ( i + 0, cb.x, cb.y, cb.z );
						normalAttribute.setXYZ( i + 1, cb.x, cb.y, cb.z );
						normalAttribute.setXYZ( i + 2, cb.x, cb.y, cb.z );

					}

				}

				this.normalizeNormals();

				normalAttribute.needsUpdate = true;

			}

		}

		normalizeNormals() {

			const normals = this.attributes.normal;

			for ( let i = 0, il = normals.count; i < il; i ++ ) {

				_vector.fromBufferAttribute( normals, i );

				_vector.normalize();

				normals.setXYZ( i, _vector.x, _vector.y, _vector.z );

			}

		}

		toNonIndexed() {

			function convertBufferAttribute( attribute, indices ) {

				const array = attribute.array;
				const itemSize = attribute.itemSize;
				const normalized = attribute.normalized;

				const array2 = new array.constructor( indices.length * itemSize );

				let index = 0, index2 = 0;

				for ( let i = 0, l = indices.length; i < l; i ++ ) {

					if ( attribute.isInterleavedBufferAttribute ) {

						index = indices[ i ] * attribute.data.stride + attribute.offset;

					} else {

						index = indices[ i ] * itemSize;

					}

					for ( let j = 0; j < itemSize; j ++ ) {

						array2[ index2 ++ ] = array[ index ++ ];

					}

				}

				return new BufferAttribute( array2, itemSize, normalized );

			}

			//

			if ( this.index === null ) {

				console.warn( 'THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed.' );
				return this;

			}

			const geometry2 = new BufferGeometry();

			const indices = this.index.array;
			const attributes = this.attributes;

			// attributes

			for ( const name in attributes ) {

				const attribute = attributes[ name ];

				const newAttribute = convertBufferAttribute( attribute, indices );

				geometry2.setAttribute( name, newAttribute );

			}

			// morph attributes

			const morphAttributes = this.morphAttributes;

			for ( const name in morphAttributes ) {

				const morphArray = [];
				const morphAttribute = morphAttributes[ name ]; // morphAttribute: array of Float32BufferAttributes

				for ( let i = 0, il = morphAttribute.length; i < il; i ++ ) {

					const attribute = morphAttribute[ i ];

					const newAttribute = convertBufferAttribute( attribute, indices );

					morphArray.push( newAttribute );

				}

				geometry2.morphAttributes[ name ] = morphArray;

			}

			geometry2.morphTargetsRelative = this.morphTargetsRelative;

			// groups

			const groups = this.groups;

			for ( let i = 0, l = groups.length; i < l; i ++ ) {

				const group = groups[ i ];
				geometry2.addGroup( group.start, group.count, group.materialIndex );

			}

			return geometry2;

		}

		toJSON() {

			const data = {
				metadata: {
					version: 4.6,
					type: 'BufferGeometry',
					generator: 'BufferGeometry.toJSON'
				}
			};

			// standard BufferGeometry serialization

			data.uuid = this.uuid;
			data.type = this.type;
			if ( this.name !== '' ) data.name = this.name;
			if ( Object.keys( this.userData ).length > 0 ) data.userData = this.userData;

			if ( this.parameters !== undefined ) {

				const parameters = this.parameters;

				for ( const key in parameters ) {

					if ( parameters[ key ] !== undefined ) data[ key ] = parameters[ key ];

				}

				return data;

			}

			// for simplicity the code assumes attributes are not shared across geometries, see #15811

			data.data = { attributes: {} };

			const index = this.index;

			if ( index !== null ) {

				data.data.index = {
					type: index.array.constructor.name,
					array: Array.prototype.slice.call( index.array )
				};

			}

			const attributes = this.attributes;

			for ( const key in attributes ) {

				const attribute = attributes[ key ];

				data.data.attributes[ key ] = attribute.toJSON( data.data );

			}

			const morphAttributes = {};
			let hasMorphAttributes = false;

			for ( const key in this.morphAttributes ) {

				const attributeArray = this.morphAttributes[ key ];

				const array = [];

				for ( let i = 0, il = attributeArray.length; i < il; i ++ ) {

					const attribute = attributeArray[ i ];

					array.push( attribute.toJSON( data.data ) );

				}

				if ( array.length > 0 ) {

					morphAttributes[ key ] = array;

					hasMorphAttributes = true;

				}

			}

			if ( hasMorphAttributes ) {

				data.data.morphAttributes = morphAttributes;
				data.data.morphTargetsRelative = this.morphTargetsRelative;

			}

			const groups = this.groups;

			if ( groups.length > 0 ) {

				data.data.groups = JSON.parse( JSON.stringify( groups ) );

			}

			const boundingSphere = this.boundingSphere;

			if ( boundingSphere !== null ) {

				data.data.boundingSphere = {
					center: boundingSphere.center.toArray(),
					radius: boundingSphere.radius
				};

			}

			return data;

		}

		clone() {

			return new this.constructor().copy( this );

		}

		copy( source ) {

			// reset

			this.index = null;
			this.attributes = {};
			this.morphAttributes = {};
			this.groups = [];
			this.boundingBox = null;
			this.boundingSphere = null;

			// used for storing cloned, shared data

			const data = {};

			// name

			this.name = source.name;

			// index

			const index = source.index;

			if ( index !== null ) {

				this.setIndex( index.clone( data ) );

			}

			// attributes

			const attributes = source.attributes;

			for ( const name in attributes ) {

				const attribute = attributes[ name ];
				this.setAttribute( name, attribute.clone( data ) );

			}

			// morph attributes

			const morphAttributes = source.morphAttributes;

			for ( const name in morphAttributes ) {

				const array = [];
				const morphAttribute = morphAttributes[ name ]; // morphAttribute: array of Float32BufferAttributes

				for ( let i = 0, l = morphAttribute.length; i < l; i ++ ) {

					array.push( morphAttribute[ i ].clone( data ) );

				}

				this.morphAttributes[ name ] = array;

			}

			this.morphTargetsRelative = source.morphTargetsRelative;

			// groups

			const groups = source.groups;

			for ( let i = 0, l = groups.length; i < l; i ++ ) {

				const group = groups[ i ];
				this.addGroup( group.start, group.count, group.materialIndex );

			}

			// bounding box

			const boundingBox = source.boundingBox;

			if ( boundingBox !== null ) {

				this.boundingBox = boundingBox.clone();

			}

			// bounding sphere

			const boundingSphere = source.boundingSphere;

			if ( boundingSphere !== null ) {

				this.boundingSphere = boundingSphere.clone();

			}

			// draw range

			this.drawRange.start = source.drawRange.start;
			this.drawRange.count = source.drawRange.count;

			// user data

			this.userData = source.userData;

			return this;

		}

		dispose() {

			this.dispatchEvent( { type: 'dispose' } );

		}

	}

	const _inverseMatrix = /*@__PURE__*/ new Matrix4();
	const _ray = /*@__PURE__*/ new Ray();
	const _sphere = /*@__PURE__*/ new Sphere();
	const _sphereHitAt = /*@__PURE__*/ new Vector3();

	const _vA = /*@__PURE__*/ new Vector3();
	const _vB = /*@__PURE__*/ new Vector3();
	const _vC = /*@__PURE__*/ new Vector3();

	const _tempA = /*@__PURE__*/ new Vector3();
	const _morphA = /*@__PURE__*/ new Vector3();

	const _uvA = /*@__PURE__*/ new Vector2();
	const _uvB = /*@__PURE__*/ new Vector2();
	const _uvC = /*@__PURE__*/ new Vector2();

	const _normalA = /*@__PURE__*/ new Vector3();
	const _normalB = /*@__PURE__*/ new Vector3();
	const _normalC = /*@__PURE__*/ new Vector3();

	const _intersectionPoint = /*@__PURE__*/ new Vector3();
	const _intersectionPointWorld = /*@__PURE__*/ new Vector3();

	class Mesh extends Object3D {

		constructor( geometry = new BufferGeometry(), material = new MeshBasicMaterial() ) {

			super();

			this.isMesh = true;

			this.type = 'Mesh';

			this.geometry = geometry;
			this.material = material;

			this.updateMorphTargets();

		}

		copy( source, recursive ) {

			super.copy( source, recursive );

			if ( source.morphTargetInfluences !== undefined ) {

				this.morphTargetInfluences = source.morphTargetInfluences.slice();

			}

			if ( source.morphTargetDictionary !== undefined ) {

				this.morphTargetDictionary = Object.assign( {}, source.morphTargetDictionary );

			}

			this.material = Array.isArray( source.material ) ? source.material.slice() : source.material;
			this.geometry = source.geometry;

			return this;

		}

		updateMorphTargets() {

			const geometry = this.geometry;

			const morphAttributes = geometry.morphAttributes;
			const keys = Object.keys( morphAttributes );

			if ( keys.length > 0 ) {

				const morphAttribute = morphAttributes[ keys[ 0 ] ];

				if ( morphAttribute !== undefined ) {

					this.morphTargetInfluences = [];
					this.morphTargetDictionary = {};

					for ( let m = 0, ml = morphAttribute.length; m < ml; m ++ ) {

						const name = morphAttribute[ m ].name || String( m );

						this.morphTargetInfluences.push( 0 );
						this.morphTargetDictionary[ name ] = m;

					}

				}

			}

		}

		getVertexPosition( index, target ) {

			const geometry = this.geometry;
			const position = geometry.attributes.position;
			const morphPosition = geometry.morphAttributes.position;
			const morphTargetsRelative = geometry.morphTargetsRelative;

			target.fromBufferAttribute( position, index );

			const morphInfluences = this.morphTargetInfluences;

			if ( morphPosition && morphInfluences ) {

				_morphA.set( 0, 0, 0 );

				for ( let i = 0, il = morphPosition.length; i < il; i ++ ) {

					const influence = morphInfluences[ i ];
					const morphAttribute = morphPosition[ i ];

					if ( influence === 0 ) continue;

					_tempA.fromBufferAttribute( morphAttribute, index );

					if ( morphTargetsRelative ) {

						_morphA.addScaledVector( _tempA, influence );

					} else {

						_morphA.addScaledVector( _tempA.sub( target ), influence );

					}

				}

				target.add( _morphA );

			}

			return target;

		}

		raycast( raycaster, intersects ) {

			const geometry = this.geometry;
			const material = this.material;
			const matrixWorld = this.matrixWorld;

			if ( material === undefined ) return;

			// test with bounding sphere in world space

			if ( geometry.boundingSphere === null ) geometry.computeBoundingSphere();

			_sphere.copy( geometry.boundingSphere );
			_sphere.applyMatrix4( matrixWorld );

			// check distance from ray origin to bounding sphere

			_ray.copy( raycaster.ray ).recast( raycaster.near );

			if ( _sphere.containsPoint( _ray.origin ) === false ) {

				if ( _ray.intersectSphere( _sphere, _sphereHitAt ) === null ) return;

				if ( _ray.origin.distanceToSquared( _sphereHitAt ) > ( raycaster.far - raycaster.near ) ** 2 ) return;

			}

			// convert ray to local space of mesh

			_inverseMatrix.copy( matrixWorld ).invert();
			_ray.copy( raycaster.ray ).applyMatrix4( _inverseMatrix );

			// test with bounding box in local space

			if ( geometry.boundingBox !== null ) {

				if ( _ray.intersectsBox( geometry.boundingBox ) === false ) return;

			}

			// test for intersections with geometry

			this._computeIntersections( raycaster, intersects, _ray );

		}

		_computeIntersections( raycaster, intersects, rayLocalSpace ) {

			let intersection;

			const geometry = this.geometry;
			const material = this.material;

			const index = geometry.index;
			const position = geometry.attributes.position;
			const uv = geometry.attributes.uv;
			const uv1 = geometry.attributes.uv1;
			const normal = geometry.attributes.normal;
			const groups = geometry.groups;
			const drawRange = geometry.drawRange;

			if ( index !== null ) {

				// indexed buffer geometry

				if ( Array.isArray( material ) ) {

					for ( let i = 0, il = groups.length; i < il; i ++ ) {

						const group = groups[ i ];
						const groupMaterial = material[ group.materialIndex ];

						const start = Math.max( group.start, drawRange.start );
						const end = Math.min( index.count, Math.min( ( group.start + group.count ), ( drawRange.start + drawRange.count ) ) );

						for ( let j = start, jl = end; j < jl; j += 3 ) {

							const a = index.getX( j );
							const b = index.getX( j + 1 );
							const c = index.getX( j + 2 );

							intersection = checkGeometryIntersection( this, groupMaterial, raycaster, rayLocalSpace, uv, uv1, normal, a, b, c );

							if ( intersection ) {

								intersection.faceIndex = Math.floor( j / 3 ); // triangle number in indexed buffer semantics
								intersection.face.materialIndex = group.materialIndex;
								intersects.push( intersection );

							}

						}

					}

				} else {

					const start = Math.max( 0, drawRange.start );
					const end = Math.min( index.count, ( drawRange.start + drawRange.count ) );

					for ( let i = start, il = end; i < il; i += 3 ) {

						const a = index.getX( i );
						const b = index.getX( i + 1 );
						const c = index.getX( i + 2 );

						intersection = checkGeometryIntersection( this, material, raycaster, rayLocalSpace, uv, uv1, normal, a, b, c );

						if ( intersection ) {

							intersection.faceIndex = Math.floor( i / 3 ); // triangle number in indexed buffer semantics
							intersects.push( intersection );

						}

					}

				}

			} else if ( position !== undefined ) {

				// non-indexed buffer geometry

				if ( Array.isArray( material ) ) {

					for ( let i = 0, il = groups.length; i < il; i ++ ) {

						const group = groups[ i ];
						const groupMaterial = material[ group.materialIndex ];

						const start = Math.max( group.start, drawRange.start );
						const end = Math.min( position.count, Math.min( ( group.start + group.count ), ( drawRange.start + drawRange.count ) ) );

						for ( let j = start, jl = end; j < jl; j += 3 ) {

							const a = j;
							const b = j + 1;
							const c = j + 2;

							intersection = checkGeometryIntersection( this, groupMaterial, raycaster, rayLocalSpace, uv, uv1, normal, a, b, c );

							if ( intersection ) {

								intersection.faceIndex = Math.floor( j / 3 ); // triangle number in non-indexed buffer semantics
								intersection.face.materialIndex = group.materialIndex;
								intersects.push( intersection );

							}

						}

					}

				} else {

					const start = Math.max( 0, drawRange.start );
					const end = Math.min( position.count, ( drawRange.start + drawRange.count ) );

					for ( let i = start, il = end; i < il; i += 3 ) {

						const a = i;
						const b = i + 1;
						const c = i + 2;

						intersection = checkGeometryIntersection( this, material, raycaster, rayLocalSpace, uv, uv1, normal, a, b, c );

						if ( intersection ) {

							intersection.faceIndex = Math.floor( i / 3 ); // triangle number in non-indexed buffer semantics
							intersects.push( intersection );

						}

					}

				}

			}

		}

	}

	function checkIntersection( object, material, raycaster, ray, pA, pB, pC, point ) {

		let intersect;

		if ( material.side === BackSide ) {

			intersect = ray.intersectTriangle( pC, pB, pA, true, point );

		} else {

			intersect = ray.intersectTriangle( pA, pB, pC, ( material.side === FrontSide ), point );

		}

		if ( intersect === null ) return null;

		_intersectionPointWorld.copy( point );
		_intersectionPointWorld.applyMatrix4( object.matrixWorld );

		const distance = raycaster.ray.origin.distanceTo( _intersectionPointWorld );

		if ( distance < raycaster.near || distance > raycaster.far ) return null;

		return {
			distance: distance,
			point: _intersectionPointWorld.clone(),
			object: object
		};

	}

	function checkGeometryIntersection( object, material, raycaster, ray, uv, uv1, normal, a, b, c ) {

		object.getVertexPosition( a, _vA );
		object.getVertexPosition( b, _vB );
		object.getVertexPosition( c, _vC );

		const intersection = checkIntersection( object, material, raycaster, ray, _vA, _vB, _vC, _intersectionPoint );

		if ( intersection ) {

			if ( uv ) {

				_uvA.fromBufferAttribute( uv, a );
				_uvB.fromBufferAttribute( uv, b );
				_uvC.fromBufferAttribute( uv, c );

				intersection.uv = Triangle.getInterpolation( _intersectionPoint, _vA, _vB, _vC, _uvA, _uvB, _uvC, new Vector2() );

			}

			if ( uv1 ) {

				_uvA.fromBufferAttribute( uv1, a );
				_uvB.fromBufferAttribute( uv1, b );
				_uvC.fromBufferAttribute( uv1, c );

				intersection.uv1 = Triangle.getInterpolation( _intersectionPoint, _vA, _vB, _vC, _uvA, _uvB, _uvC, new Vector2() );

			}

			if ( normal ) {

				_normalA.fromBufferAttribute( normal, a );
				_normalB.fromBufferAttribute( normal, b );
				_normalC.fromBufferAttribute( normal, c );

				intersection.normal = Triangle.getInterpolation( _intersectionPoint, _vA, _vB, _vC, _normalA, _normalB, _normalC, new Vector3() );

				if ( intersection.normal.dot( ray.direction ) > 0 ) {

					intersection.normal.multiplyScalar( - 1 );

				}

			}

			const face = {
				a: a,
				b: b,
				c: c,
				normal: new Vector3(),
				materialIndex: 0
			};

			Triangle.getNormal( _vA, _vB, _vC, face.normal );

			intersection.face = face;

		}

		return intersection;

	}

	var default_vertex = "void main() {\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}";

	var default_fragment = "void main() {\n\tgl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );\n}";

	class ShaderMaterial extends Material {

		constructor( parameters ) {

			super();

			this.isShaderMaterial = true;

			this.type = 'ShaderMaterial';

			this.defines = {};
			this.uniforms = {};
			this.uniformsGroups = [];

			this.vertexShader = default_vertex;
			this.fragmentShader = default_fragment;

			this.linewidth = 1;

			this.wireframe = false;
			this.wireframeLinewidth = 1;

			this.fog = false; // set to use scene fog
			this.lights = false; // set to use scene lights
			this.clipping = false; // set to use user-defined clipping planes

			this.forceSinglePass = true;

			this.extensions = {
				derivatives: false, // set to use derivatives
				fragDepth: false, // set to use fragment depth values
				drawBuffers: false, // set to use draw buffers
				shaderTextureLOD: false, // set to use shader texture LOD
				clipCullDistance: false, // set to use vertex shader clipping
				multiDraw: false // set to use vertex shader multi_draw / enable gl_DrawID
			};

			// When rendered geometry doesn't include these attributes but the material does,
			// use these default values in WebGL. This avoids errors when buffer data is missing.
			this.defaultAttributeValues = {
				'color': [ 1, 1, 1 ],
				'uv': [ 0, 0 ],
				'uv1': [ 0, 0 ]
			};

			this.index0AttributeName = undefined;
			this.uniformsNeedUpdate = false;

			this.glslVersion = null;

			if ( parameters !== undefined ) {

				this.setValues( parameters );

			}

		}

		copy( source ) {

			super.copy( source );

			this.fragmentShader = source.fragmentShader;
			this.vertexShader = source.vertexShader;

			this.uniforms = cloneUniforms( source.uniforms );
			this.uniformsGroups = cloneUniformsGroups( source.uniformsGroups );

			this.defines = Object.assign( {}, source.defines );

			this.wireframe = source.wireframe;
			this.wireframeLinewidth = source.wireframeLinewidth;

			this.fog = source.fog;
			this.lights = source.lights;
			this.clipping = source.clipping;

			this.extensions = Object.assign( {}, source.extensions );

			this.glslVersion = source.glslVersion;

			return this;

		}

		toJSON( meta ) {

			const data = super.toJSON( meta );

			data.glslVersion = this.glslVersion;
			data.uniforms = {};

			for ( const name in this.uniforms ) {

				const uniform = this.uniforms[ name ];
				const value = uniform.value;

				if ( value && value.isTexture ) {

					data.uniforms[ name ] = {
						type: 't',
						value: value.toJSON( meta ).uuid
					};

				} else if ( value && value.isColor ) {

					data.uniforms[ name ] = {
						type: 'c',
						value: value.getHex()
					};

				} else if ( value && value.isVector2 ) {

					data.uniforms[ name ] = {
						type: 'v2',
						value: value.toArray()
					};

				} else if ( value && value.isVector3 ) {

					data.uniforms[ name ] = {
						type: 'v3',
						value: value.toArray()
					};

				} else if ( value && value.isVector4 ) {

					data.uniforms[ name ] = {
						type: 'v4',
						value: value.toArray()
					};

				} else if ( value && value.isMatrix3 ) {

					data.uniforms[ name ] = {
						type: 'm3',
						value: value.toArray()
					};

				} else if ( value && value.isMatrix4 ) {

					data.uniforms[ name ] = {
						type: 'm4',
						value: value.toArray()
					};

				} else {

					data.uniforms[ name ] = {
						value: value
					};

					// note: the array variants v2v, v3v, v4v, m4v and tv are not supported so far

				}

			}

			if ( Object.keys( this.defines ).length > 0 ) data.defines = this.defines;

			data.vertexShader = this.vertexShader;
			data.fragmentShader = this.fragmentShader;

			data.lights = this.lights;
			data.clipping = this.clipping;

			const extensions = {};

			for ( const key in this.extensions ) {

				if ( this.extensions[ key ] === true ) extensions[ key ] = true;

			}

			if ( Object.keys( extensions ).length > 0 ) data.extensions = extensions;

			return data;

		}

	}

	class Camera extends Object3D {

		constructor() {

			super();

			this.isCamera = true;

			this.type = 'Camera';

			this.matrixWorldInverse = new Matrix4();

			this.projectionMatrix = new Matrix4();
			this.projectionMatrixInverse = new Matrix4();

			this.coordinateSystem = WebGLCoordinateSystem;

		}

		copy( source, recursive ) {

			super.copy( source, recursive );

			this.matrixWorldInverse.copy( source.matrixWorldInverse );

			this.projectionMatrix.copy( source.projectionMatrix );
			this.projectionMatrixInverse.copy( source.projectionMatrixInverse );

			this.coordinateSystem = source.coordinateSystem;

			return this;

		}

		getWorldDirection( target ) {

			return super.getWorldDirection( target ).negate();

		}

		updateMatrixWorld( force ) {

			super.updateMatrixWorld( force );

			this.matrixWorldInverse.copy( this.matrixWorld ).invert();

		}

		updateWorldMatrix( updateParents, updateChildren ) {

			super.updateWorldMatrix( updateParents, updateChildren );

			this.matrixWorldInverse.copy( this.matrixWorld ).invert();

		}

		clone() {

			return new this.constructor().copy( this );

		}

	}

	const _v3 = /*@__PURE__*/ new Vector3();
	const _minTarget = /*@__PURE__*/ new Vector2();
	const _maxTarget = /*@__PURE__*/ new Vector2();


	class PerspectiveCamera extends Camera {

		constructor( fov = 50, aspect = 1, near = 0.1, far = 2000 ) {

			super();

			this.isPerspectiveCamera = true;

			this.type = 'PerspectiveCamera';

			this.fov = fov;
			this.zoom = 1;

			this.near = near;
			this.far = far;
			this.focus = 10;

			this.aspect = aspect;
			this.view = null;

			this.filmGauge = 35;	// width of the film (default in millimeters)
			this.filmOffset = 0;	// horizontal film offset (same unit as gauge)

			this.updateProjectionMatrix();

		}

		copy( source, recursive ) {

			super.copy( source, recursive );

			this.fov = source.fov;
			this.zoom = source.zoom;

			this.near = source.near;
			this.far = source.far;
			this.focus = source.focus;

			this.aspect = source.aspect;
			this.view = source.view === null ? null : Object.assign( {}, source.view );

			this.filmGauge = source.filmGauge;
			this.filmOffset = source.filmOffset;

			return this;

		}

		/**
		 * Sets the FOV by focal length in respect to the current .filmGauge.
		 *
		 * The default film gauge is 35, so that the focal length can be specified for
		 * a 35mm (full frame) camera.
		 *
		 * Values for focal length and film gauge must have the same unit.
		 */
		setFocalLength( focalLength ) {

			/** see {@link http://www.bobatkins.com/photography/technical/field_of_view.html} */
			const vExtentSlope = 0.5 * this.getFilmHeight() / focalLength;

			this.fov = RAD2DEG * 2 * Math.atan( vExtentSlope );
			this.updateProjectionMatrix();

		}

		/**
		 * Calculates the focal length from the current .fov and .filmGauge.
		 */
		getFocalLength() {

			const vExtentSlope = Math.tan( DEG2RAD * 0.5 * this.fov );

			return 0.5 * this.getFilmHeight() / vExtentSlope;

		}

		getEffectiveFOV() {

			return RAD2DEG * 2 * Math.atan(
				Math.tan( DEG2RAD * 0.5 * this.fov ) / this.zoom );

		}

		getFilmWidth() {

			// film not completely covered in portrait format (aspect < 1)
			return this.filmGauge * Math.min( this.aspect, 1 );

		}

		getFilmHeight() {

			// film not completely covered in landscape format (aspect > 1)
			return this.filmGauge / Math.max( this.aspect, 1 );

		}

		/**
		 * Computes the 2D bounds of the camera's viewable rectangle at a given distance along the viewing direction.
		 * Sets minTarget and maxTarget to the coordinates of the lower-left and upper-right corners of the view rectangle.
		 */
		getViewBounds( distance, minTarget, maxTarget ) {

			_v3.set( - 1, - 1, 0.5 ).applyMatrix4( this.projectionMatrixInverse );

			minTarget.set( _v3.x, _v3.y ).multiplyScalar( - distance / _v3.z );

			_v3.set( 1, 1, 0.5 ).applyMatrix4( this.projectionMatrixInverse );

			maxTarget.set( _v3.x, _v3.y ).multiplyScalar( - distance / _v3.z );

		}

		/**
		 * Computes the width and height of the camera's viewable rectangle at a given distance along the viewing direction.
		 * Copies the result into the target Vector2, where x is width and y is height.
		 */
		getViewSize( distance, target ) {

			this.getViewBounds( distance, _minTarget, _maxTarget );

			return target.subVectors( _maxTarget, _minTarget );

		}

		/**
		 * Sets an offset in a larger frustum. This is useful for multi-window or
		 * multi-monitor/multi-machine setups.
		 *
		 * For example, if you have 3x2 monitors and each monitor is 1920x1080 and
		 * the monitors are in grid like this
		 *
		 *   +---+---+---+
		 *   | A | B | C |
		 *   +---+---+---+
		 *   | D | E | F |
		 *   +---+---+---+
		 *
		 * then for each monitor you would call it like this
		 *
		 *   const w = 1920;
		 *   const h = 1080;
		 *   const fullWidth = w * 3;
		 *   const fullHeight = h * 2;
		 *
		 *   --A--
		 *   camera.setViewOffset( fullWidth, fullHeight, w * 0, h * 0, w, h );
		 *   --B--
		 *   camera.setViewOffset( fullWidth, fullHeight, w * 1, h * 0, w, h );
		 *   --C--
		 *   camera.setViewOffset( fullWidth, fullHeight, w * 2, h * 0, w, h );
		 *   --D--
		 *   camera.setViewOffset( fullWidth, fullHeight, w * 0, h * 1, w, h );
		 *   --E--
		 *   camera.setViewOffset( fullWidth, fullHeight, w * 1, h * 1, w, h );
		 *   --F--
		 *   camera.setViewOffset( fullWidth, fullHeight, w * 2, h * 1, w, h );
		 *
		 *   Note there is no reason monitors have to be the same size or in a grid.
		 */
		setViewOffset( fullWidth, fullHeight, x, y, width, height ) {

			this.aspect = fullWidth / fullHeight;

			if ( this.view === null ) {

				this.view = {
					enabled: true,
					fullWidth: 1,
					fullHeight: 1,
					offsetX: 0,
					offsetY: 0,
					width: 1,
					height: 1
				};

			}

			this.view.enabled = true;
			this.view.fullWidth = fullWidth;
			this.view.fullHeight = fullHeight;
			this.view.offsetX = x;
			this.view.offsetY = y;
			this.view.width = width;
			this.view.height = height;

			this.updateProjectionMatrix();

		}

		clearViewOffset() {

			if ( this.view !== null ) {

				this.view.enabled = false;

			}

			this.updateProjectionMatrix();

		}

		updateProjectionMatrix() {

			const near = this.near;
			let top = near * Math.tan( DEG2RAD * 0.5 * this.fov ) / this.zoom;
			let height = 2 * top;
			let width = this.aspect * height;
			let left = - 0.5 * width;
			const view = this.view;

			if ( this.view !== null && this.view.enabled ) {

				const fullWidth = view.fullWidth,
					fullHeight = view.fullHeight;

				left += view.offsetX * width / fullWidth;
				top -= view.offsetY * height / fullHeight;
				width *= view.width / fullWidth;
				height *= view.height / fullHeight;

			}

			const skew = this.filmOffset;
			if ( skew !== 0 ) left += near * skew / this.getFilmWidth();

			this.projectionMatrix.makePerspective( left, left + width, top, top - height, near, this.far, this.coordinateSystem );

			this.projectionMatrixInverse.copy( this.projectionMatrix ).invert();

		}

		toJSON( meta ) {

			const data = super.toJSON( meta );

			data.object.fov = this.fov;
			data.object.zoom = this.zoom;

			data.object.near = this.near;
			data.object.far = this.far;
			data.object.focus = this.focus;

			data.object.aspect = this.aspect;

			if ( this.view !== null ) data.object.view = Object.assign( {}, this.view );

			data.object.filmGauge = this.filmGauge;
			data.object.filmOffset = this.filmOffset;

			return data;

		}

	}

	class OrthographicCamera extends Camera {

		constructor( left = - 1, right = 1, top = 1, bottom = - 1, near = 0.1, far = 2000 ) {

			super();

			this.isOrthographicCamera = true;

			this.type = 'OrthographicCamera';

			this.zoom = 1;
			this.view = null;

			this.left = left;
			this.right = right;
			this.top = top;
			this.bottom = bottom;

			this.near = near;
			this.far = far;

			this.updateProjectionMatrix();

		}

		copy( source, recursive ) {

			super.copy( source, recursive );

			this.left = source.left;
			this.right = source.right;
			this.top = source.top;
			this.bottom = source.bottom;
			this.near = source.near;
			this.far = source.far;

			this.zoom = source.zoom;
			this.view = source.view === null ? null : Object.assign( {}, source.view );

			return this;

		}

		setViewOffset( fullWidth, fullHeight, x, y, width, height ) {

			if ( this.view === null ) {

				this.view = {
					enabled: true,
					fullWidth: 1,
					fullHeight: 1,
					offsetX: 0,
					offsetY: 0,
					width: 1,
					height: 1
				};

			}

			this.view.enabled = true;
			this.view.fullWidth = fullWidth;
			this.view.fullHeight = fullHeight;
			this.view.offsetX = x;
			this.view.offsetY = y;
			this.view.width = width;
			this.view.height = height;

			this.updateProjectionMatrix();

		}

		clearViewOffset() {

			if ( this.view !== null ) {

				this.view.enabled = false;

			}

			this.updateProjectionMatrix();

		}

		updateProjectionMatrix() {

			const dx = ( this.right - this.left ) / ( 2 * this.zoom );
			const dy = ( this.top - this.bottom ) / ( 2 * this.zoom );
			const cx = ( this.right + this.left ) / 2;
			const cy = ( this.top + this.bottom ) / 2;

			let left = cx - dx;
			let right = cx + dx;
			let top = cy + dy;
			let bottom = cy - dy;

			if ( this.view !== null && this.view.enabled ) {

				const scaleW = ( this.right - this.left ) / this.view.fullWidth / this.zoom;
				const scaleH = ( this.top - this.bottom ) / this.view.fullHeight / this.zoom;

				left += scaleW * this.view.offsetX;
				right = left + scaleW * this.view.width;
				top -= scaleH * this.view.offsetY;
				bottom = top - scaleH * this.view.height;

			}

			this.projectionMatrix.makeOrthographic( left, right, top, bottom, this.near, this.far, this.coordinateSystem );

			this.projectionMatrixInverse.copy( this.projectionMatrix ).invert();

		}

		toJSON( meta ) {

			const data = super.toJSON( meta );

			data.object.zoom = this.zoom;
			data.object.left = this.left;
			data.object.right = this.right;
			data.object.top = this.top;
			data.object.bottom = this.bottom;
			data.object.near = this.near;
			data.object.far = this.far;

			if ( this.view !== null ) data.object.view = Object.assign( {}, this.view );

			return data;

		}

	}

	Object3D.DEFAULT_UP.set( 0, 0, 1 );

	class LocationSource extends EventDispatcher {

		constructor ( ctx ) {

			super();

			const viewer = ctx.viewer;
			const location = new Vector3();

			let watcherId = null;
			let survey = null;

			// install hook to track geopgraphical position
			const updateLocation = position => {

				if ( survey === null ) return;

				const coords = position.coords;

				location.set( coords.longitude, coords.latitude, coords.altitude || 0  );

				// move into survey display CRS coordinates

				location.copy( survey.projectionWGS84.forward( location ) );

				// fake altitude for containsPoint check

				if ( location.z == 0 ) location.z = survey.limits.max.z;

				if ( survey.limits.containsPoint( location ) ) {

					// return location in model space

					location.sub ( survey.offsets );

					// if no altitude we do lookup via DTM is a terrain is present

					if ( coords.altitude === null ) {

						if ( survey.terrain ) {

							// FIXME - needs offset?
							location.z = survey.terrain.getHeight( location );
							console.log( location );

						} else {

							location.z = 0;

						}

					}

					this.dispatchEvent( { type: 'location', location: location, survey: survey } );

					if ( watcherId === null ) {

						console.log( 'in survey', location );
						watcherId = navigator.geolocation.watchPosition( updateLocation );

					}

				} else {

					// FIXME - outside survey area
					console.warn( 'outside survey area' );
					this.dispatchEvent( { type: 'invalid' } );

				}

			};

			viewer.addEventListener( 'newCave', event => {

				if ( event.survey !== undefined ) {

					survey = event.survey;
					navigator.geolocation.getCurrentPosition( updateLocation );

				}

			} );

			viewer.addEventListener( 'clear', () => {

				if ( watcherId !== null ) {

					navigator.geolocatoin.clearWatch( watcherId );
					watcherId = null;

				}

				survey = null;
				this.dispatchEvent( { type: 'invalid' } );

			} );

		}

	}

	class LocationPlugin {

		constructor ( ctx ) {

			if ( ! ( 'geolocation' in navigator ) ) return;

			console.log( 'Location Plugin 0.1' );

			const viewer = ctx.viewer;
			const source = new LocationSource( ctx );

			Object.defineProperties( viewer, {
				'locationSource': {
					get() { return source; }
				}
			} );

		}

	}

	const _camera = new OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );

	// https://github.com/mrdoob/three.js/pull/21358

	const _geometry = new BufferGeometry();
	_geometry.setAttribute( 'position', new Float32BufferAttribute( [ - 1, 3, 0, - 1, - 1, 0, 3, - 1, 0 ], 3 ) );
	_geometry.setAttribute( 'uv', new Float32BufferAttribute( [ 0, 2, 0, 0, 2, 0 ], 2 ) );

	class FullScreenQuad {

		constructor( material ) {

			this._mesh = new Mesh( _geometry, material );

		}

		dispose() {

			this._mesh.geometry.dispose();

		}

		render( renderer ) {

			renderer.render( this._mesh, _camera );

		}

		get material() {

			return this._mesh.material;

		}

		set material( value ) {

			this._mesh.material = value;

		}

	}

	/**
	 * Full-screen textured quad shader
	 */

	const CopyShader = {

		name: 'CopyShader',

		uniforms: {

			'tDiffuse': { value: null },
			'opacity': { value: 1.0 }

		},

		vertexShader: /* glsl */`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,

		fragmentShader: /* glsl */`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`

	};

	var vertexShader = "varying vec2 vUV;\nvoid main() {\n\tvUV = uv;\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}";

	var fragmentShader$1 = "#include <packRGBA>\nuniform sampler2D tSource;\nuniform float beta;\nuniform vec2 offset;\nvarying vec2 vUV;\nvoid main () {\n    vec4 this_pixel = texture( tSource,  vUV );\n    vec4 east_pixel = texture( tSource,  vUV + offset );\n    vec4 west_pixel = texture( tSource,  vUV - offset );\n    float A = unpackRGBAToFloat( this_pixel );\n    float e = beta + unpackRGBAToFloat( east_pixel );\n    float w = beta + unpackRGBAToFloat( west_pixel );\n    float B = min( min( A, e ), w );\n    if ( A == B ) {\n        discard;\n    }\n    gl_FragColor = packFloatToRGBA( B );\n}";

	const DistanceFieldShader  = {
		uniforms: {
			'tSource': { value: null },
			'beta': { value: 1 / 256 },
			'width': { value: 1 },
			'height': { value: 1 },
			'offset': { value: null }
		},
		vertexShader: vertexShader,
		fragmentShader: fragmentShader$1
	};

	class DistanceFieldPass {

		constructor ( width, height, pixelIncrement ) {

			// distance field iteration shader

			this.uniforms = cloneUniforms( DistanceFieldShader.uniforms );
			this.material = new ShaderMaterial( {
				uniforms: this.uniforms,
				fragmentShader: DistanceFieldShader.fragmentShader,
				vertexShader: DistanceFieldShader.vertexShader,
				depthTest: false,
				depthWrite: false
			} );

			this.uniforms.width.value = width;
			this.uniforms.height.value = height;
			this.fsQuad = new FullScreenQuad( this.material );

			// copy shader

			this.copyUniforms = cloneUniforms( CopyShader.uniforms );
			this.copyMaterial = new ShaderMaterial(  {
				uniforms: this.copyUniforms,
				vertexShader: CopyShader.vertexShader,
				fragmentShader: CopyShader.fragmentShader,
				depthTest: false,
				depthWrite: false
			} );

			this.fsQuadCopy = new FullScreenQuad( this.copyMaterial );
			this.pixelIncrement = pixelIncrement;

		}

		render ( renderer, writeBuffer, readBuffer, params ) {

			this.material.uniforms[ 'tSource' ].value = readBuffer.texture;
			this.material.uniforms.beta.value = params.beta / this.pixelIncrement;
			this.material.uniforms.offset.value = params.offset;
			this.material.needsUpdate = true;

			this.copyMaterial.uniforms[ 'tDiffuse' ].value = readBuffer.texture;
			this.copyMaterial.needsUpdate = true;

			renderer.setRenderTarget( writeBuffer );
			renderer.clear();

			this.fsQuadCopy.render( renderer );

			this.fsQuad.render( renderer );

			renderer.getContext().finish();

		}

		dispose () {

			this.fsQuad.dispose();
			this.fsQuadCopy.dispose();

		}

	}

	var fragmentShader = "#include <packRGBA>\nuniform sampler2D tDiffuse;\nvarying vec2 vUV;\nconst vec3 filterColour = vec3( 0.99, 0.99, 0.99 );\nvoid main() {\n\tvec4 colour = texture2D( tDiffuse, vUV );\n\tif ( all( lessThan( colour.rgb, filterColour ) ) ) {\n\t\tgl_FragColor = packFloatToRGBA( 0.0 );\n\t} else {\n\t\tgl_FragColor = packFloatToRGBA( 1.0 );\n\t}\n}";

	const DistanceFieldFilterShader = {

		uniforms: {
			'tDiffuse': { value: null },
			'width': { value: 1 },
			'height': { value: 1 }
		},

		vertexShader: vertexShader,
		fragmentShader: fragmentShader

	};

	class DistanceFieldFilterPass  {

		constructor ( width, height ) {

			this.uniforms = cloneUniforms( DistanceFieldFilterShader.uniforms );
			this.material = new ShaderMaterial( {
				uniforms: this.uniforms,
				fragmentShader: DistanceFieldFilterShader.fragmentShader,
				vertexShader: DistanceFieldFilterShader.vertexShader
			} );

			this.uniforms.width.value = width;
			this.uniforms.height.value = height;

			this.fsQuad = new FullScreenQuad( this.material );

		}

		render ( renderer, writeBuffer, readBuffer  ) {

			this.material.uniforms[ 'tDiffuse' ].value = readBuffer.texture;

			renderer.setRenderTarget( writeBuffer );
			renderer.clear();
			this.fsQuad.render( renderer );

		}

		dispose () {

			this.fsQuad.dispose();

		}

	}

	const LEG_CAVE              = 1;
	const FACE_WALLS            = 11;
	const FACE_SCRAPS           = 12;

	class DistanceLookup {

		scale = 1;
		pixelIncrement = 1;
		textureLookup = null;

		constructor ( textureLookup, pixelIncrement, scale ) {

			this.scale = scale;
			this.pixelIncrement = pixelIncrement;
			this.textureLookup = textureLookup;

		}

		lookup ( point ) {

			return Math.sqrt( this.textureLookup.lookup( point ) * this.pixelIncrement ) * this.scale;

		}

	}

	class DistanceFieldPlugin {

		constructor ( ctx, renderer, scene ) {

			console.log( 'Distance Field Plugin 0.0' );

			if ( ! renderer.capabilities.isWebGL2 ) {

				console.warn( 'DistanceField plugin requires WebGL2' );
				return;

			}

			const viewer = ctx.viewer;

			viewer.addEventListener( 'newCave', createDistanceField );

			function createDistanceField( event ) {

				const survey = event.survey;
				const renderUtils = ctx.renderUtils;

				if ( survey === undefined ) return;

				const width  = 1024;
				const range = survey.combinedLimits.getSize( new Vector3() );
				const scale = range.x / width; // scale metres per texture pixel

				const height = Math.round( range.y / scale );

				// save current display settings
				const cfg = ctx.cfg;
				const savedColor = cfg.themeColorCSS( 'shading.single' );
				const savedShadingMode = survey.getShadingMode();
				const pixelIncrement = 256 * 128; // unit for distance calculations  (full width / pixelIncrement )

				cfg.themeColorCSS( 'shading.single', 'black' );

				const distancePass = new DistanceFieldPass( width, height, pixelIncrement, scale );
				const distanceFilterPass = new DistanceFieldFilterPass( width, height );

				let lastNode = null;

				const renderTarget1 = renderUtils.makeRenderTarget( width, height );
				const renderTarget2 = renderUtils.makeRenderTarget( width, height );

				renderer.setRenderTarget( renderTarget1 );
				renderer.setPixelRatio( 1 );
				renderer.setSize( width, height );
				renderer.setClearColor( 'white', 1.0 );
				renderer.clear();

				const camera = renderUtils.makePlanCamera( ctx.container, survey );

				camera.layers.enable( LEG_CAVE );
				camera.layers.enable( FACE_SCRAPS );
				camera.layers.enable( FACE_WALLS );

				renderer.render( scene, camera );

				let source = renderTarget1;
				let target = renderTarget2;

				distanceFilterPass.render( renderer, target, source );

				const offset = new Vector2();

				runPass( offset.set( 1 / width, 0 ) );  // run pass in x direction
				runPass( offset.set( 0, 1 / height ) ); // run pass in y direction

				// last pass will leave the last target as the source

				dumpTarget( target );

				const textureLookup = renderUtils.makeTextureLookup( renderer, target, survey.combinedLimits );

				const lookup = new DistanceLookup( textureLookup, pixelIncrement, scale );

				console.log( lookup.lookup( new Vector2( 0, 0 ) ) );
				survey.distanceLookup = lookup;

				// drop resources associated with temporary camera
				renderer.renderLists.dispose();

				// restore display settings
				cfg.themeColorCSS( 'shading.single', savedColor );
				survey.setShadingMode( savedShadingMode );

				viewer.resetRenderer();

				renderTarget1.dispose();
				renderTarget2.dispose();

				distanceFilterPass.dispose();
				distancePass.dispose();

				function runPass ( offset ) {

					for ( let i = 1; i < 500; i += 2 ) {

						// the last pass's traget becomes the new source.
						swapBuffers();

						distancePass.render( renderer, target, source, { beta: i, offset: offset } );

					}

				}

				function swapBuffers () {

					const tmp = source;

					source = target;
					target = tmp;

				}

				function dumpTarget ( renderTarget ) {

					const canvas = renderUtils.renderTargetToCanvas( renderer, renderTarget );

					if ( lastNode ) {

						lastNode.replaceWith( canvas );

					} else {

						document.body.appendChild( canvas );

					}

					lastNode = canvas;

				}

			}

		}

	}

	class ARPlugin {

		constructor ( ctx, renderer, scene ) {

			console.log( 'AR Plugin 0.1' );

			const viewer = ctx.viewer;
			const locationSource = viewer.locationSource;
			const camera = new PerspectiveCamera();
			const cameraLocation = new Vector3();
			const materials = ctx.materials;

			let survey = null;
			let savedView = null;

			if ( ! locationSource ) {

				console.warn( 'location plugin must be loaded' );
				return;

			}

			if ( ! ( 'xr' in navigator ) ) return;

			locationSource.addEventListener( 'location', event => {

				if ( ! renderer.xr.enabled ) enable( event );

				// translate events to openGL coords

				cameraLocation.copy( event.location );
				survey.markers.mark( cameraLocation );

				const lookup = survey.distanceLookup;

				const minDistance = lookup.lookup( cameraLocation );
				const maxDistance = minDistance + 500;

				console.log( 'min', minDistance, cameraLocation.x, cameraLocation.y, cameraLocation.z );

				const accuracy = 30; // FIXME dummy value

				materials.setLocation( cameraLocation, accuracy, minDistance, maxDistance );

				cameraLocation.divide( survey.modelLimits.max );

			} );

			function enable  ( event ) {

				console.log( 'has location, enable AR' );

				survey = event.survey;

				// keep in survey CRS
				// ctx.cfg.setValue( 'displayCRS', 'ORIGINAL' );

				document.body.appendChild( ARButton.createButton( renderer, {} ) );

				renderer.xr.enabled = true;

				// listen for survey events

				locationSource.addEventListener( 'invalid', () => {

					const session = renderer.getSession();

					if ( session ) session.end();

					survey = null;
					renderer.xr.enabled = false;

				} );

				renderer.xr.addEventListener( 'sessionstart', onSessionStart );

			}

			function onSessionStart () {

				survey.rotateX( - Math.PI / 2 );
				survey.updateMatrix();

				savedView = viewer.getView();

				viewer.HUD = false;
				viewer.linewidth = 1;

				scene.onBeforeRender = onSceneBeforeRender;
				renderer.setAnimationLoop( () => renderer.render( scene, camera ) );

				renderer.xr.addEventListener( 'sessionend', onSessionEnd );

			}

			function onSessionEnd () {

				renderer.xr.removeEventListener( 'sessionend', onSessionEnd );

				renderer.setAnimationLoop( null );
				scene.onBeforeRender = function () {};

				survey.rotateX( Math.PI / 2 );
				survey.updateMatrix();

				// reset initial view state
				viewer.setView( savedView );

			}

			function onSceneBeforeRender ( renderer, scene, camera ) {

				if ( camera.isArrayCamera && location !== null && camera.cameras.length ) {

					const cameraL = camera.cameras[ 0 ];
					cameraL.layers.enableAll();
					camera.layers.enableAll();

					// account for rotated coord system
					cameraL.position.x = cameraLocation.x;
					cameraL.position.z = cameraLocation.y;
					cameraL.position.y = cameraLocation.z + 0.75;

				}

			}

		}

	}

	class ARButton {

		static createButton( renderer, sessionInit = {} ) {

			const button = document.createElement( 'button' );

			function showStartAR( /*device*/ ) {

				if ( sessionInit.domOverlay === undefined ) {

					const overlay = document.createElement( 'div' );
					overlay.style.display = 'none';
					document.body.appendChild( overlay );

					const svg = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' );
					svg.setAttribute( 'width', 38 );
					svg.setAttribute( 'height', 38 );
					svg.style.position = 'absolute';
					svg.style.right = '20px';
					svg.style.top = '20px';
					svg.addEventListener( 'click', function () {

						currentSession.end();

					} );
					overlay.appendChild( svg );

					const path = document.createElementNS( 'http://www.w3.org/2000/svg', 'path' );
					path.setAttribute( 'd', 'M 12,12 L 28,28 M 28,12 12,28' );
					path.setAttribute( 'stroke', '#fff' );
					path.setAttribute( 'stroke-width', 2 );
					svg.appendChild( path );

					if ( sessionInit.optionalFeatures === undefined ) {

						sessionInit.optionalFeatures = [];

					}

					sessionInit.optionalFeatures.push( 'dom-overlay' );
					sessionInit.domOverlay = { root: overlay };

				}

				//

				let currentSession = null;

				async function onSessionStarted( session ) {

					session.addEventListener( 'end', onSessionEnded );

					renderer.xr.setReferenceSpaceType( 'local' );

					await renderer.xr.setSession( session );

					button.textContent = 'STOP AR';
					sessionInit.domOverlay.root.style.display = '';

					currentSession = session;

				}

				function onSessionEnded( /*event*/ ) {

					currentSession.removeEventListener( 'end', onSessionEnded );

					button.textContent = 'START AR';
					sessionInit.domOverlay.root.style.display = 'none';

					currentSession = null;

				}

				//

				button.style.display = '';

				button.style.cursor = 'pointer';
				button.style.left = 'calc(50% - 50px)';
				button.style.width = '100px';

				button.textContent = 'START AR';

				button.onmouseenter = function () {

					button.style.opacity = '1.0';

				};

				button.onmouseleave = function () {

					button.style.opacity = '0.5';

				};

				button.onclick = function () {

					if ( currentSession === null ) {

						navigator.xr.requestSession( 'immersive-ar', sessionInit ).then( onSessionStarted );

					} else {

						currentSession.end();

					}

				};

			}

			function disableButton() {

				button.style.display = '';

				button.style.cursor = 'auto';
				button.style.left = 'calc(50% - 75px)';
				button.style.width = '150px';

				button.onmouseenter = null;
				button.onmouseleave = null;

				button.onclick = null;

			}

			function showARNotSupported() {

				disableButton();

				button.textContent = 'AR NOT SUPPORTED';

			}

			function showARNotAllowed( exception ) {

				disableButton();

				console.warn( 'Exception when trying to call xr.isSessionSupported', exception );

				button.textContent = 'AR NOT ALLOWED';

			}

			function stylizeElement( element ) {

				element.style.position = 'absolute';
				element.style.bottom = '20px';
				element.style.padding = '12px 6px';
				element.style.border = '1px solid #fff';
				element.style.borderRadius = '4px';
				element.style.background = 'rgba(0,0,0,0.1)';
				element.style.color = '#fff';
				element.style.font = 'normal 13px sans-serif';
				element.style.textAlign = 'center';
				element.style.opacity = '0.5';
				element.style.outline = 'none';
				element.style.zIndex = '999';

			}

			if ( 'xr' in navigator ) {

				button.id = 'ARButton';
				button.style.display = 'none';

				stylizeElement( button );

				navigator.xr.isSessionSupported( 'immersive-ar' ).then( function ( supported ) {

					supported ? showStartAR() : showARNotSupported();

				} ).catch( showARNotAllowed );

				return button;

			}

		}

	}

	class ModelSource {

		static lastId = 0;

		name = null;
		files = [];
		local = true;

		constructor ( files, local ) {

			this.files = files;
			this.local = local;
			this.id = ModelSource.lastId++;

		}

		addFile ( file ) {

			this.files.push( file );

		}

		getNames () {

			return this.files.map( v => v.name );

		}

		static makeModelSourceFiles( files ) {

			const source = new ModelSource( [], false );

			files.forEach( file => source.addFile( { name: file } ) );

			return source;

		}

	}

	class OSFilePlugin {

		constructor ( ctx ) {

			const viewer = ctx.viewer;

			if ( 'launchQueue' in window && 'files' in LaunchParams.prototype) {

				console.log( 'os lauch supported' );

				window.launchQueue.setConsumer( ( launchParams ) => {

					const filePromises = [];

					for ( const fileHandle of launchParams.files ) {

						console.log( 'file', fileHandle.name );
						filePromises.push( fileHandle.getFile() );

					}

					Promise.all( filePromises )
						.then( files => {

							if ( ctx.ui ) {

								ctx.ui.loadLocalFiles( files );

							} else {

								viewer.loadCave( new ModelSource( files, true ) );

							}

						} )
						.catch( console.warn( 'error opening files' ) );

				} );

			}

		}

	}

	exports.ARPlugin = ARPlugin;
	exports.DistanceFieldPlugin = DistanceFieldPlugin;
	exports.LocationPlugin = LocationPlugin;
	exports.OSFilePlugin = OSFilePlugin;

}));
