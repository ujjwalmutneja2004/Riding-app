const rideModel = require('../models/ride.model');
const adminModel = require('../models/admin.model');
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
