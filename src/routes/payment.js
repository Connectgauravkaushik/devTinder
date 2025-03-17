const express = require('express');
const { userAuth } = require('../middlewares/auth');
const paymentRouter = express.Router();
const razorpayInstance = require('../utils/razorpay');
const Payment = require('../models/payment');
const { memberShipAmount } = require('../utils/constants');
const { validateWebhookSignature } = require('razorpay/dist/utils/razorpay-utils');
const User = require('../models/user');


// creating the payment
paymentRouter.post('/payment/create', userAuth, async (req, res) => {
    try {
        const { firstName, lastName, emailId } = req.user;
        const { membershipType } = req.body;

        // creating the order in the backend using the create method 
        const order = await razorpayInstance.orders.create({
            amount: memberShipAmount[membershipType] * 100,
            currency: "INR",
            receipt: "receipt#1",
            notes: {
                firstName,
                lastName,
                emailId,
                membershipType: membershipType,
            }
        });

        // save it in the database
        const payment = new Payment({
            userId: req.user._id,
            orderId: order.id,
            status: order.status,
            amount: order.amount,
            currency: order.currency,
            receipt: order.receipt,
            notes: order.notes,
        });
        const savedPayment = await payment.save();

        // return back my order details to frontend
        res.status(200).json({ ...savedPayment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID });

    } catch (error) {
        return res.status(400).send(error.message);
    }
});

// webhook API
paymentRouter.post('/payment/webhook', async (req, res) => {
    try {

        const webhookSignature = req.get("X-Razorpay-Signature");

        const isWebhookValid = validateWebhookSignature(JSON.stringify(req.body),
            webhookSignature,
            process.env.RAZORPAY_WEB_SECRET
        );

        if (!isWebhookValid) {
            return res.status(400).json({ message: 'Webhook is not valid' })
        }

        const paymentDetails = req.body.payload.payment.entity;
        
        // update the payment status in DB
        const payment = await Payment.findOne({orderId:paymentDetails.order_id});
        payment.status = paymentDetails.status;
        await payment.save();

        // update the user as premium 
        const user  =  await User.findOne({_id: payment.userId});
        user.isPremium = true;
        user.membershipType = payment.notes.membershipType;
        await user.save();

        // if (req.body.event === "payment.captured") {
          
        // }

        // if (req.body.event === "payment.failed") {

        // }


     return res.send(200).json({msg:"Webhook received successfully!!"})
    } catch (error) {
        return res.status(400).send('invalid signature')
    }
});

module.exports = paymentRouter;



