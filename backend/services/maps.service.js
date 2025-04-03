module.exports.getAddressCoordinate=async(address)=>{
    const axios = require('axios');
    const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`;
  
    try {
      const response = await axios.get(url);
      if (response.data.status === 'OK') {
        const location = response.data.results[0].geometry.location;
        return {
          lat: location.lat,
          lng: location.lng
        };
      } else {
        throw new Error('Unable to find address');
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      throw error;
    }

}



module.exports.getDistanceTime = async (origin, destination) => {
    if(!origin || !destination){
        return res.status(400).json({message:"Origin and destination are required"})
    }


    const apiKey= process.env.GOOGLE_MAPS_API_KEY;
    const url=`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${apiKey}`;

    try{
        const response=await axios.get(url);
        if(response.data.status==="OK"){
            if(response.data.rows[0].elements[0].status==="ZERO_RESULTS")
              {
               throw new Error("No route found");
              }
              return response.data.rows[0].elements[0];
        }
    else{
        throw new Error("Unable to fetch distance and time");
    }
  }
  catch(error){
    console.error("Error fetching distance and time:",error);
    throw error;
  }
}

module.exports.getAutoCompleteSuggestions = async (input) => {
    const axios = require('axios');
    const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${API_KEY}`;
  
    try {
      const response = await axios.get(url);
      if (response.data.status === 'OK') {
        return response.data.predictions;
      } else {
        throw new Error('Unable to fetch suggestions');
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      throw error;
    }
}



/*

const axios = require('axios');

const API_KEY = process.env.OPENROUTESERVICE_API_KEY;

// 1️⃣ **Address ko Latitude, Longitude me Convert Karna (Geocoding)**
module.exports.getAddressCoordinate = async (address) => {
    const url = `https://api.openrouteservice.org/geocode/search?api_key=${API_KEY}&text=${encodeURIComponent(address)}`;

    try {
        const response = await axios.get(url);
        if (response.data.features.length > 0) {
            const location = response.data.features[0].geometry.coordinates;
            return {
                lat: location[1], // OpenRouteService longitude pehle deta hai, isliye swap karna hoga
                lng: location[0]
            };
        } else {
            throw new Error('Unable to find address');
        }
    } catch (error) {
        console.error('Error fetching coordinates:', error);
        throw error;
    }
};

// 2️⃣ **Do Locations ke Beech Distance & Time Calculate Karna**
module.exports.getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error("Origin and destination are required");
    }

    const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${API_KEY}&start=${origin.lng},${origin.lat}&end=${destination.lng},${destination.lat}`;

    try {
        const response = await axios.get(url);
        if (response.data.routes.length > 0) {
            const route = response.data.routes[0].summary;
            return {
                distance: route.distance / 1000, // meters to km
                duration: route.duration / 60    // seconds to minutes
            };
        } else {
            throw new Error("No route found");
        }
    } catch (error) {
        console.error("Error fetching distance and time:", error);
        throw error;
    }
};

// 3️⃣ **Autocomplete Suggestions (Nominatim API ka Use)**
module.exports.getAutoCompleteSuggestions = async (input) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(input)}`;

    try {
        const response = await axios.get(url);
        if (response.data.length > 0) {
            return response.data.map(place => ({
                name: place.display_name,
                lat: place.lat,
                lng: place.lon
            }));
        } else {
            throw new Error('No suggestions found');
        }
    } catch (error) {
        console.error('Error fetching suggestions:', error);
        throw error;
    }
};

*/