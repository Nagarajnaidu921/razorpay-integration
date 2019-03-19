'use strict';
const uuid = require('uuid');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const options = {
  timestamps: true
};

const getRequiredFiledMessage = (filed) => {
    const message = `${filed} Should Not Be Empty`;
    return [true, message];
};

const ProductSchema = new Schema({
  id: { type: String, default: uuid },
  name: { type: String, required: getRequiredFiledMessage('Name') },
  price: {type: Number, required: getRequiredFiledMessage('price') },
}, options);

const OrderSchema = new Schema({
	id: { type: String, default: uuid },
	productIds: [String],
	order: [],
	total: {type: Number, required: getRequiredFiledMessage('price') }
})

const Product = mongoose.model('Product', ProductSchema);
const Order = mongoose.model('Order', OrderSchema);
module.exports = {
	Product,
	Order
}