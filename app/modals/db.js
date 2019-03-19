'use strict';
const mongoose = require('mongoose');
const dbURL = 'mongodb://localhost:27017/razorpay';

async function connectToDb() {
	try {
		await mongoose.connect(dbURL);
		console.log('successfully db connected');
	} catch ( error ) {
		console.log('failed to connect the db');
		process.exit(1);
	}
}

connectToDb();

const db = mongoose.connection;

module.exports = db;