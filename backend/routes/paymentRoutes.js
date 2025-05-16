const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = new Stripe(process.env.SECRET_KEY);  // Use your secret key from .env
const paymentController = require('../controllers/paymentController');
// POST request to create a payment intent
router.post('/create-payment-intent', async (req, res) => {
    const { amount } = req.body; // Amount should be passed in the request body

    try {
        // Create a payment intent with the given amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount, // 
            currency: 'INR', // Change to your desired currency
            payment_method_types: ['card'], // Allow card payments
        });

        // Send the client secret back to the frontend
        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        // Handle any errors that occur during the creation of the payment intent
        res.status(500).send({ error: error.message });
    }
});


router.post('/confirm', paymentController.confirmPayment);

module.exports = router;
