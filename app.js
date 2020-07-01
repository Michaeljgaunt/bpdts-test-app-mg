const express = require('express');
const app = express();

const config = require('./config.json')
const cityRoute = require('./routes/city.js');

app.listen(config.port, () => { //Define the port to listen on in config.json
	console.log(`Server listening on port ${config.port}`)
});

app.use('/users', cityRoute);

module.exports = app;