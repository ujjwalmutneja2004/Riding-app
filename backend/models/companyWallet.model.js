const mongoose = require('mongoose');

const companyWalletSchema = new mongoose.Schema({
    totalBalance: {
        type: Number,
        default: 0
    },
    totalCommissionEarned: {
        type: Number,
        default: 0
    },
    totalRidesHandled: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

// We ensure there's only one company wallet (singleton)
companyWalletSchema.statics.getWallet = async function() {
    let wallet = await this.findOne();
    if (!wallet) {
        wallet = await this.create({ totalBalance: 0, totalCommissionEarned: 0, totalRidesHandled: 0 });
    }
    return wallet;
};

const CompanyWallet = mongoose.model('companyWallet', companyWalletSchema);

module.exports = CompanyWallet;
