import React, { useEffect, useRef, useState } from 'react';
import tt from '@tomtom-international/web-sdk-maps';
import ttServices from '@tomtom-international/web-sdk-services';
import '@tomtom-international/web-sdk-maps/dist/maps.css';

const CaptainLiveTracking = ({ pickup, destination }) => {
    const mapElement = useRef(null);
    const mapRef = useRef(null);
    const captainMarkerRef = useRef(null);
    const [captainPosition, setCaptainPosition] = useState(null);

    useEffect(() => {
        if (!pickup || !destination || isNaN(pickup.lng) || isNaN(pickup.lat) || isNaN(destination.lng) || isNaN(destination.lat)) {
            console.error('Invalid pickup or destination coordinates');
            return;
        }

        if (!mapElement.current) {
            console.error('Map element not available');
            return;
        }

        // Delay map initialization
        setTimeout(() => {
            const map = tt.map({
                key: import.meta.env.VITE_TOMTOM_API_KEY,
                container: mapElement.current,
                center: [77.2090, 28.6139],
                zoom: 14,
            });

            mapRef.current = map;

            // Pickup Marker
            new tt.Marker({ color: 'orange' }).setLngLat([pickup.lng, pickup.lat]).addTo(map);

            // Destination Marker
            new tt.Marker({ color: 'red' }).setLngLat([destination.lng, destination.lat]).addTo(map);
        }, 0);

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
            }
        };
    }, [pickup, destination]);

    useEffect(() => {
        if (!navigator.geolocation || !pickup || !destination) return;

        const drawRoute = (start, end, id, color) => {
            if (!mapRef.current || isNaN(start.lng) || isNaN(start.lat) || isNaN(end.lng) || isNaN(end.lat)) {
                console.error('Invalid route coordinates');
                return;
            }

            ttServices.services
                .calculateRoute({
                    key: import.meta.env.VITE_TOMTOM_API_KEY,
                    locations: [`${start.lng},${start.lat}`, `${end.lng},${end.lat}`],
                })
                .then((response) => {
                    const geojson = response.toGeoJson();

                    // Remove existing layer if exists
                    if (mapRef.current.getLayer(id)) {
                        mapRef.current.removeLayer(id);
                        mapRef.current.removeSource(id);
                    }

                    mapRef.current.addLayer({
                        id: id,
                        type: 'line',
                        source: {
                            type: 'geojson',
                            data: geojson,
                        },
                        paint: {
                            'line-color': color,
                            'line-width': 6,
                        },
                    });
                })
                .catch((err) => console.error('Route calculation error:', err));
        };

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const current = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                setCaptainPosition(current);

                if (mapRef.current) {
                    mapRef.current.setCenter([current.lng, current.lat]);

                    if (!captainMarkerRef.current) {
                        captainMarkerRef.current = new tt.Marker({ color: 'blue' })
                            .setLngLat([current.lng, current.lat])
                            .addTo(mapRef.current);
                    } else {
                        captainMarkerRef.current.setLngLat([current.lng, current.lat]);
                    }

                    drawRoute(current, pickup, 'route-to-pickup', '#007aff');
                    drawRoute(pickup, destination, 'route-to-destination', '#00cc44');
                }
            },
            (err) => console.error('Geolocation error:', err),
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0,
            }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, [pickup, destination]);

    return (
        <div className="relative w-full max-w-4xl mx-auto">
            {/* Map container */}
            <div
                ref={mapElement}
                className="w-full h-[55vh] min-h-[350px] rounded-xl shadow-md border border-gray-300 overflow-hidden"
            />

            {/* Button */}
            <button
                className="absolute bottom-4 right-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-lg transition-all duration-200"
                onClick={() => {
                    if (captainPosition) {
                        const dist = Math.sqrt(
                            Math.pow(captainPosition.lat - pickup.lat, 2) +
                            Math.pow(captainPosition.lng - pickup.lng, 2)
                        );
                        alert(`📏 Approx distance to pickup: ${dist.toFixed(4)} (units vary)`);
                    } else {
                        alert("Captain's location not found.");
                    }
                }}
            >
                Get Distance
            </button>
        </div>
    );
};

export default CaptainLiveTracking;


// import React, { useEffect, useRef, useState } from 'react';
// import tt from '@tomtom-international/web-sdk-maps';
// import ttServices from '@tomtom-international/web-sdk-services';
// import '@tomtom-international/web-sdk-maps/dist/maps.css';

// const CaptainLiveTracking = ({ pickup, destination }) => {

