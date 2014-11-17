'use strict';

module.exports = function(app) {
	// Routing logic   
	// ...
	var inventory = require('../../app/controllers/inventory.server.controller.js');

	// Setting up the Order api
	app.route('/inventory/listAll').get(inventory.list);
};