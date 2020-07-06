/**
 * Module representing configuration options
 * @module config
 */

/**
 * Port to listen on
 * @type {number}
 */
exports.port = 3000

/**
 * Thresholding distance to the city (in miles).
 * @type {number}
 */
exports.distance = 50

/**
 * Base URL of the external API. This should never be changed unless the external API changes location.
 * @type {string}
 */
exports.APIbaseURL = "https://bpdts-test-app.herokuapp.com"