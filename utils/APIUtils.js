const axios = require('axios');

const baseURL = "https://bpdts-test-app.herokuapp.com"

exports.getCityUsers = (city) => {
	console.log(`Requesting user data from "${baseURL}/city/${city}/users"`);
	return axios.get(`${baseURL}/city/${city}/users`);
}

exports.getAllUsers = () => {
	console.log(`Requesting user data from "${baseURL}/users"`);
	return axios.get(`${baseURL}/users`);
}