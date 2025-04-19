// const express=require('express')
// const router=express.Router();
// const authMiddleware = require('../middlewares/auth.middleware');
// const mapController=require('../controllers/map.controller')
// const {query}=require('express-validator')


// //returns lttitude and longitude of particular route
// router.get('/get-coordinates',query('address').isString().isLength({min:3}),
//     authMiddleware.authUser,mapController.getCoordinates)


//     ///query('destination'): Extracts the destination query parameter from the request URL.
// router.get('/get-distance-time',query('origin').isString().isLength({min:3}),
//     query('destination').isString().isLength({min:3}),
//     authMiddleware.authUser,mapController.getDistanceTime)



//     router.get('/get-suggestions',query('input').isString().isLength({min:3}),authMiddleware.authUser,mapController.getAutoCompleteSuggestions)

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const mapController = require('../controllers/map.controller');
const { query, validationResult } = require('express-validator');

// ✅ Returns latitude and longitude of a particular route
router.get(
    '/get-coordinates',
    [
        query('address').isString().isLength({ min: 3 }),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next();
        }
    ],
    authMiddleware.authUser,
    mapController.getCoordinates
);

// ✅ Returns distance and time between origin and destination
router.get(
    '/get-distance-time',
    [
        query('origin').isString().isLength({ min: 3 }),
        query('destination').isString().isLength({ min: 3 }),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next();
        }
    ],
    authMiddleware.authUser,
    mapController.getDistanceTime
);

// ✅ Returns autocomplete location suggestions


router.get(
    '/get-suggestions',
    [
        query('input').trim().isString().isLength({ min: 1 }).withMessage('Input must be at least 1 character long'),
    ],
    authMiddleware.authUser,
    mapController.getAutoCompleteSuggestions
);

// routes.js (or wherever your routes are defined)


// Define the new route for distance calculation based on coordinates
// routes.js (or wherever your routes are defined)



// Define the new route for distance calculation based on coordinates
router.get(
    '/getdistby',
    [
        query('originLat').isFloat().withMessage('Origin latitude must be a valid number'),
        query('originLng').isFloat().withMessage('Origin longitude must be a valid number'),
        query('destLat').isFloat().withMessage('Destination latitude must be a valid number'),
        query('destLng').isFloat().withMessage('Destination longitude must be a valid number'),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next();
        }
    ],
    authMiddleware.authUser,  // Optional: Only if you want to authenticate the user
    mapController.getDistanceTimeByCoord // Call to the new controller
);



module.exports = router;



