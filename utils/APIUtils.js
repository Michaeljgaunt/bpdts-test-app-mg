const axios = require('axios');
const config = require('../config.js')

/**
* Get the users living in a given city from an external API
* 
* @param {string} city - city to get the users from
* @returns {Object[]} array of users
*/
exports.getCityUsers = (city) => {
	console.log(`Requesting user data from "${config.APIbaseURL}/city/${city}/users"`);
	return axios.get(`${config.APIbaseURL}/city/${city}/users`);
}

/**
* Get all the users from an external API
* 
* @returns {Object[]} array of users
*/
exports.getAllUsers = () => {
	console.log(`Requesting user data from "${config.APIbaseURL}/users"`);
	return axios.get(`${config.APIbaseURL}/users`);
}