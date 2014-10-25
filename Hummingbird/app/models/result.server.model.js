'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Result Schema
 */
var ResultSchema = new Schema({
	resultId: {
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},	
	result: {
		type: String,
		trim: true,
		default: 'No result yet'
	},
	submittedBy: {
		type: String
	},
	verifiedBy: {
		type: String
	},
	created: {
		type: Date,
		default: Date.now
	},
	status: {
		type: String,
		default: 'In progress'
	}
});

mongoose.model('Result', ResultSchema);