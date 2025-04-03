const mapService = require('../services/maps.service');
const { validationResult } = require('express-validator');


module.exports.getCoordinates = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { address } = req.query;
    console.log(address);
    try {
        const coordinates = await mapService.getAddressCoordinate(address);
        res.status(200).json(coordinates);
    } catch (error) {
        res.status(404).json({ message: 'Coordinates not Found', error: error.message });
    }
}

module.exports.getDistanceTime = async (req, res,next) => {
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { origin, destination } = req.query;
        console.log(origin, destination);
        const distanceTime = await mapService.getDistanceTime(origin, destination);
        res.status(200).json(distanceTime);
    }
    catch (error) {
        console.error('Error fetching distance and time:', error);
        res.status(404).json({ message: 'Distance and time not found', error: error.message });
    }
    
}

module.exports.getAutoCompleteSuggestions = async (req, res,next) => {
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { input } = req.query;
        console.log(input);
        const suggestions = await mapService.getAutoCompleteSuggestions(input);
        res.status(200).json(suggestions);
    }
    catch (error) {
        console.error('Error fetching suggestions:', error);
        res.status(404).json({ message: 'Suggestions not found', error: error.message });
    }
}


//https://chatgpt.com/c/67ed958a-9bdc-800b-b47e-13a6352e2a02
/*

const mapService = require('../services/maps.service');
const { validationResult } = require('express-validator');

module.exports.getCoordinates = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { address } = req.query;
    console.log("Searching coordinates for:", address);
    
    try {
        const coordinates = await mapService.getAddressCoordinate(address);
        res.status(200).json(coordinates);
    } catch (error) {
        res.status(404).json({ message: 'Coordinates not found', error: error.message });
    }
}

module.exports.getDistanceTime = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { origin, destination } = req.query;
        console.log("Calculating distance from:", origin, "to:", destination);

        // 🛑 Step 1: Convert addresses to coordinates first
        const originCoordinates = await mapService.getAddressCoordinate(origin);
        const destinationCoordinates = await mapService.getAddressCoordinate(destination);

        // ✅ Step 2: Call OpenRouteService with coordinates
        const distanceTime = await mapService.getDistanceTime(originCoordinates, destinationCoordinates);

        res.status(200).json(distanceTime);
    } catch (error) {
        console.error('Error fetching distance and time:', error);
        res.status(404).json({ message: 'Distance and time not found', error: error.message });
    }
}

module.exports.getAutoCompleteSuggestions = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { input } = req.query;
        console.log("Fetching autocomplete suggestions for:", input);

        const suggestions = await mapService.getAutoCompleteSuggestions(input);
        res.status(200).json(suggestions);
    } catch (error) {
        console.error('Error fetching suggestions:', error);
        res.status(404).json({ message: 'Suggestions not found', error: error.message });
    }
}
*/











