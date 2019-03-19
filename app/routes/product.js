'use strict';
const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { Product, Order } = require('../modals');
const router = express.Router();

const API_KYE = {
	key_id: 'Your_key_id',
	key_secret: 'your_secret'
}

var instance = new Razorpay(API_KYE);

router.route('/new')

.post(async (req, res) => {
	const { body } = req;
	const product = new Product(body);
	const result = await product.save();
	res.send(result);
})

router.route('/order')
.post(async (req, res) => {
	try {
		const { data:order } = req.body;
		console.log(order);
		const productIds = order.map(x => {
			return x.id;
		})
		const products = await Product.find({
			'id': {
				$in: productIds
			}
		});
		if(products.length <=0) {
			res.send('invalid order')
		}
		if(products.length > 1) {
			console.log(order);
			order.map(x => {
				x.price = products.filter(y => {
					return y.id == x.id;
				})[0].price * x.quantity * 100

				return x;				
			});


			const total = order.reduce((acc, curr) => {return acc.price + curr.price});
			// console.log(total);
			console.log({
				productIds,
				order,
				total
			})
			const savedOrder = new Order({
				productIds,
				order,
				total
			});

			/**
				saveing order to our application server
				*/
				const orderDetails = await savedOrder.save();

			/**
				creating order in razorpay server
				*/

				const rezorpayOrder = await instance.orders.create({
					amount: orderDetails.total,
					currency: 'INR',
					receipt: orderDetails.id,
					payment_capture: true, //make it false for manual capture of payments
					notes : {
						message: 'Test'
					}
				});

				console.log(rezorpayOrder);

			/**
				passing the options to checkout form in the front end
				*/

				var options = {
					key: API_KYE.key_id,
				amount: `${rezorpayOrder.amount_due}`, // 2000 paise = INR 20
				name: 'vertisize',
				description: "Purchase Description",
				prefill: {
					name: "Nagaraj V",
					email: "test@test.com"
				},
				notes: {
					address: "Hello World"
				},
				theme: {
					color: "#F37254"
				},
				order_id : rezorpayOrder.id
			};
			res.send(options);
		}
		// if(product) {
		// 	const actualPice = product.price;
		// 	const totalprice = actualPice * body.quantity *100;

		// }
		// res.send(order);

	} catch(error) {
		console.log(error);
		res.error(error);
	}
})

router.route('/payment/capture')
.post(async (req,res)=> {
	// console.log(req.body);
	const { body } = req;
	const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
	/** 
		request body  will  have following details 
		{ razorpay_payment_id: 'pay_C9EugEduDhHvCo',
 		razorpay_order_id: 'order_C9EuOeycLT3erC',
  		razorpay_signature: 'b6daf2043017b6a383bbf806bf3eb5e998ca02d3778cca6ecf94a121795d2e14' }
  		*/


  		const secret = 'abcdefg';
  		const hash = crypto.createHmac('sha256', API_KYE.key_secret).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest('hex');
  		if(hash == razorpay_signature) {
  			res.send('payment successful');
  		} else {
  			res.send('payment failed');
  		}

  		// Manual capture of Payments


	/**
		 fetching the payment details in for an order
		 */
	// const data = await instance.payments.fetch(req.body.razorpay_payment_id);
	// const { amount, currency, id} = data;
	// /**
	// 	capuring the payment of an order
	// */
	// const result = await instance.payments.capture(id, amount, currency);
	// console.log(result)
	// res.send(result);
})

module.exports = router;