//     console.log("pickup")
//     console.log(pickup)
//     const mapElement = useRef(null);
//     const mapRef = useRef(null);
//     const captainMarkerRef = useRef(null);
//     const [captainPosition, setCaptainPosition] = useState(null);

//     useEffect(() => {
//         if (!pickup || !destination || isNaN(pickup.lng) || isNaN(pickup.lat) || isNaN(destination.lng) || isNaN(destination.lat)) {
//             console.error('Invalid pickup or destination coordinates');
//             return;
//         }

//         if (!mapElement.current) {
//             console.error('Map element not available');
//             return;
//         }

//         // Defer map initialization to make sure ref is mounted
//         setTimeout(() => {
//             const map = tt.map({
//                 key: import.meta.env.VITE_TOMTOM_API_KEY,
//                 container: mapElement.current,
//                 center: [77.2090, 28.6139],
//                 zoom: 14,
//             });

//             console.log('Map initialized:', map);  // Add this line for debugging

//             mapRef.current = map;

//             // Add pickup marker
//             new tt.Marker({ color: 'orange' }).setLngLat([pickup.lng, pickup.lat]).addTo(map);

//             // Add destination marker
//             new tt.Marker({ color: 'red' }).setLngLat([destination.lng, destination.lat]).addTo(map);
//         }, 0);

//         return () => {
//             if (mapRef.current) {
//                 mapRef.current.remove();
//             }
//         };
//     }, [pickup, destination]);

//     useEffect(() => {
//         if (!navigator.geolocation || !pickup || !destination) return;

//         const drawRoute = (start, end, id, color) => {
//             if (!mapRef.current || isNaN(start.lng) || isNaN(start.lat) || isNaN(end.lng) || isNaN(end.lat)) {
//                 console.error('Invalid route coordinates');
//                 return;
//             }

//             ttServices.services
//                 .calculateRoute({
//                     key: import.meta.env.VITE_TOMTOM_API_KEY,
//                     locations: [`${start.lng},${start.lat}`, `${end.lng},${end.lat}`],
//                 })
//                 .then((response) => {
//                     const geojson = response.toGeoJson();
//                     if (mapRef.current.getLayer(id)) {
//                         mapRef.current.removeLayer(id);
//                         mapRef.current.removeSource(id);
//                     }

//                     mapRef.current.addLayer({
//                         id: id,
//                         type: 'line',
//                         source: {
//                             type: 'geojson',
//                             data: geojson,
//                         },
//                         paint: {
//                             'line-color': color,
//                             'line-width': 6,
//                         },
//                     });
//                 })
//                 .catch((err) => console.error('Route calculation error:', err));
//         };

//         const watchId = navigator.geolocation.watchPosition(
//             (position) => {
//                 const current = {
//                     lat: position.coords.latitude,
//                     lng: position.coords.longitude,
//                 };
            
//                 alert(`📍 Current: ${current.lat}, ${current.lng}\n🚖 Pickup: ${pickup.lat}, ${pickup.lng}`);
            
//                 setCaptainPosition(current);
            
//                 if (mapRef.current) {
//                     mapRef.current.setCenter([current.lng, current.lat]);
            
//                     if (!captainMarkerRef.current) {
//                         captainMarkerRef.current = new tt.Marker({ color: 'blue' })
//                             .setLngLat([current.lng, current.lat])
//                             .addTo(mapRef.current);
//                     } else {
//                         captainMarkerRef.current.setLngLat([current.lng, current.lat]);
//                     }
            
//                     drawRoute(current, pickup, 'route-to-pickup', '#007aff');
//                     drawRoute(pickup, destination, 'route-to-destination', '#00cc44');
//                 }

//             },
//             (err) => console.error('Geolocation error:', err),
//             {
//                 enableHighAccuracy: true,
//                 timeout: 5000,
//                 maximumAge: 0,
//             }
//         );

//         return () => navigator.geolocation.clearWatch(watchId);
//     }, [pickup, destination]);

//     return (
//         // <div
//         //     ref={mapElement}
//         //     style={{
//         //         width: '100%',
//         //         height: '60vh',
//         //         minHeight: '400px',
//         //         border: '1px solid #ddd',
//         //         borderRadius: '10px',
//         //     }}
//         // />

//         // <h3>Captain Tracking Active</h3>
//         <div ref={mapElement} style={{ width: '100%', height: '60vh', minHeight: '400px', border: '1px solid #ddd', borderRadius: '10px' }} />



//     );
// };

// export default CaptainLiveTracking;
