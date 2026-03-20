import React, { useState } from 'react';
import axios from 'axios';

const RateCaptainPanel = ({ ride, onSkip, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hovered, setHovered] = useState(0);

  const handleSubmit = async () => {
    if (rating === 0) return;
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/${ride._id}/rate`, 
      { rating }, 
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      onSubmit();
    } catch (err) {
      console.error('Failed to submit rating:', err);
      // Even if it fails, maybe let them go home to avoid getting stuck
      onSubmit();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Rate your ride</h2>
      
      <div className="h-20 w-20 bg-gray-200 rounded-full flex items-center justify-center mb-4 overflow-hidden">
         {/* using a placeholder icon instead of image since we only have captain firstname */}
         <i className="ri-user-smile-fill text-4xl text-gray-500"></i>
      </div>
      
      <h3 className="text-xl font-semibold mb-2">{ride?.captain?.fullname?.firstname || 'Captain'}</h3>
      <p className="text-gray-500 text-sm mb-6">How was your experience?</p>

      <div className="flex gap-4 mb-8">
        {[1, 2, 3, 4, 5].map((star) => (
          <i 
            key={star} 
            className={`text-4xl cursor-pointer transition-colors ${
              (hovered || rating) >= star ? 'ri-star-fill text-yellow-500' : 'ri-star-line text-gray-300'
            }`}
             onClick={() => setRating(star)}
             onMouseEnter={() => setHovered(star)}
             onMouseLeave={() => setHovered(0)}
          ></i>
        ))}
      </div>

      <div className="w-full flex flex-col gap-3">
        <button 
          onClick={handleSubmit} 
          disabled={rating === 0 || loading}
          className={`w-full py-3 rounded-lg font-semibold text-white transition-opacity ${
            rating === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-black'
          }`}
        >
          {loading ? 'Submitting...' : 'Submit Rating'}
        </button>
        <button 
          onClick={onSkip}
          disabled={loading}
          className="w-full py-3 bg-gray-100 text-gray-600 rounded-lg font-semibold"
        >
          Skip
        </button>
      </div>
    </div>
  );
};

export default RateCaptainPanel;
