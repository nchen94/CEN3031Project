/*jshint eqeqeq:false, eqnull:true*/
'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Order = mongoose.model('Order'),
	Item = mongoose.model('Inventory'),
	Result = mongoose.model('Result'),
	//Forms = mongoose.model('Form'),
	//BillingInformation = mongoose.model('BillingInformation'), 
    _ = require('lodash');

/**
 * Create a Order
 */
exports.create = function(req, res) 
{
	//var form = new Forms(req.body.forms);
	//var billingInformation = new BillingInformation(req.body.billing);
	//var results = new Result();
	//results.user = req.user;
	var order = new Order(req.body);
	order.orderId = Math.floor((Math.random() * 100000000000) + 1000000);
	//order.result = results;


	order.save(function(err) {
		if (err) 
		{
			return res.send(
			{
				message: errorHandler.getErrorMessage(err)
			});
		}
		else 
		{
			res.jsonp(order);
		}
	});
};

/**
 * Show the current Order
 */
exports.read = function(req, res) 
{
	res.jsonp(req.body.order);
};

/**
 * Update a Order
 */
exports.update = function(req, res) {
	var order = req.body.order;
	if (req.body.orderStatus === 'completed') {		
		order = _.extend(order, {status: req.body.orderStatus, completed: Date.now()});
	} else {
		order = _.extend(order, {status: req.body.orderStatus});
	}
	order.save(function(err) {
		if (err) 
		{
			return res.send(
			{
				message: errorHandler.getErrorMessage(err)
			});
		}
		else 
		{
			res.jsonp(order);
		}
	});
};

/**
 * Delete an Order
 */
exports.delete = function(req, res) {

};

/**
 * List of Orders
 */
exports.list = function(req, res) {
	Order.find({ }).sort('-created').exec(function(err, order){
		if (err) 
		{
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else 
		{
			res.jsonp(order);
		}
	});
};

//list user's placed order
exports.listPlaced = function(req, res) 
{
	Order.find({status: 'placed', user: req.user}).sort('-created').exec(function(err, order){
		if (err) 
		{
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else 
		{
			res.jsonp(order);
		}
	});
};

/* Function will list all orders with status shipped
 * front end does not neeed to pass in any parameters
 */
exports.listShipped = function(req, res) 
{
	Order.find({status: 'shipped'}).sort('-created').exec(function(err, order){
		if (err) 
		{
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else 
		{
			res.jsonp(order);
		}
	});
};

/* Function will list all orders with status placed
 * front end does not neeed to pass in any parameters
 */
exports.listRegistered = function(req, res) 
{
	Order.find({status: 'registered'}).sort('-created').exec(function(err, order){
		if (err) 
		{
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else 
		{
			res.jsonp(order);
		}
	});
};

/* Function will list all orders with any status but placed
 * front end does not neeed to pass in any parameters
 */
exports.listAllButPlaced = function(req, res) 
{
	Order.find({'status': {$ne:'placed'}}).sort('-created').exec(function(err, order){
		if (err) 
		{
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else 
		{
			res.jsonp(order);
		}
	});
};

//lists labTech's completed orders
exports.listLabCompletedOrders = function(req, res) 
{
	Order.find({ result: { $elemMatch: { submittedBy: req.body.userId } } }).sort('-created').exec(function(err, orders){
		if (err) 
		{
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else 
		{
			res.jsonp(orders);
		}
	});
};

/**
 * Function will check to make sure the Register Code from the order exist on an order. 
 * req.body will need to contain the 
 * register code, req.body.registerCode
 */
exports.checkRegisterCode = function(req, res) 
{
	Order.find({registerCode: req.body.registerCode}).exec(function(err, orders) 
	{
		if(err) 
		{
			return res.status(400).send({
				message:errorHandler.getErrorMessage(err)
			});
		}
		else 
		{
			if(orders.length <= 0) {
				return res.send({
					message: 'register code does not exist in system.'
				});
			}
			else
			{
				orders = _.extend(orders, {status: 'registered'});
			}
		}
	});
};

/** 
 * Function to set status of orders to shipped
 * Function is only for Admins 
 * req.body.orderId will need to be the orderId of the the order
 */
exports.setShipped = function(req, res) 
{
	Order.find({ orderId: req.body.orderId})[0].exec(function(err, orders){
		if (err) 
		{
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} 
		else 
		{
			if(orders.length <= 0) {
				return res.send({
					message: 'order does not exist in system.'
				});
			}
			else
			{
				orders = _.extend(orders, {status: 'shipped'});
				Item.update({name: req.body.item}, {$inc: {count: -1}});
			}
		}
	});
};

