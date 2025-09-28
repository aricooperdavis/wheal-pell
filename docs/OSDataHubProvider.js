
class OSDataHubProvider {

	constructor (
		tileSet,
		key
	) {
		this.key = key;
		this.tileSet = tileSet;
	}

	getUrl ( x, y, z ) {

		const key = this.key;
		const tileSet = this.tileSet;

		return `https://api.os.uk/maps/raster/v1/zxy/${tileSet}/${z}/${x}/${y}.png?key=${key}`;

	}

	getAttribution () {

		const span = document.createElement( 'span' );
		const a1 = document.createElement( 'p' );

		span.appendChild( a1 );

		a1.style.color = 'black';
		a1.textContent = 'Contains OS data © Crown copyright and database rights 2025';

		return span;

	}

}
