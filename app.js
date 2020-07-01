const express = require('express');
const app = express();

const cityRoute = require('./routes/city.js');

app.listen(3000, function() {
	console.log("Server listening on port 3000")
});

app.use('/users', cityRoute);

module.exports = app;