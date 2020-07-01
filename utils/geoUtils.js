const fs = require('fs');

exports.getCityPolygon = (city) => {

	file = `./data/${city.toLowerCase()}.json`
	console.log(`Reading polygon from "${file}"`)
	
	try {
		//Check the file exists on the server
		if (!fs.existsSync(file)) throw `Cannot find GeoJSON file for ${city}: "${file}"`
		//Parse and return
		let rawJSON = fs.readFileSync(file);
		let geoJSON = JSON.parse(rawJSON);		
		return geoJSON;
	} catch (err) {
		console.log(err);
	}
	
}
