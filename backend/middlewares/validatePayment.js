// middlewares/validatePayment.js
const { body, validationResult } = require('express-validator');

const validatePaymentData = [
    body('amount').isFloat({ gt: 0 }).withMessage('Amount must be a positive number'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = { validatePaymentData };
