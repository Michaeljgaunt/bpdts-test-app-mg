const should = require('chai').should();
const expect = require('chai').expect;
//const app = require('../app');
const nock = require('nock');

const testData = require('./testData.js')
const geoUtils = require('../utils/geoUtils.js')
const APIUtils = require('../utils/APIUtils.js')

beforeEach(() => {
	console.log = (message) => {
		//Eat any console messages to keep the mocha output looking nice
	}
});

describe("geoUtils.getCoordinates() - Retrieve the coordinates of an input city", () => {
	context("Called with valid input", () => {
		it("Should return [-0.118092, 51.509865] with Proper Case input", () => {
 			coords = geoUtils.getCoordinates("London");		
 			expect(coords).to.be.an('array');
 			expect(coords).to.eql([-0.118092, 51.509865]);
		});
		it("Should return [-0.118092, 51.509865] with mixed case input", () => {
			coords = geoUtils.getCoordinates("loNDoN");			
			expect(coords).to.be.an('array');
			expect(coords).to.eql([-0.118092, 51.509865]);
		});
	});	
	context("Called with invalid input", () => {
		it("Should throw an error", () => {
			let city = "fake city"
			should.throw(() => geoUtils.getCoordinates(city), Error);
		});
	});
});

describe("geoUtils.checkWithin() - Check whether a set of coordinates are within a certain distance of each other", () => {
	let cityCoords = [-0.118092, 51.509865]
	context("Called with first coordinates ~1700 miles away from second coordinates", () => {
		let userCoords = [37.62, 55.75]
		it("Should return false with default distance threshold of 50 miles", () => {
			expect(geoUtils.checkWithin(userCoords, cityCoords)).to.equal(false);
		});
		it("Should return false with distance threshold manually set to 1000 miles", () => {
			expect(geoUtils.checkWithin(userCoords, cityCoords, dist=1000)).to.equal(false);
		});
		it("Should return true with distance threshold manually set to 10000 miles", () => {
			expect(geoUtils.checkWithin(userCoords, cityCoords, dist=10000)).to.equal(true);
		});
	});
	context("Called with first coordinates ~15 miles away from second coordinates", () => {
		let userCoords = [-0.45, 51.47]
		it("Should return true with default distance threshold of 50 miles", () => {
			expect(geoUtils.checkWithin(userCoords, cityCoords)).to.equal(true);
		});
		it("Should return true with distance threshold manually set to 1000 miles", () => {
			expect(geoUtils.checkWithin(userCoords, cityCoords, dist=1000)).to.equal(true);
		});
		it("Should return true with distance threshold manually set to 10000 miles", () => {
			expect(geoUtils.checkWithin(userCoords, cityCoords, dist=10000)).to.equal(true);
		});		
	});
	context("Called with first coordinates == second coordinates", () => {
		let userCoords = cityCoords
		it("Should return true", () => {
			expect(geoUtils.checkWithin(userCoords, cityCoords)).to.equal(true);
		});		
	});
	context("Called with invalid inputs", () => {
		it("Should throw an error with non-array coordinates", () => {
			should.throw(() => geoUtils.checkWithin(23.45, cityCoords), Error);
		});	
		it("Should throw an error with non-numerical coordinates", () => {
			should.throw(() => geoUtils.checkWithin(userCoords, "cityCoords"), Error);
		});
		it("Should throw an error with non-numerical distance threshold", () => {
			should.throw(() => geoUtils.checkWithin(userCoords, cityCoords, dist="dist"), Error);
		});
	});
});

let baseURL = "https://bpdts-test-app.herokuapp.com"
describe("APIUtils.getAllUsers() - Retrieve all users from https://bpdts-test-app.herokuapp.com/users", () => {
	nock(baseURL).persist().get("/users").reply(200, testData.allUsers);
	context("Called with valid input", () => {
		it("Should return six users", () => {
			APIUtils.getAllUsers().then(response => {
				expect(response.data).to.be.an('array');
				expect(response.data).to.have.lengthOf(6);
			});
		});
	});
});

describe("APIUtils.getCityUsers() - Retrieve users living in a city from https://bpdts-test-app.herokuapp.com/city/${city}/users", () => {	
	context("Called with valid input", () => {
		nock(baseURL).get('/city/London/users').reply(200, testData.cityUsers);
		it("Should return three users", () => {
			APIUtils.getCityUsers("London").then(response => {
				expect(response.data).to.be.an('array');
				expect(response.data).to.have.lengthOf(3);
			});
		});
	});
	context("Called with invalid input", () => {
		nock(baseURL).persist().get("/city/notreal/users").reply(200, testData.emptyUsers);
		it("Should return zero users", () => {
			APIUtils.getCityUsers("notreal").then(response => {
				expect(response.data).to.be.an('array');
				expect(response.data).to.have.lengthOf(0);
			});
		});
	});
});