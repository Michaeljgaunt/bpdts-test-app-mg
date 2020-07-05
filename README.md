# bpdts-test-app-mg
 
An example API written with nodejs that returns users living in a given city or whose lon-lat is within a given distance of a given city.

# Requirements

Node v14.5.0

# Dependencies
* express
* axios
* @turf/turf
* lodash.union

# Configuration
Install
`npm install`
Change the listening port in config.js

# Run
Run locally
`node app.js`

# Example API calls
Using Curl
`curl -X GET "http://localhost:3000/users/London"`

Using wget
`wget "http://localhost:3000/users/London" -O "path/to/output.json"`

# Unit Testing
Run 
`npm test`
