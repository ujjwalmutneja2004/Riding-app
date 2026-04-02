require('dotenv').config();
const mongoose = require('mongoose');
const captainModel = require('./models/captain.model');
const rideModel = require('./models/ride.model');

const MONGO_URI = process.env.DB_CONNECT;

const migrateEarnings = async () => {
    try {
        console.log("Connecting to Database...");
        await mongoose.connect(MONGO_URI);
        console.log("Connected.");

        // Fetch all approved captains
        console.log("Fetching approved captains...");
        const captains = await captainModel.find({ status: 'approved' });
        console.log(`Found ${captains.length} approved captains.`);

        const commissionRate = process.env.COMMISSION_RATE || 0.20;
        const captainShareMultiplier = 1 - commissionRate;

        let updatedCount = 0;

        for (const captain of captains) {
            // Find all completed rides for this captain
            const rides = await rideModel.find({ captain: captain._id, status: 'completed' });
            
            if (rides.length > 0) {
                const lifetimeEarnings = rides.reduce((sum, ride) => sum + (ride.fare || 0), 0) * captainShareMultiplier;
                
                await captainModel.findByIdAndUpdate(captain._id, { 
                    totalEarnings: lifetimeEarnings 
                });
                console.log(`Updated ${captain.fullname.firstname}: ₹${lifetimeEarnings.toFixed(2)} (${rides.length} rides)`);
                updatedCount++;
            } else {
                // If they have no rides, ensure it's 0 explicitly
                await captainModel.findByIdAndUpdate(captain._id, { totalEarnings: 0 });
            }
        }

        console.log(`\nMigration complete! Total captains with earnings updated: ${updatedCount}`);
        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
};

migrateEarnings();
