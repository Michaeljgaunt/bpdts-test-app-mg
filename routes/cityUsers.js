const express = require('express');

const geoUtils = require('../utils/geoUtils.js');
const APIUtils = require('../utils/APIUtils.js');
const config = require('config')
const cities = require('../data/cityCoordinates.js').cities;

const router = new express.Router();

//e.g. http://localhost:3000/users/London
router.get("/:city", async (req, res) => { 
	city = req.params.city
	city = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase() //input city into proper case
	console.log(`Requested city: ${city}`)
	
	//Read coordinates of input city
	try {
		cityCoords = geoUtils.getCoordinates(city)	
	} catch (err) {
		console.error(err);
		res.status(400).json({"errorCode":400, "errorType":"Bad Request", "errorMsg":err.message, "supportedCities":Object.keys(cities)});
		return
	}

	//Request user data from external API
	try {
		cityUsers = await APIUtils.getCityUsers(city);	
		allUsers = await APIUtils.getAllUsers();
		console.log(`Received ${cityUsers.data.length + allUsers.data.length} records`)
	} catch (err) {
		console.error(err);
		res.status(503).json({"errorCode": 503, "errorType":"Service Unavailable", "errorMsg": "Unable to retrieve user data from https://bpdts-test-app.herokuapp.com"});
		return
	}

	//Filter users within n miles of the city coords  (n is defined in config.js, defaulting to 50 miles)	
	dist = (typeof config.distance === undefined) ? 50 :config.distance
	try {
		console.log(`Filtering for users within ${dist} miles of ${city}`)
		filteredUsers = [];		
		allUsers.data.forEach(user => geoUtils.checkWithin([user.longitude, user.latitude], cityCoords, dist=dist) && filteredUsers.push(user));
	} catch (err) {
		console.error(err);
		res.status(500).json({"errorCode": 400, "errorType":"Bad Request", "errorMsg":err.message});
		return
	}

	//Push any users who live in the city into the filtered list (but only if they are not already in it)
	for (var i = 0; i < cityUsers.data.length; i++) {
		if (!filteredUsers.some(user => user.id === cityUsers.data[i].id)) {
			filteredUsers.push(cityUsers.data[i]);
		}
	}

	//Sort by ID to make it look better
	filteredUsers.sort((x, y) => x.id < y.id ? -1 : 1)

	console.log(`Sending ${filteredUsers.length} filtered records`)
	res.status(200).json(filteredUsers.length > 0 ? filteredUsers : `No results found for users within ${dist} miles of ${city}`);
});

module.exports = router;