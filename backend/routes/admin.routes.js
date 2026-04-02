const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');

const authMiddleware = require('../middlewares/auth.middleware');
const { body } = require('express-validator');

router.post('/register', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long')
], adminController.registerAdmin);

router.post('/login', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long')
], adminController.loginAdmin);

router.get('/profile', authMiddleware.authAdmin, adminController.getAdminProfile);
router.get('/logout', authMiddleware.authAdmin, adminController.logoutAdmin);

// Secured routes for oversight
router.get('/captains/pending', authMiddleware.authAdmin, adminController.getPendingCaptains);
router.post('/captains/approve/:id', authMiddleware.authAdmin, adminController.approveCaptain);
router.post('/captains/reject/:id', authMiddleware.authAdmin, adminController.rejectCaptain);
router.get('/stats', authMiddleware.authAdmin, adminController.getAdminStats);
router.get('/company-balance', authMiddleware.authAdmin, adminController.getCompanyBalance);
router.get('/fleet-stats', authMiddleware.authAdmin, adminController.getDetailedFleetStats);
router.get('/captain/:id', authMiddleware.authAdmin, adminController.getCaptainDetails);


module.exports = router;
