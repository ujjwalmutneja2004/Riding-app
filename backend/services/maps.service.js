// module.exports.getAddressCoordinate=async(address)=>{
//     const axios = require('axios');
//     const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
//     const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`;
  
//     try {
//       const response = await axios.get(url);
//       if (response.data.status === 'OK') {
//         const location = response.data.results[0].geometry.location;
//         return {
//           lat: location.lat,
//           lng: location.lng
//         };
//       } else {
//         throw new Error('Unable to find address');
//       }
//     } catch (error) {
//       console.error('Error fetching coordinates:', error);
//       throw error;
//     }

// }



// module.exports.getDistanceTime = async (origin, destination) => {
//     if(!origin || !destination){
//         return res.status(400).json({message:"Origin and destination are required"})
//     }


//     const apiKey= process.env.GOOGLE_MAPS_API_KEY;
//     const url=`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${apiKey}`;

//     try{
//         const response=await axios.get(url);
//         if(response.data.status==="OK"){
//             if(response.data.rows[0].elements[0].status==="ZERO_RESULTS")
//               {
//                throw new Error("No route found");
//               }
//               return response.data.rows[0].elements[0];
//         }
//     else{
//         throw new Error("Unable to fetch distance and time");
//     }
//   }
//   catch(error){
//     console.error("Error fetching distance and time:",error);
//     throw error;
//   }
// }

// module.exports.getAutoCompleteSuggestions = async (input) => {
//     const axios = require('axios');
//     const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
//     const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${API_KEY}`;
  
//     try {
//       const response = await axios.get(url);
//       if (response.data.status === 'OK') {
//         return response.data.predictions;
//       } else {
//         throw new Error('Unable to fetch suggestions');
//       }
//     } catch (error) {
//       console.error('Error fetching suggestions:', error);
//       throw error;
//     }
// }





// const axios = require('axios');

// const API_KEY = process.env.OPENROUTESERVICE_API_KEY;

// // 1️⃣ **Address ko Latitude, Longitude me Convert Karna (Geocoding)**
// module.exports.getAddressCoordinate = async (address) => {
//     const url = `https://api.openrouteservice.org/geocode/search?api_key=${API_KEY}&text=${encodeURIComponent(address)}`;

//     try {
//         const response = await axios.get(url);
//         if (response.data.features.length > 0) {
//             const location = response.data.features[0].geometry.coordinates;
//             return {
//                 lat: location[1], // OpenRouteService longitude pehle deta hai, isliye swap karna hoga
//                 lng: location[0]
//             };
//         } else {
//             throw new Error('Unable to find address');
//         }
//     } catch (error) {
//         console.error('Error fetching coordinates:', error);
//         throw error;
//     }
// };

// // 2️⃣ **Do Locations ke Beech Distance & Time Calculate Karna**
// module.exports.getDistanceTime = async (origin, destination) => {
//     if (!origin || !destination) {
//         throw new Error("Origin and destination are required");
//     }

//     const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${API_KEY}&start=${origin.lng},${origin.lat}&end=${destination.lng},${destination.lat}`;

//     try {
//         const response = await axios.get(url);
//         if (response.data.routes.length > 0) {
//             const route = response.data.routes[0].summary;
//             return {
//                 distance: route.distance / 1000, // meters to km
//                 duration: route.duration / 60    // seconds to minutes
//             };
//         } else {
//             throw new Error("No route found");
//         }
//     } catch (error) {
//         console.error("Error fetching distance and time:", error);
//         throw error;
//     }
// };

// // 3️⃣ **Autocomplete Suggestions (Nominatim API ka Use)**
// module.exports.getAutoCompleteSuggestions = async (input) => {
//     const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(input)}`;

//     try {
//         const response = await axios.get(url);
//         if (response.data.length > 0) {
//             return response.data.map(place => ({
//                 name: place.display_name,
//                 lat: place.lat,
//                 lng: place.lon
//             }));
//         } else {
//             throw new Error('No suggestions found');
//         }
//     } catch (error) {
//         console.error('Error fetching suggestions:', error);
//         throw error;
//     }
// };



const axios = require('axios');
const captainModel = require('../models/captain.model');

const API_KEY = process.env.TOMTOM_API_KEY;

// 1️⃣ **Convert Address to Coordinates (Geocoding)**
getAddressCoordinate = async (address) => {
    const url = `https://api.tomtom.com/search/2/geocode/${encodeURIComponent(address)}.json?key=${API_KEY}`;

    try {
        const response = await axios.get(url);
        if (response.data.results.length > 0) {
            const location = response.data.results[0].position;
            return {
                lat: location.lat,
                lng: location.lon
            };
        } else {
            throw new Error('Unable to find address');
        }
    } catch (error) {
        console.error('Error fetching coordinates:', error);
        throw error;
    }
};

