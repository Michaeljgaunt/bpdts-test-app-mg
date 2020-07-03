const mocha = require('mocha');
const chai = require("chai");
chai.use(require("chai-http"));
const nock = require("nock");

const expect = chai.expect;
const testData = require("./testData.js")
const config = require('../config.js')

const app 	   = require("../app.js")
const geoUtils = require("../utils/geoUtils.js")
const APIUtils = require("../utils/APIUtils.js")


let mockAPI = nock(config.APIbaseURL);

beforeEach(() => {
	console.log = (message) => {
		//Eat any console messages to keep the mocha output looking nice
	}
});

// GEOUTILS TESTS ///////////////////////////////////////////////////////////////////////

describe("<<------ Utility functions ------>>", () => {

	describe("geoUtils.getCoordinates() - Retrieve the coordinates of an input city", () => {
		context("Called with valid input", () => {
			it("Return [-0.118092, 51.509865] (proper case input)", () => {
	 			coords = geoUtils.getCoordinates("London");		
	 			expect(coords).to.be.an('array');
	 			expect(coords).to.eql([-0.118092, 51.509865]);
			});
			it("Return [-0.118092, 51.509865] (mixed case input)", () => {
				coords = geoUtils.getCoordinates("loNDoN");			
				expect(coords).to.be.an('array');
				expect(coords).to.eql([-0.118092, 51.509865]);
			});
		});	
		context("Called with invalid input", () => {
			it("Return an error (unsupported input)", () => {
				let city = "fake city"
				expect(() => geoUtils.getCoordinates(city)).to.throw(`${city} is not a recognized/supported city`);
			});
			it("Return an error (non-string input)", () => {
				let city = 564
				expect(() => geoUtils.getCoordinates(city)).to.throw("city must be of type string");
			});
		});

	});

	describe("geoUtils.checkWithin() - Check whether a set of coordinates are within a certain distance of each other", () => {
		let cityCoords = [-0.118092, 51.509865]
		context("Called with first coordinates ~1700 miles away from second coordinates", () => {
			let userCoords = [37.62, 55.75]
			it("Return false (default dist)", () => {
				expect(geoUtils.checkWithin(userCoords, cityCoords)).to.equal(false);
			});
			it("Return false (dist 1000)", () => {
				expect(geoUtils.checkWithin(userCoords, cityCoords, dist=1000)).to.equal(false);
			});
			it("Return true (dist 10000)", () => {
				expect(geoUtils.checkWithin(userCoords, cityCoords, dist=10000)).to.equal(true);
			});
		});
		context("Called with first coordinates ~15 miles away from second coordinates", () => {
			let userCoords = [-0.45, 51.47]
			it("Return true (default dist)", () => {
				expect(geoUtils.checkWithin(userCoords, cityCoords)).to.equal(true);
			});
			it("Return true (dist 1000)", () => {
				expect(geoUtils.checkWithin(userCoords, cityCoords, dist=1000)).to.equal(true);
			});
			it("Return true (dist 10000)", () => {
				expect(geoUtils.checkWithin(userCoords, cityCoords, dist=10000)).to.equal(true);
			});		
		});
		context("Called with first coordinates == second coordinates", () => {
			let userCoords = cityCoords
			it("Return true", () => {
				expect(geoUtils.checkWithin(userCoords, cityCoords)).to.equal(true);
			});		
		});
		context("Called with invalid inputs", () => {
			let userCoords = [-0.45, 51.47]
			it("Return an error (non-array coordinates)", () => {
				expect(() => geoUtils.checkWithin(23.45, cityCoords)).to.throw('coordinates must be an Array')
			});	
			it("Return an error (non-numerical coordinates)", () => {
				expect(() => geoUtils.checkWithin(userCoords, "cityCoords")).to.throw('coordinates must be an Array')
			});
			it("Return an error (non-numerical distance threshold)", () => {
				expect(() => geoUtils.checkWithin(userCoords, cityCoords, dist="dist")).to.throw('Dist must be a positive number')
			});
			it("Return an error (negative distance threshold)", () => {
				expect(() => geoUtils.checkWithin(userCoords, cityCoords, dist=-3)).to.throw('Dist must be a positive number')
			});
		});
	});

	// APIUTILS TESTS ///////////////////////////////////////////////////////////////////////

	describe(`APIUtils.getAllUsers() - Retrieve all users from ${config.APIbaseURL}/users`, () => {
		mockAPI.get("/users").reply(200, testData.allUsers);
		context("Called with valid input", () => {
			it("Return six users", () => {
				APIUtils.getAllUsers().then(res => {
					expect(res.data).to.be.an('array');
					expect(res.data).to.have.lengthOf(6);
					expect(res.status).to.equal(200);
				});
			});
		});
	});

	describe(`APIUtils.getCityUsers() - Retrieve users living in a city from ${config.APIbaseURL}/city/:city/users`, () => {	
		context("Called with valid input", () => {
			mockAPI.get('/city/London/users').reply(200, testData.londonUsers);
			it("Return three users", () => {
				APIUtils.getCityUsers("London").then(res => {
					expect(res.data).to.be.an('array');
					expect(res.data).to.have.lengthOf(3);
					expect(res.status).to.equal(200);
				});
			});
		});
		context("Called with invalid input", () => {
			mockAPI.get("/city/notreal/users").reply(200, testData.emptyUsers);
			it("Return zero users", () => {
				APIUtils.getCityUsers("notreal").then(res => {
					expect(res.data).to.be.an('array');
					expect(res.data).to.have.lengthOf(0);
					expect(res.status).to.equal(200);
				});
			});
		});
	});
});

