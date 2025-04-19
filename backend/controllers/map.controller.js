// const mapService = require('../services/maps.service');
// const { validationResult } = require('express-validator');


// module.exports.getCoordinates = async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }
//     const { address } = req.query;
//     console.log(address);
//     try {
//         const coordinates = await mapService.getAddressCoordinate(address);
//         res.status(200).json(coordinates);
//     } catch (error) {
//         res.status(404).json({ message: 'Coordinates not Found', error: error.message });
//     }
// }

// module.exports.getDistanceTime = async (req, res,next) => {
//     try{
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }
//         const { origin, destination } = req.query;
//         console.log(origin, destination);
//         const distanceTime = await mapService.getDistanceTime(origin, destination);
//         res.status(200).json(distanceTime);
//     }
//     catch (error) {
//         console.error('Error fetching distance and time:', error);
//         res.status(404).json({ message: 'Distance and time not found', error: error.message });
//     }
    
// }

// module.exports.getAutoCompleteSuggestions = async (req, res,next) => {
//     try{
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }
//         const { input } = req.query;
//         console.log(input);
//         const suggestions = await mapService.getAutoCompleteSuggestions(input);
//         res.status(200).json(suggestions);
//     }
//     catch (error) {
//         console.error('Error fetching suggestions:', error);
//         res.status(404).json({ message: 'Suggestions not found', error: error.message });
//     }
// }


//https://chatgpt.com/c/67ed958a-9bdc-800b-b47e-13a6352e2a02


// const mapService = require('../services/maps.service');
// const { validationResult } = require('express-validator');

// module.exports.getCoordinates = async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     const { address } = req.query;
//     console.log("Searching coordinates for:", address);
    
//     try {
//         const coordinates = await mapService.getAddressCoordinate(address);
//         res.status(200).json(coordinates);
//     } catch (error) {
//         res.status(404).json({ message: 'Coordinates not found', error: error.message });
//     }
// }

// // module.exports.getDistanceTime = async (req, res) => {
// //     try {
// //         const errors = validationResult(req);
// //         if (!errors.isEmpty()) {
// //             return res.status(400).json({ errors: errors.array() });
// //         }

// //         const { origin, destination } = req.query;
// //         console.log("Calculating distance from:", origin, "to:", destination);

// //         // 🛑 Step 1: Convert addresses to coordinates first
// //         const originCoordinates = await mapService.getAddressCoordinate(origin);
// //         const destinationCoordinates = await mapService.getAddressCoordinate(destination);

// //         // ✅ Step 2: Call OpenRouteService with coordinates
// //         const distanceTime = await mapService.getDistanceTime(originCoordinates, destinationCoordinates);

// //         res.status(200).json(distanceTime);
// //     } catch (error) {
// //         console.error('Error fetching distance and time:', error);
// //         res.status(404).json({ message: 'Distance and time not found', error: error.message });
// //     }
// // }
// module.exports.getDistanceTime = async (req, res) => {
//     try {
//         const { origin, destination } = req.query;
        
//         if (!origin || !destination) {
//             return res.status(400).json({ message: "Origin and destination are required." });
//         }

//         console.log("🔹 Calculating distance from:", origin, "to:", destination);

//         // Fetch coordinates
//         const originCoordinates = await mapService.getAddressCoordinate(origin);
//         const destinationCoordinates = await mapService.getAddressCoordinate(destination);

//         console.log("📍 Origin Coordinates:", originCoordinates);
//         console.log("📍 Destination Coordinates:", destinationCoordinates);

//         // Validate coordinates
//         if (!originCoordinates || !destinationCoordinates || !originCoordinates.lat || !originCoordinates.lon) {
//             return res.status(400).json({ message: "Invalid origin or destination address." });
//         }

//         // Fetch distance & time
//         const distanceTime = await mapService.getDistanceTime(originCoordinates, destinationCoordinates);

//         res.status(200).json(distanceTime);
//     } catch (error) {
//         console.error(`❌ Error in getDistanceTime: ${error.message}`, {
//             origin,
//             destination,
//             details: error.response?.data || error.stack
//         });

//         res.status(500).json({ message: "Failed to calculate distance and time.", error: error.message });
//     }
// };








// module.exports.getAutoCompleteSuggestions = async (req, res) => {
//     try {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }

//         const { input } = req.query;
//         console.log("Fetching autocomplete suggestions for:", input);

//         const suggestions = await mapService.getAutoCompleteSuggestions(input);
//         res.status(200).json(suggestions);
//     } catch (error) {
//         console.error('Error fetching suggestions:', error);
//         res.status(404).json({ message: 'Suggestions not found', error: error.message });
//     }
// }





const mapService = require('../services/maps.service');
const { validationResult } = require('express-validator');

module.exports.getCoordinates = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const { address } = req.query;
    console.log("Fetching coordinates for:", address);

    try {
        const coordinates = await mapService.getAddressCoordinate(address);
        res.status(200).json(coordinates);
    } catch (error) {
        res.status(404).json({ message: 'Coordinates not found', error: error.message });
    }
};

module.exports.getDistanceTime = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { origin, destination } = req.query;
    console.log("Calculating distance & time between:", origin, "and", destination);

    try {
        // Convert addresses to coordinates
        // const originCoords = await mapService.getAddressCoordinate(origin);
        // const destinationCoords = await mapService.getAddressCoordinate(destination);

        // Call distance calculation service
        // const distanceTime = await mapService.getDistanceTime(originCoords, destinationCoords);
        const distanceTime = await mapService.getDistanceTime(origin, destination);
        
        res.status(200).json(distanceTime);
    } catch (error) {
        console.error('Error fetching distance and time:', error);
        res.status(404).json({ message: 'Distance and time not found', error: error.message });
    }
};


module.exports.getAutoCompleteSuggestions = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { input } = req.query;
    console.log("Fetching autocomplete suggestions for:", input);

    try {
        const suggestions = await mapService.getAutoCompleteSuggestionss(input);
        res.status(200).json(suggestions);
    } catch (error) {
        console.error('Error fetching suggestions:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

// map.controller.js
module.exports.getDistanceTimeByCoord = async (req, res) => {
    const { originLat, originLng, destLat, destLng } = req.query;

    try {
        // Call the getDistanceTimeByCoord function from mapService
        const response = await mapService.getDistanceTimeByCoord(
            { originLat, originLng },
            { destLat, destLng }
        );

        // Extract distance and time from the response
        const route = response.routes[0]; // Assuming you want the first route
        const distanceInKm = route.summary.lengthInMeters / 1000; // Convert meters to kilometers
        const timeInHours = route.summary.travelTimeInSeconds / 3600; // Convert seconds to hours

        // Send the response with the required data
        res.status(200).json({
            distance: `${distanceInKm.toFixed(2)} km`,
            time: `${timeInHours.toFixed(2)} hours`,
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error calculating distance and time' });
    }
};
