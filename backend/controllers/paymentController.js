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
    const { rideId, amount,paymentIntentId } = req.body;
    try {
        // Find the ride and captain
        const ride = await rideModel.findById(rideId).populate('captain');
        if (!ride || !ride.captain || !ride.captain.socketId) {
            return res.status(404).json({ message: "Captain not found or not online" });
        }

        
    const paymentIntent = await stripe.paymentIntents.retrieve(
        paymentIntentId
  );

  console.log("payment Intent",paymentIntent);

//   console.log(paymentIntent.status);

  if (paymentIntent.status !== "succeeded") {
    return res.status(400).json({ message: "Payment not verified" });
  }
   
   const orderId = crypto.randomUUID();
   console.log("paymentId",paymentIntent.id)
   

         await rideModel.findByIdAndUpdate(rideId, {
      paymentMode: "card",
      paymentStatus: "paid",
       orderId: orderId,
      paymentID:paymentIntent.id,
      
    });
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

const cashPayment = async (req, res) => {
  const { rideId } = req.body;

  const ride = await rideModel.findById(rideId).populate("captain");


  await rideModel.findByIdAndUpdate(rideId, {
    paymentMode: "cash",
    paymentStatus: "paid",
    orderId: `CASH_ORDER_${rideId}`, // Placeholder for orderId
    paymentId: `CASH_PAYMENT_${rideId}`, // Placeholder for paymentId
    signature: null,


  });

  // captain ko batao
  if (ride?.captain?.socketId) {
    sendMessageToSocketId(ride.captain.socketId, {
      event: "cash-payment-selected"
    });
  }

  res.json({ success: true });
};


module.exports = {
    createPaymentIntent,
    confirmPayment,
    cashPayment
};

// module.exports = {
//     createPaymentIntent,
// };
