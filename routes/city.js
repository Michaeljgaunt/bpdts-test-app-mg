const express = require('express');
const union = require('lodash.union')

const geoUtils = require('../utils/geoUtils.js');
const APIUtils = require('../utils/APIUtils.js');
const config = require('../config.js');
const cities = require('../data/coordinates.js').cities;

const router = new express.Router();

router.get("/:city", async (req, res) => { //e.g. http://localhost:3000/users/London
	city = req.params.city
	city = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase() //input city into Proper Case
	console.log(`Requested city: ${city}`)
	
	//Read coordinates of city from disk
	try {
		centroid = geoUtils.getCoordinates(city)	
	} catch (err) {
		res.status(400).json({"errorCode":400, "errorType":"Bad Request", "errorMsg":err.message, "supportedCities":Object.keys(cities)});
		console.log(err);
		return
	}

	//Request user data from https://bpdts-test-app.herokuapp.com API
	try {
		cityUsers = await APIUtils.getCityUsers(city);	
		allUsers = await APIUtils.getAllUsers();
		console.log(`Received ${cityUsers.data.length + allUsers.data.length} records`)
	} catch (err) {
		console.log(err);
		res.status(503).json({"errorCode": 503, "errorType":"Service Unavailable", "errorMsg": "Unable to retrieve user data from https://bpdts-test-app.herokuapp.com"});
		return
	}

	//Filter users within n miles of the centroid  (n is defined in config.js, defaulting to 50 miles)
	dist = (typeof config.distance !== 'undefined') ? config.distance : 50
	try {
		console.log(`Filtering for users within ${dist} miles of ${city}`)
		filteredUsers = [];		
		allUsers.data.forEach(user => geoUtils.checkWithin([user.longitude, user.latitude], centroid, dist=dist) && filteredUsers.push(user));
	} catch (err) {
		console.log(err);
		res.status(500).json({"errorCode": 400, "errorType":"Bad Request", "errorMsg":err.message});
		return
	}

	//Push any users who live in the city into the filtered list (if they are not already in it)
	for (var i = 0; i < cityUsers.data.length; i++) {
		if (!filteredUsers.some(user => user.id === cityUsers.data[i].id)) {
			filteredUsers.push(cityUsers.data[i]);
		}
	}

	console.log(`Sending ${filteredUsers.length} filtered records`)
	res.status(200).json(filteredUsers.length > 0 ? filteredUsers : `No results found for users within ${dist} miles of ${city}`);
});

module.exports = router;