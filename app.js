const express = require('express');
const app = express();

const config = require('config')
const cityUsers = require('./routes/cityUsers.js');

//Define the port to listen on in config.js
app.listen(config.port, () => { 
	console.log(`Server listening on port ${config.port}`)
});

app.set('json spaces', 2) //Set to pretty print JSON responses
app.use('/users', cityUsers);

module.exports = app;