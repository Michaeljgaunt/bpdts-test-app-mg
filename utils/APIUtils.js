const axios = require('axios');
const config = require('../config.js')

exports.getCityUsers = (city) => {
	console.log(`Requesting user data from "${config.APIbaseURL}/city/${city}/users"`);
	return axios.get(`${config.APIbaseURL}/city/${city}/users`);
}

exports.getAllUsers = () => {
	console.log(`Requesting user data from "${config.APIbaseURL}/users"`);
	return axios.get(`${config.APIbaseURL}/users`);
}