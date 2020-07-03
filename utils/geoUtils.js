const turf = require('@turf/turf');
const cities = require('../data/coordinates.js').cities;

exports.getCoordinates = (city) => {
	//Check city is valid and supported (only London for this example app)
	if (typeof(city) != 'string') throw new Error("city must be of type string")
	if (cities[city.toUpperCase()] === undefined) throw new Error(`${city} is not a recognized/supported city`)

	return cities[city.toUpperCase()]	
}

exports.checkWithin = (userCoords, cityCoords, dist=50) => {
	if ((typeof(dist) != 'number') || (dist < 0)) throw new Error('Dist must be a positive number; check value in config.js');
	let userPt = new turf.point(userCoords)
	let cityPt = new turf.point(cityCoords)
	return turf.distance(userPt, cityPt, {units: 'miles'}) <= dist
}