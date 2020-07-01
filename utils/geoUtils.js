const fs = require('fs');
const turf = require('@turf/turf');
const gdal = require('gdal');
const wkt = require('wkt');
const utm = require('utm-zone');

exports.getCityPolygon = (city) => {

	file = `./data/${city.toLowerCase()}.json`
	console.log(`Reading polygon from "${file}"`)
	
	try {
		//Check the file exists on the server
		if (!fs.existsSync(file)) throw `Cannot find GeoJSON file for ${city}: "${file}"`
		//Parse and return
		let rawJSON = fs.readFileSync(file);
		let geoJSON = JSON.parse(rawJSON);		
		//return geoJSON;
		let wellKnownText = wkt.stringify(geoJSON)
		return gdal.Geometry.fromWKT(wellKnownText)
	} catch (err) {
		console.log(err);
	}
	
}

exports.getBufferedEnvelope = (envelope, dist=50) => {
	
	//center = turf.center(envelope).geometry.coordinates;
	//factor = 1///Math.cos(center[1]*Math.PI/180);
	//console.log(`Buffering envelope by ${dist} miles with a factor of ${factor}`);
	//envelope = turf.simplify(envelope); //Optimize future calculations by simplifying the polygon
	//bufferedEnvelope = turf.buffer(envelope, dist*factor, {units:'miles'}) //Buffer the polygon by dist miles.
	//return bufferedEnvelope

	//Get UTM zone from centroid and convert to a Proj4 String
	let centroid = envelope.centroid().toObject();
	let projStr = utm.proj(centroid)
	
	//Proj4 String to GDAL SRS and use to convert envelope to UTM
	let srs = gdal.SpatialReference.fromProj4(projStr);
	console.log(srs)
	envelope.transformTo(srs);

	return envelope.buffer(50).toObject();

}

exports.checkWithin = (lon, lat, envelope) => {
	console.log(lon);
	console.log(lat);
	point = turf.point([lon, lat]);
	console.log(point);
	polygon = turf.polygon(envelope);
	console.log(polygon);
	return turf.booleanPointInPolygon(point, polygon)

}