import React, { createContext, useState, useEffect } from 'react';

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const updateLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => {
            console.error('Error getting location:', error);
          },
          {
            enableHighAccuracy: true,
            timeout: 70000,
            maximumAge: 0,
          }
        );
      } else {
        console.error('Geolocation not supported');
      }
    };

    updateLocation();

    const interval = setInterval(updateLocation, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <LocationContext.Provider value={{ location, setLocation }}>
      {children}
    </LocationContext.Provider>
  );
};
