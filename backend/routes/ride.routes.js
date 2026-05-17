const express=require('express');
const router=express.Router();
const {body,query}=require('express-validator');
const rideController=require('../controllers/ride.controller')
const authMiddleware=require('../middlewares/auth.middleware')
const {getCaptainEarnings} = require('../controllers/ride.controller')


router.post('/create',
   authMiddleware.authUser,
    body('pickup').isString().isLength({min:3}).withMessage('Invalid pickup address'),
    body('destination').isString().isLength({min:3}).withMessage('Invalid drop address'),
    body('vehicleType').isString().isIn(['auto','car','motorcycle']).withMessage('Invalid vehicle type'),
    body('rideMode').optional().isString().isIn(['Work Mode', 'Chill Mode', 'Urgent Mode']).withMessage('Invalid ride mode'),
    rideController.createRide

);

router.get('/getfare',authMiddleware.authUser, 
    query('pickup').isString().isLength({min:3}).withMessage('Invalid pickup address'),
    query('destination').isString().isLength({min:3}).withMessage('Invalid drop address'),
    rideController.getFare);

router.post('/confirm-ride',
    authMiddleware.authCaptain,
    body('rideId').isMongoId().withMessage('Invalid ride id'),
    rideController.confirmRide

)

router.get('/start-ride',
    authMiddleware.authCaptain,
    query('rideId').isMongoId().withMessage('Invalid ride id'),
    query('otp').isString().isLength({min:6, max:6}).withMessage('Invalid otp'),
    rideController.startRide

)

router.post('/end-ride',
    authMiddleware.authCaptain,
    body('rideId').isMongoId().withMessage('Invalid ride id'),
    rideController.endRide

)

router.post('/:id/rate',
    authMiddleware.authUser,
    body('rating').isNumeric().isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5'),
    rideController.rateRide
);

router.post('/cancel-ride-captain',
    authMiddleware.authCaptain,
    body('rideId').isMongoId().withMessage('Invalid ride id'),
    rideController.cancelRideByCaptain
);

router.get('/:captainId/earnings',getCaptainEarnings);


module.exports=router;
