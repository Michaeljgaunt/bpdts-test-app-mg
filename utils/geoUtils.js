const fs = require('fs');
const turf = require('@turf/turf');

exports.getCoordinates = (city) => {
	let rawJSON = fs.readFileSync('./data/coordinates.json');
	let parsed = JSON.parse(rawJSON);

	//Check city is supported (only London for this example app)
	if (parsed[city.toUpperCase()] === undefined) throw {"errorMsg":`Unsupported city: ${city}`, "description":"Input must be a supported city."}//`Unsupported city: "${city}" <br/> Check that the input city is in Proper Case (e.g. London)`

	return parsed[city.toUpperCase()]
}

exports.checkWithin = (userCoords, cityCoords, dist=50) => {
	let userPt = new turf.point(userCoords)
	let cityPt = new turf.point(cityCoords)
	return turf.distance(userPt, cityPt, {units: 'miles'}) <= dist
}