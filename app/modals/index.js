'use strict';
const db = require('./db');
const { Product, Order } = require('./product');
module.exports = {
	db,
	Product,
	Order
}