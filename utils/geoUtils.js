/**
 * A module that provides geospatial functions
 * @module geoUtils
 */

const turf = require('@turf/turf');
const cities = require('../data/cityCoordinates.js').cities;

/**
* Get the coordinates of a given city
* 
* @param {string} city - city to get the coordinates of
* @returns {number[]} 2-element coordinate array in the form [longitude, latitude]
*/
exports.getCoordinates = (city) => {
	//Check city is valid and supported (only London for this example app)
	if (typeof(city) != 'string') throw new Error("city must be of type string")
	if (cities[city.toUpperCase()] === undefined) throw new Error(`${city} is not a recognized/supported city`)

	return cities[city.toUpperCase()]	
}

/**
* Check whether two sets of coordinates are within a given distance in miles.
* 
* @param {number[]} firstCoords - 2-element coordinate array in the form [longitude, latitude]
* @param {number[]} cityCoords - 2-element coordinate array in the form [longitude, latitude]
* @param {number} [dist=50] - numerical value of the distance threshold to consider a user within a city.
* @returns {boolean} - returns true if coordinates are within the given distance
*/
exports.checkWithin = (firstCoords, secondCoords, dist=50) => {
	if ((typeof(dist) != 'number') || (dist < 0)) throw new Error('Dist must be a positive number; check value in config.js');
	let firstPt  = new turf.point(firstCoords)
	let secondPt = new turf.point(secondCoords)
	return turf.distance(firstPt, secondPt, {units: 'miles'}) <= dist
}
