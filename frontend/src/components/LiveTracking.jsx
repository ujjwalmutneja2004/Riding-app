// import React, { useEffect, useRef, useState } from 'react';
// import tt from "@tomtom-international/web-sdk-maps";
// import ttServices from "@tomtom-international/web-sdk-services";
// import '@tomtom-international/web-sdk-maps/dist/maps.css';

// const LiveTracking = ({ userLocation, destination }) => {
//   const mapElement = useRef(null);
//   const [map, setMap] = useState(null);
//   const markerRef = useRef(null);

//   useEffect(() => {
//     // Initialize the map
//     const mapInstance = tt.map({
//       key: process.env.TOMTOM_API_KEY, // Replace with your TomTom API key
//       container: mapElement.current,
//       center: [userLocation.lng, userLocation.lat], // Initial center
//       zoom: 14,
//     });

//     setMap(mapInstance);

//     // Add a marker for the user's location
//     const marker = new tt.Marker().setLngLat([userLocation.lng, userLocation.lat]).addTo(mapInstance);
//     markerRef.current = marker;

//     // Cleanup on unmount
//     return () => mapInstance.remove();
//   }, [userLocation]);

//   useEffect(() => {
//     if (map && destination) {
//       // Draw a route from the user's location to the destination
//       ttServices.services.calculateRoute({
//         key: process.env.TOMTOM_API_KEY, // Replace with your TomTom API key
//         locations: [
//           `${userLocation.lng},${userLocation.lat}`,
//           `${destination.lng},${destination.lat}`,
//         ],
//       }).then((routeData) => {
//         const geoJson = routeData.toGeoJson();
//         map.addLayer({
//           id: 'route',
//           type: 'line',
//           source: {
//             type: 'geojson',
//             data: geoJson,
//           },
//           paint: {
//             'line-color': '#4a90e2',
//             'line-width': 6,
//           },
//         });
//       });
//     }
//   }, [map, userLocation, destination]);

//   useEffect(() => {
//     // Update the marker position when the user's location changes
//     if (markerRef.current) {
//       markerRef.current.setLngLat([userLocation.lng, userLocation.lat]);
//       map.setCenter([userLocation.lng, userLocation.lat]);
//     }
//   }, [userLocation]);

//   return (
//     <div>
//       <div ref={mapElement} className="h-screen w-full"></div>
//     </div>
//   );
// };

// export default LiveTracking;


// import React, { useEffect, useRef, useState } from 'react';
// import tt from "@tomtom-international/web-sdk-maps";
// import ttServices from "@tomtom-international/web-sdk-services";
// import '@tomtom-international/web-sdk-maps/dist/maps.css';

// const LiveTracking = ({ destination }) => {
//   const mapRef = useRef(null);
//   const markerRef = useRef(null);
//   const [map, setMap] = useState(null);
//   const [currentLocation, setCurrentLocation] = useState(null);

//   // Initialize the map when user's location is available
//   useEffect(() => {
//     if (!currentLocation) return;

//     const mapInstance = tt.map({
//       key: process.env.TOMTOM_API_KEY,
//       container: mapRef.current,
//       center: [currentLocation.lng, currentLocation.lat],
//       zoom: 14,
//     });

//     setMap(mapInstance);

//     // Add marker at user's current location
//     const marker = new tt.Marker().setLngLat([currentLocation.lng, currentLocation.lat]).addTo(mapInstance);
//     markerRef.current = marker;

//     return () => mapInstance.remove();
//   }, [currentLocation]);

//   // Start live tracking with geolocation
//   useEffect(() => {
//     if (navigator.geolocation) {
//       const watchId = navigator.geolocation.watchPosition(
//         (position) => {
//           const updatedLocation = {
//             lat: position.coords.latitude,
//             lng: position.coords.longitude,
//           };
//           setCurrentLocation(updatedLocation);

//           // Update marker and map center if already initialized
//           if (markerRef.current) {
//             markerRef.current.setLngLat([updatedLocation.lng, updatedLocation.lat]);
//             map?.setCenter([updatedLocation.lng, updatedLocation.lat]);
//           }
//         },
//         (error) => {
//           console.error("Error fetching location:", error);
//         },
//         { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
//       );

//       return () => navigator.geolocation.clearWatch(watchId);
//     } else {
//       console.error("Geolocation is not supported by this browser.");
//     }
//   }, [map]);

