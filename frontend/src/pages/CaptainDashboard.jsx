import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const CaptainDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/captains/analytics`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setData(response.data);
      } catch (err) {
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <div className="h-screen bg-gray-100 p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/captain-home')} className="p-2 bg-white rounded-full shadow-md">
            <i className="ri-arrow-left-line text-xl"></i>
          </button>
          <h2 className="text-2xl font-bold">Analytics</h2>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-500 mt-10">Loading Dashboard...</p>
      ) : data ? (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl shadow border-l-4 border-green-500">
              <h4 className="text-sm text-gray-500 font-medium">Lifetime Earnings</h4>
              <p className="text-2xl font-bold text-green-600">₹{data.lifetimeEarnings.toFixed(2)}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow border-l-4 border-blue-500">
              <h4 className="text-sm text-gray-500 font-medium">Total Rides</h4>
              <p className="text-2xl font-bold text-gray-800">{data.totalRides}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <h4 className="text-md font-semibold mb-4 border-b pb-2">Rating Overview</h4>
            <div className="flex items-center gap-3">
              <div className="h-16 w-16 rounded-full bg-yellow-100 flex items-center justify-center border-4 border-yellow-400">
                <h3 className="text-xl font-bold text-yellow-600">{data.averageRating.toFixed(1)}</h3>
              </div>
              <div>
                <div className="flex text-yellow-500 text-lg">
                  {[1,2,3,4,5].map(star => (
                    <i key={star} className={data.averageRating >= star ? "ri-star-fill" : "ri-star-line"}></i>
                  ))}
                </div>
                <p className="text-xs text-gray-500">Average based on all rated past rides.</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <h4 className="text-md font-semibold mb-4 border-b pb-2">Earnings Breakdown</h4>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.chartData}>
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} width={40} tickFormatter={(value) => Math.round(value)} />
                  <Tooltip 
                    cursor={{fill: 'transparent'}} 
                    formatter={(value) => [Math.round(value), "Earnings"]}
                  />
                  <Bar dataKey="earnings" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-red-500 mt-10">Failed to load analytics.</p>
      )}
    </div>
  );
};

export default CaptainDashboard;
