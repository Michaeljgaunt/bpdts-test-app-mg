# bpdts-test-app-mg
 
An example API written with nodejs that returns users living in a given city or whose lon-lat is within a given distance of a city. For the purposes of this example, the only supported city is London.

# Requirements

Node v14.5.0

# Dependencies
* express
* axios
* @turf/turf
* lodash.union

# Installation & Configuration
Install

`npm install`

If necessary, change the listening port in config/default.js (set to port 3000 by default)

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
