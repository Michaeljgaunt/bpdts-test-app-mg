# bpdts-test-app-mg
 
An example API written with nodejs that returns users living in a given city or whose lon-lat is within a given distance of a city. 

# Requirements

Node v14.5.0

# Dependencies
* axios
* config
* express
* @turf/turf

# Installation & Configuration
Download the latest release .zip from this Github page and unpack to a directory.

Open a command prompt and change to the unpacked directory, then run

`npm install`

If necessary, change the listening port in "config/default.js" (set to port 3000 by default). 

# Run
Run locally

`node app.js`

# Example API calls
This API provides one REST endpoint "http://localhost:{PORT}/users/{CITY}", where {PORT} is the port value specified in "config/default.js", and {CITY} is the name of a supported input city.
The API will return an array of JSON user objects which either live in {CITY} or are within a certain distance of {CITY}. 

The value of the threshold distance defaults to 50 miles, but can be changed in "config/default.js".

Supported cities are stored in "data/cityCoordinates.js". For the purposes of this example API, the only supported city is London.

##### Using Curl

`curl -X GET "http://localhost:3000/users/London"`

##### Using wget

`wget "http://localhost:3000/users/London" -O "path/to/output.json"`

##### Using Swagger

Swagger documentation is also provided and can be used to test the API; run the application and navigate to "http://localhost:3000/docs"

# Unit Testing
Run 

`npm test`