//   // Draw route when both map and destination are available
//   useEffect(() => {
//     if (map && currentLocation && destination) {
//       ttServices.services
//         .calculateRoute({
//           key: process.env.TOMTOM_API_KEY,
//           locations: [
//             `${currentLocation.lng},${currentLocation.lat}`,
//             `${destination.lng},${destination.lat}`,
//           ],
//         })
//         .then((response) => {
//           const geoJson = response.toGeoJson();
//           if (map.getLayer("route")) {
//             map.removeLayer("route");
//             map.removeSource("route");
//           }
//           map.addLayer({
//             id: "route",
//             type: "line",
//             source: {
//               type: "geojson",
//               data: geoJson,
//             },
//             paint: {
//               "line-color": "#4a90e2",
//               "line-width": 6,
//             },
//           });
//         });
//     }
//   }, [map, currentLocation, destination]);

//   return (
//     <div>
//       <div ref={mapRef} className="h-screen w-full" />
//     </div>
//   );
// };

// export default LiveTracking;

import React, { useEffect, useRef, useState } from 'react';
import tt from '@tomtom-international/web-sdk-maps';
import ttServices from '@tomtom-international/web-sdk-services';
import '@tomtom-international/web-sdk-maps/dist/maps.css';

const LiveTracking = ({ destination }) => {
    const mapElement = useRef(null);
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const [userPosition, setUserPosition] = useState(null);

    // Initialize map
    useEffect(() => {
        const map = tt.map({
            key: import.meta.env.VITE_TOMTOM_API_KEY,
            container: mapElement.current,
            center: [77.2090, 28.6139], // Default center (New Delhi)
            zoom: 14,
        });

        mapRef.current = map;

        // Add destination marker
        if (destination?.lat && destination?.lng) {
            new tt.Marker({ color: 'red' })
                .setLngLat([destination.lng, destination.lat])
                .addTo(map);
        }

        return () => map.remove();
    }, [destination]);

    // Track user & update route
    useEffect(() => {
        if (!navigator.geolocation || !destination?.lat || !destination?.lng) {
            console.warn('Geolocation not supported or destination missing.');
            return;
        }

        const drawRoute = (origin, destination) => {
            if (!origin?.lat || !origin?.lng || !destination?.lat || !destination?.lng) {
                console.error("Missing coordinates for drawing route");
                return;
            }

            ttServices.services
                .calculateRoute({
                    key: import.meta.env.VITE_TOMTOM_API_KEY,
                    locations: [`${origin.lng},${origin.lat}`, `${destination.lng},${destination.lat}`],
                })
                .then((response) => {
                    const geojson = response.toGeoJson();

                    if (mapRef.current.getLayer('route')) {
                        mapRef.current.removeLayer('route');
                        mapRef.current.removeSource('route');
                    }

                    mapRef.current.addLayer({
                        id: 'route',
                        type: 'line',
                        source: {
                            type: 'geojson',
                            data: geojson,
                        },
                        paint: {
                            'line-color': '#007aff',
                            'line-width': 6,
                        },
                    });
                })
                .catch((error) => {
                    console.error("❌ Failed to fetch route:", error);
                });
        };

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;

                if (latitude == null || longitude == null) {
                    console.error('❌ Received null latitude or longitude.');
                    return;
                }

                const current = {
                    lat: latitude,
                    lng: longitude,
                };

                setUserPosition(current);

                if (mapRef.current) {
                    mapRef.current.setCenter([current.lng, current.lat]);

                    if (!markerRef.current) {
                        markerRef.current = new tt.Marker()
                            .setLngLat([current.lng, current.lat])
                            .addTo(mapRef.current);
                    } else {
                        markerRef.current.setLngLat([current.lng, current.lat]);
                    }

                    drawRoute(current, destination);
                }
            },
            (error) => {
                console.error('❌ Geolocation error:', error);
                switch (error.code) {
                    case 1:
                        alert("Permission denied for location access.");
                        break;
                    case 2:
                        alert("Position unavailable. Try again later.");
                        break;
                    case 3:
                        alert("Location request timed out. Try moving to an open area or check your connection.");
                        break;
                    default:
                        alert("An unknown geolocation error occurred.");
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 30000,  // 30 seconds
                maximumAge: 0,
            }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, [destination]);

    return (
        <div ref={mapElement} style={{ width: '100%', height: '60vh' }} />
    );
};

export default LiveTracking;
