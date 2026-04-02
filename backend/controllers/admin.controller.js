const rideModel = require('../models/ride.model');
const adminModel = require('../models/admin.model');
const CompanyWallet = require('../models/companyWallet.model');
const blacklistTokenModel = require('../models/blacklist.Token.model');
const { sendMessageToSocketId } = require('../socket');

module.exports.registerAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await adminModel.hashPassword(password);
        const admin = await adminModel.create({ email, password: hashedPassword });
        const token = admin.generateAuthToken();
        res.status(201).json({ token, admin });
    } catch (err) {
        res.status(500).json({ message: 'Error registering admin (maybe email exists?)' });
    }
};

module.exports.loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await adminModel.findOne({ email }).select('+password');
        if (!admin || !(await admin.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = admin.generateAuthToken();
        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'None' });
        res.status(200).json({ token, admin });
    } catch (err) {
        res.status(500).json({ message: 'Error logging in' });
    }
};

const captainModel = require('../models/captain.model');

module.exports.getAdminProfile = async (req, res) => {
    res.status(200).json(req.admin);
};

module.exports.logoutAdmin = async (req, res) => {
    try {
        const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
        await blacklistTokenModel.create({ token });
        res.clearCookie('token');
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error logging out' });
    }
};

module.exports.getPendingCaptains = async (req, res) => {
    try {
        const pendingCaptains = await captainModel.find({ status: 'pending' });
        res.status(200).json(pendingCaptains);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching pending captains' });
    }
};

module.exports.approveCaptain = async (req, res) => {
    try {
        const { id } = req.params;
        const captain = await captainModel.findByIdAndUpdate(id, { status: 'approved' }, { new: true });
        
        if (!captain) {
            return res.status(404).json({ message: 'Captain not found' });
        }

        // Notify captain via socket if they are connected
        if (captain.socketId) {
            sendMessageToSocketId(captain.socketId, {
                event: 'captain-status-updated',
                data: { status: 'approved' }
            });
        }

        res.status(200).json({ message: 'Captain approved successfully', captain });
    } catch (err) {
        res.status(500).json({ message: 'Error approving captain' });
    }
};

module.exports.rejectCaptain = async (req, res) => {
    try {
        const { id } = req.params;
        const { rejectionReason } = req.body;
        
        const captain = await captainModel.findByIdAndUpdate(id, { 
            status: 'rejected',
            rejectionReason: rejectionReason 
        }, { new: true });

        if (!captain) {
            return res.status(404).json({ message: 'Captain not found' });
        }

        // Notify captain via socket if they are connected
        if (captain.socketId) {
            sendMessageToSocketId(captain.socketId, {
                event: 'captain-status-updated',
                data: { status: 'rejected', reason: rejectionReason }
            });
        }

        res.status(200).json({ message: 'Captain rejected successfully', captain });
    } catch (err) {
        res.status(500).json({ message: 'Error rejecting captain' });
    }
};

module.exports.getAdminStats = async (req, res) => {
    try {
        const total = await captainModel.countDocuments();
        const pending = await captainModel.countDocuments({ status: 'pending' });
        const approved = await captainModel.countDocuments({ status: 'approved' });
        const rejected = await captainModel.countDocuments({ status: 'rejected' });
        const active = await captainModel.countDocuments({ status: 'active' });

        res.status(200).json({
            total,
            pending,
            approved,
            rejected,
            active
        });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching stats' });
    }
};

module.exports.getCompanyBalance = async (req, res) => {
    try {
        const wallet = await CompanyWallet.getWallet();
        res.status(200).json(wallet);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching company wallet' });
    }
};
module.exports.getDetailedFleetStats = async (req, res) => {
    try {
        const wallet = await CompanyWallet.getWallet();
        // Include both approved and rejected captains in the list
        const captains = await captainModel.find({ status: { $in: ['approved', 'rejected', 'active', 'inactive'] } });
        
        const fleet = await Promise.all(captains.map(async (captain) => {
            const rides = await rideModel.find({ captain: captain._id, status: 'completed' });
            const rideCount = rides.length;
            const grossEarnings = rides.reduce((sum, r) => sum + (r.fare || 0), 0);
            const platformFee = grossEarnings * 0.20;
            const netPayout = grossEarnings * 0.80;

            return {
                id: captain._id,
                fullname: captain.fullname,
                email: captain.email,
                rides: rideCount,
                grossEarnings,
                platformFee,
                netPayout,
                performance: captain.averageRating || 5.0,
                status: captain.status,
                isAvailable: captain.isAvailable
            };
        }));

        res.status(200).json({
            aggregateOversight: wallet.totalCommissionEarned,
            activeCaptainsCount: fleet.filter(f => f.isAvailable).length,
            fleet
        });
    } catch (err) {
        console.error("Error fetching detailed fleet stats:", err);
        res.status(500).json({ message: 'Error fetching detailed fleet stats' });
    }
};

module.exports.getCaptainDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const captain = await captainModel.findById(id).select('-password');
        
        if (!captain) {
            return res.status(404).json({ message: 'Captain not found' });
        }

        // Fetch last 5 completed rides
        const recentRides = await rideModel.find({ captain: id, status: 'completed' })
            .sort({ createdAt: -1 })
            .limit(5);

        // Calculate total stats for this captain specifically
        const allRides = await rideModel.find({ captain: id, status: 'completed' });
        const totalGross = allRides.reduce((sum, r) => sum + (r.fare || 0), 0);
        const totalPlatformFee = totalGross * 0.20;

        res.status(200).json({
            captain,
            recentRides,
            stats: {
                totalGross,
                totalPlatformFee,
                netPayout: totalGross * 0.80
            }
        });
    } catch (err) {
        console.error("Error fetching captain details:", err);
        res.status(500).json({ message: 'Error fetching captain details' });
    }
};
