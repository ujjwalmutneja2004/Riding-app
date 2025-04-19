const express=require('express')
const router=express.Router();
const {body}=require('express-validator');
const captainController=require('../controllers/captain.controller')
const registerCaptain=require('../services/captain.service');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/register',[
    body('fullname.firstname').isString().isLength({min:3}).withMessage('First name must be at least 3 characters long'),
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password').isString().isLength({min:5}).withMessage('Password must be at least 5 characters long'),
    body('vehicle.color').isString().isLength({min:3}).withMessage('Color must be at least 3 characters long'),
    body('vehicle.plate').isString().isLength({min:3}).withMessage('Plate must be at least 3 characters long'),
    body('vehicle.capacity').isNumeric().isLength({min:1}).withMessage('Capacity must be at least 1'),
    body('vehicle.vehicleType').isString().isIn(['car','motorcycle','auto'])
],
  captainController.registerCaptain
)


//Ye express-validator ka middleware hai jo route ke aane se pehle input validation karta hai.
router.post('/login',[
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password').isString().isLength({min:5}).withMessage('Password must be at least 5 characters long')
],
  captainController.loginCaptain
)



router.get('/profile' ,authMiddleware.authCaptain,captainController.getCaptainProfile)

router.get('/logout' ,authMiddleware.authCaptain,captainController.logoutCaptain)

module.exports=router;