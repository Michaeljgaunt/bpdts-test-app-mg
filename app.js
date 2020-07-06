const express = require('express');
const app = express();
const swaggerUI = require('swagger-ui-express')

const config = require('config');
const cityUsers = require('./routes/cityUsers.js');

//Swagger configuration
const swaggerSpec = require('./config/swagger.json')
const swaggerOpts = {
	swaggerOptions: {
		defaultModelsExpandDepth: -1,
		defaultModelExpandDepth: -1
	}
};

app.set('json spaces', 2) //Set to pretty print JSON responses
app.use('/users', cityUsers); //Main route
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec, swaggerOpts)); //Documentation route

//Define the port to listen on in config.js
app.listen(config.port, () => { 
	console.log(`Server listening on port ${config.port}`)
});

module.exports = app;