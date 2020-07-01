const express = require('express');
const geoUtils = require('../utils/geoUtils.js');
const APIUtils = require('../utils/APIUtils.js');
const gdal = require('gdal');

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
	envelope = geoUtils.getCityPolygon(city);

	//Request user data from https://bpdts-test-app.herokuapp.com/
	try {
		cityUsers = await APIUtils.getCityUsers(city);	
		allUsers = await APIUtils.getAllUsers();
	} catch (err) {
		console.log(err);
		res.send("Error retrieving user data from API \"https://bpdts-test-app.herokuapp.com/\"");
		return
	}

	//Filter users within 50 miles of the envelope 
	try {
		bufEnvelope = await geoUtils.getBufferedEnvelope(envelope) //Buffer envelope by 50 miles
		filteredUsers = [];		
		//If user is within the valid envelope, push to the filtered array
		//allUsers.data.forEach(user => geoUtils.checkWithin(user.longitude, user.latitude, bufEnvelope) && filteredUsers.push(user));
	} catch (err) {
		console.log(err);
		res.send("Error filtering users");
		return
	}
	
	res.send(bufEnvelope);
});

module.exports = router;