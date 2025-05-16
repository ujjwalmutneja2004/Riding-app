// controllers/paymentController.js
const Stripe = require('stripe');
const stripe = new Stripe(process.env.SECRET_KEY);  // Make sure to load your secret key
const { sendMessageToSocketId } = require('../socket');
const rideModel = require('../models/ride.model');
const captainModel = require('../models/captain.model');


const createPaymentIntent = async (req, res) => {
    const { amount } = req.body;  // This is the payment amount

    try {
        // Create a payment intent with Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount, // Stripe expects amount in cents
            currency: 'INR', // Change to your desired currency
            payment_method_types: ['card'],
        });

        // Send back the client secret
        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        // Handle errors
        res.status(500).send({ error: error.message });
    }
};


const confirmPayment = async (req, res) => {
    const { rideId, amount } = req.body;
    try {
        // Find the ride and captain
        const ride = await rideModel.findById(rideId).populate('captain');
        if (!ride || !ride.captain || !ride.captain.socketId) {
            return res.status(404).json({ message: "Captain not found or not online" });
        }
        // Emit payment-success event to captain
        sendMessageToSocketId(ride.captain.socketId, {
            event: "payment-success",
            data: { amount }
        });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createPaymentIntent,
    confirmPayment,
};

// module.exports = {
//     createPaymentIntent,
// };
