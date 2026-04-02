require('dotenv').config();
const mongoose = require('mongoose');
const captainModel = require('./models/captain.model');
const CompanyWallet = require('./models/companyWallet.model');

const MONGO_URI = process.env.DB_CONNECT;

const migrate = async () => {
    try {
        console.log("Connecting to Database...");
        await mongoose.connect(MONGO_URI);
        console.log("Connected.");

        // Migration for Captains
        console.log("Migrating Captains...");
        const result = await captainModel.updateMany(
            { $or: [ { wallet: { $exists: false } }, { totalEarnings: { $exists: false } } ] },
            { $set: { wallet: 0, totalEarnings: 0 } }
        );
        console.log(`Updated ${result.modifiedCount} captains.`);

        // Initialize Company Wallet
        console.log("Initializing Company Wallet...");
        const wallet = await CompanyWallet.getWallet();
        console.log("Company Wallet ready:", wallet);

        console.log("Migration complete!");
        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
};

migrate();