// ROUTE TESTS ////////////////////////////////////////////////////////////////////

describe("<<------------- API ------------->>", () => {

	describe("/users/:city route - Retrieve users living in or within 50 miles of :city", () => {
		context("Called with valid input", () => {
			it("Return response code 200 and five users (proper case input; allUsers API returning 2 users; cityUsers API returning 3 users)", async () => {
				mockAPI.get("/users").reply(200, testData.allUsers);
				mockAPI.get('/city/London/users').reply(200, testData.londonUsers);
				const res = await chai.request(app).get("/users/London")
				expect(res.body).to.have.lengthOf(5);
				expect(res.status).to.equal(200);
				res.body.forEach(user => {
					expect(user.id).to.be.oneOf([2,5,7,8,9])
				});
			});		
			it("Return response code 200 and five users (mixed case input; allUsers API returning 2 users; cityUsers API returning 3 users)", async () => {
				mockAPI.get("/users").reply(200, testData.allUsers);
				mockAPI.get('/city/London/users').reply(200, testData.londonUsers);
				const res = await chai.request(app).get("/users/loNDoN")
				expect(res.body).to.have.lengthOf(5);
				expect(res.status).to.equal(200);
				res.body.forEach(user => {
					expect(user.id).to.be.oneOf([2,5,7,8,9])
				});
			});		
			it("Return response code 200 and two users (allUsers API returning 2 users; cityUsers API returning empty)", async () => {
				mockAPI.get("/users").reply(200, testData.allUsers);
				mockAPI.get('/city/London/users').reply(200, testData.emptyUsers);
				const res = await chai.request(app).get("/users/London")
				expect(res.body).to.have.lengthOf(2);
				expect(res.status).to.equal(200);
				res.body.forEach(user => {
					expect(user.id).to.be.oneOf([2,5])
				});
			});
			it("Return response code 200 and three users (allUsers API returning empty; cityUsers API returning 3 users)", async () => {
				mockAPI.get("/users").reply(200, testData.emptyUsers);
				mockAPI.get('/city/London/users').reply(200, testData.londonUsers);
				const res = await chai.request(app).get("/users/London")
				expect(res.body).to.have.lengthOf(3);
				expect(res.status).to.equal(200);
				res.body.forEach(user => {
					expect(user.id).to.be.oneOf([7,8,9])
				});
			});
			it("Return response code 200 and no users (both API calls returning empty)", async () => {
				mockAPI.get("/users").reply(200, testData.allExcludingLondonUsers);
				mockAPI.get('/city/London/users').reply(200, testData.emptyUsers);
				const res = await chai.request(app).get("/users/London")
				expect(res.body).to.equal("No results found for users within 50 miles of London")
				expect(res.status).to.equal(200);
			});
		});
		context("Called with invalid input", () => {
			it("Return response code 400 and an error (unrecognized input)", async () => {
				mockAPI.get("/users").reply(200, testData.allUsers);
				mockAPI.get('/city/London/users').reply(200, testData.londonUsers);
				const res = await chai.request(app).get("/users/fake city")
				expect(res.body.errorMsg).to.equal("Fake city is not a recognized/supported city")
				expect(res.status).to.equal(400);
			});
			it("Return response code 400 and an error (non-string input)", async () => {
				mockAPI.get("/users").reply(200, testData.allUsers);
				mockAPI.get('/city/London/users').reply(200, testData.londonUsers);
				const res = await chai.request(app).get("/users/"+86)
				expect(res.body.errorMsg).to.equal(86+" is not a recognized/supported city")
				expect(res.status).to.equal(400);
			});
		});
	});
});