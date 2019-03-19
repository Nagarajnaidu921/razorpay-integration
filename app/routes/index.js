'use strict';
const product = require('./product');

module.exports = (app) => {
	app.use('/api/product', product);
}