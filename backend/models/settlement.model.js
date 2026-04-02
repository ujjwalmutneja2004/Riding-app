const mongoose = require('mongoose');

const settlementSchema = new mongoose.Schema({
    captain: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'captain',
        required: true
    },
    type: {
        type: String,
        enum: ['CASHOUT', 'COMPANY_SETTLEMENT'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    previousBalance: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['SUCCESS', 'PENDING', 'FAILED'],
        default: 'SUCCESS'
    },
    paymentMethod: {
        type: String,
        enum: ['BANK', 'UPI', 'MANUAL'],
        default: 'MANUAL'
    },
    bankDetails: {
        bankName: String,
        accountHolder: String,
        accountNumber: String,
        maskedAccountNumber: String,
        ifscCode: String,
        upiId: String
    }
}, { timestamps: true });

const SettlementHistory = mongoose.model('settlement', settlementSchema);

module.exports = SettlementHistory;
