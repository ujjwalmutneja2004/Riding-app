const express = require('express')
const router = express.Router();
const { body } = require('express-validator');
const captainController = require('../controllers/captain.controller')
const upload = require('../middlewares/multer.middleware');
const authMiddleware = require('../middlewares/auth.middleware');

const debugMiddleware = (req, res, next) => {
  console.log("🚀 ROUTE HIT /captains/register");
  console.log("BODY:", req.body);
  console.log("FILES:", req.files);
  next();
};

router.post('/register', upload.fields([
  { name: 'licenseFront', maxCount: 1 },
  { name: 'licenseBack', maxCount: 1 },
  { name: 'selfie', maxCount: 1 },
  { name: 'numberPlate', maxCount: 1 },
  { name: 'rc', maxCount: 1 }
]),

  debugMiddleware,

  [
    body('fullname.firstname').isString().isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password').isString().isLength({ min: 5 }).withMessage('Password must be at least 5 characters long'),
    body('vehicle.color').isString().isLength({ min: 3 }).withMessage('Color must be at least 3 characters long'),
    body('vehicle.plate').isString().isLength({ min: 3 }).withMessage('Plate must be at least 3 characters long'),
    body('vehicle.capacity').isNumeric().isLength({ min: 1 }).withMessage('Capacity must be at least 1'),
    body('vehicle.vehicleType').isString().isIn(['car', 'motorcycle', 'auto'])
  ],
  captainController.registerCaptain
)


//Ye express-validator ka middleware hai jo route ke aane se pehle input validation karta hai.
router.post('/login', [
  body('email').isEmail().withMessage('Please enter a valid email address'),
  body('password').isString().isLength({ min: 5 }).withMessage('Password must be at least 5 characters long')
],
  captainController.loginCaptain
)

router.post('/forgot-password', captainController.forgotPassword);
router.post('/verify-otp', captainController.verifyOtp);
router.post('/reset-password', captainController.resetPassword);

router.get('/profile', authMiddleware.authCaptain, captainController.getCaptainProfile)

router.get('/history', authMiddleware.authCaptain, authMiddleware.isApproved, captainController.getCaptainHistory)

router.get('/analytics', authMiddleware.authCaptain, authMiddleware.isApproved, captainController.getCaptainAnalytics)

router.get('/wallet-status', authMiddleware.authCaptain, captainController.getCaptainWalletStatus);
router.post('/cashout', authMiddleware.authCaptain, captainController.handleCashout);
router.post('/settle-wallet', authMiddleware.authCaptain, captainController.handleSettlement);
router.get('/settlement-history', authMiddleware.authCaptain, captainController.getSettlementHistory);

router.post('/logout', authMiddleware.authCaptain, captainController.logoutCaptain);
router.patch('/toggle-status', authMiddleware.authCaptain, captainController.toggleAvailableStatus);
module.exports = router;