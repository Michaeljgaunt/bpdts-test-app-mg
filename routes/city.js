const express = require('express');
const geoUtils = require('../utils/geoUtils.js');
const APIUtils = require('../utils/APIUtils.js');

const supportedCities = ["London"]; //Only supporting London for this example application
const router = new express.Router();

router.get("/:city", async (req, res) => { //e.g. http://localhost:3000/users/London

	city = req.params.city
	console.log(`Requested city: ${city}`)

	//Ensure input city is supported
	try {		
		if (supportedCities.indexOf(city) === -1) throw `Unsupported input: "${req.params.city}"`	
	} catch (err) {
		console.log(err);
		res.send(`Unsupported input: "${req.params.city}" <br/> Check that the input city is in Proper Case (e.g. London)`);
		return
	}
	
	//Grab GeoJSON envelope
	geoJSON = geoUtils.getCityPolygon(city);

	//Request user data from https://bpdts-test-app.herokuapp.com/
	try {
		cityUsers = await APIUtils.getCityUsers(city);	
		allUsers = await APIUtils.getAllUsers();
	} catch (err) {
		console.log(err);
		res.send("Error retrieving user data from API \"https://bpdts-test-app.herokuapp.com/\"");
		return
	}

	res.send(allUsers.data);
	
});

module.exports = router;