// 2️⃣ **Calculate Distance & Time Between Two Locations**
getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error("Origin and destination are required");
    }

    const originCoords = await getAddressCoordinate(origin);
    const destinationCoords = await getAddressCoordinate(destination);

    console.log("Origin Coords:", originCoords);
   console.log("Destination Coords:", destinationCoords);

    if (!originCoords || !destinationCoords || !originCoords.lat || !originCoords.lng || !destinationCoords.lat || !destinationCoords.lng) {
        throw new Error("Invalid coordinates generated from address");
    }

   // const url = `https://api.tomtom.com/routing/1/calculateRoute/${originCoords.lat},${originCoords.lng}:${destinationCoords.lat},${destinationCoords.lng}/json?key=${API_KEY}`;
   const url = `https://api.tomtom.com/routing/1/calculateRoute/${originCoords.lat},${originCoords.lng}:${destinationCoords.lat},${destinationCoords.lng}/json?travelMode=car&routeType=fastest&avoid=unpavedRoads&key=${API_KEY}`;






    //const url = `https://api.tomtom.com/routing/1/calculateRoute/${origin.lat},${origin.lng}:${destination.lat},${destination.lng}/json?key=${API_KEY}`;

    try {
        const response = await axios.get(url);
        if (response.data.routes.length > 0) {
            const route = response.data.routes[0].summary;
            return {
                distance: (route.lengthInMeters / 1000).toFixed(2), // meters to km
                duration: (route.travelTimeInSeconds / 60).toFixed(2) // seconds to minutes
            };
        } else {
            throw new Error("No route found");
        }
    } catch (error) {
        console.error("Error fetching distance and time:", error);
        throw error;
    }
};

// 3️⃣ **Get Autocomplete Suggestions**

// module.exports.getAutoCompleteSuggestionss = async (input) => {
//     const url = `https://api.tomtom.com/search/2/search/${encodeURIComponent(input)}.json?key=${API_KEY}&limit=5`;

//     try {
//         const response = await axios.get(url);

//         if (response.data.results.length > 0) {
//             return {
//                 predictions: response.data.results.map(place => ({
//                     description: place.address.freeformAddress,
//                     place_id: place.id, // TomTom doesn't have exact place_id like Google
//                     structured_formatting: {
//                         main_text: place.poi?.name || place.address.freeformAddress.split(',')[0],
//                         secondary_text: place.address.freeformAddress
//                     }
//                 })),
//                 status: "OK"
//             };
//         } else {
//             return { predictions: [], status: "ZERO_RESULTS" };
//         }
//     } catch (error) {
//         console.error('Error fetching suggestions:', error);
//         return { predictions: [], status: "ERROR" };
//     }
// };

async function getAutoCompleteSuggestionss(input) {
    const url = `https://api.tomtom.com/search/2/search/${encodeURIComponent(input)}.json?key=${API_KEY}&limit=5`;

    try {
        const response = await axios.get(url);

        if (response.data.results.length > 0) {
            return {
                predictions: response.data.results.map(place => ({
                    description: place.address.freeformAddress,
                    place_id: place.id,
                    structured_formatting: {
                        main_text: place.poi?.name || place.address.freeformAddress.split(',')[0],
                        secondary_text: place.address.freeformAddress
                    }
                })),
                status: "OK"
            };
        } else {
            return { predictions: [], status: "ZERO_RESULTS" };
        }
    } catch (error) {
        console.error('Error fetching suggestions:', error);
        return { predictions: [], status: "ERROR" };
    }
}



//return all captaisn in nearby radius user ke

// module.exports.getCaptainInTheRadius = async (lat, lng, radius) => {
//     const captains = await captainModel.find({
//         location:{
//             $geoWithin: {
//                 $centerSphere: [[lat, lng], radius / 6371] // radius in km
//             }
//         }
//         //this query starting from geowithin is already provided by mongodb
//     })
//     return captains;
// }

const getCaptainInTheRadius = async (lat, lng, radius) => {
    try {
        console.log(`Searching within ${radius} kms) around (${lat}, ${lng})`);
      const captains = await captainModel.find({
       status: "active",
       "vehicle.vehicleType": vehicleType,
        location: {
          $geoWithin: {
            $centerSphere: [[lng, lat], radius / 6371] // lng first, then lat
          }
        }
      });
      return captains;
    } catch (err) {
      console.error("Error fetching captains in radius:", err);
      return [];
    }
  };


  // map.service.js


const getDistanceTimeByCoord = async (origin, destination) => {
    
    try {
        // Making the request to TomTom API with the coordinates and API key
        const response = await axios.get(`https://api.tomtom.com/routing/1/calculateRoute/${origin.originLat},${origin.originLng}:${destination.destLat},${destination.destLng}/json?travelMode=car&routeType=fastest&avoid=unpavedRoads&key=${API_KEY}`);
        // Return the distance and time data
        return response.data;
    } catch (error) {
        console.error('Error fetching from TomTom API:', error);
        throw error;
    }
};

  



module.exports = {
    getAutoCompleteSuggestionss,
    getAddressCoordinate,
    getDistanceTime,
    getCaptainInTheRadius,
    getDistanceTimeByCoord
};
