import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserRideHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getRideDate = (rideId) => {
    if (!rideId) return new Date();
    const timestamp = parseInt(rideId.toString().substring(0, 8), 16) * 1000;
    return new Date(timestamp);
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/history`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setHistory(response.data);
      } catch (err) {
        console.error('Error fetching history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="h-screen bg-gray-50 p-4 overflow-y-auto">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/home')} className="p-2 bg-white rounded-full shadow-md">
          <i className="ri-arrow-left-line text-xl"></i>
        </button>
        <h2 className="text-2xl font-bold">Your Ride History</h2>
      </div>

      {loading ? (
        <p className="text-center text-gray-500 mt-10">Loading...</p>
      ) : history.length === 0 ? (
        <div className="text-center mt-20">
          <i className="ri-road-map-line text-5xl text-gray-300"></i>
          <p className="text-gray-500 mt-2">No rides found.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {history.map((ride) => (
            <div key={ride._id} className="bg-white p-4 rounded-xl shadow-sm border">
              <div className="flex justify-between items-center border-b pb-2 mb-2">
                <div>
                  <h4 className="font-semibold text-lg">{getRideDate(ride._id).toLocaleDateString()}</h4>
                  <p className="text-xs text-gray-500">{getRideDate(ride._id).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                </div>
                <div className="text-right">
                  <h4 className="font-bold text-lg text-green-600">₹{Math.round(ride.fare)}</h4>
                  <span className={`text-xs px-2 py-1 rounded-md ${ride.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {ride.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <i className="ri-map-pin-user-fill text-blue-500 text-xl"></i>
                  <p className="text-sm truncate">{ride.pickup}</p>
                </div>
                <div className="flex items-center gap-3">
                  <i className="ri-map-pin-2-fill text-red-500 text-xl"></i>
                  <p className="text-sm truncate">{ride.destination}</p>
                </div>
              </div>

              {ride.captain && (
                <div className="mt-3 pt-3 border-t flex items-center gap-3">
                  <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <i className="ri-user-star-fill text-gray-500"></i>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Captain: {ride.captain.fullname.firstname}</p>
                    <p className="text-xs text-gray-500">{ride.vehicleType} • {ride.rideMode}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserRideHistory;
