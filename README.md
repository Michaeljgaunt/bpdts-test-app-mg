# bpdts-test-app-mg
 
An example API written with nodejs that returns users living in a given city or whose lon-lat is within a given distance of a city. For the purposes of this example, the only supported city is London.

# Requirements

Node v14.5.0

# Dependencies
* axios
* config
* express
* @turf/turf

# Installation & Configuration
Install

Download the latest release .zip from this Github page and unpack to a directory.
Open a command prompt and change to the unpacked directory, then run

`npm install`

If necessary, change the listening port in ./config/default.js (set to port 3000 by default). 
Note that the value to use as the threshold distance can also be changed in this config file (set to 50 miles by default).


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
