
class NLSProvider {

	constructor (
		mapPath
	) {
		this.mapPath = mapPath;
	}

	getUrl ( x, y, z ) {

		const mapPath = this.mapPath;

		return `https://mapseries-tilesets.s3.amazonaws.com/${mapPath}/${z}/${x}/${y}.png`;

	}

	getAttribution () {

		const span = document.createElement( 'span' );
		const a1 = document.createElement( 'a' );
		span.appendChild( a1 );

		a1.style.color = 'black';
		a1.textContent = 'CC-BY National Library of Scotland';
		a1.href = 'https://maps.nls.uk/';

		return span;

	}

}
