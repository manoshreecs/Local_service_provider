import React, { useState, useEffect } from "react";
import api from "../api/axios";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/bookings/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(res.data);
      } catch (err) {
        console.error("Error fetching bookings", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserBookings();
  }, []);

  if (loading) return <div className="text-center py-20 font-bold text-orange-500">Loading your history...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-black text-gray-800 mb-8">My Booking History</h2>

        {bookings.length > 0 ? (
          <div className="grid gap-6">
            {bookings.map((b) => (
              <div key={b._id} className="bg-white p-6 rounded-2xl shadow-md border-l-8 flex flex-col md:flex-row md:items-center justify-between transition-all hover:shadow-lg"
                style={{ borderLeftColor: b.status === 'accepted' ? '#22c55e' : b.status === 'rejected' ? '#ef4444' : '#f97316' }}>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-black uppercase tracking-widest text-orange-500">
                      {b.provider?.serviceType || "Service"}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      b.status === 'accepted' ? 'bg-green-100 text-green-700' : 
                      b.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-600'
                    }`}>
                      {b.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {b.provider?.name || "Professional Service"}
                  </h3>
                  <p className="text-sm text-gray-500">📍 {b.address}</p>
                </div>

                <div className="mt-4 md:mt-0 bg-gray-50 p-4 rounded-xl flex gap-6 text-center">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Date</p>
                    <p className="font-bold text-gray-800">{b.date}</p>
                  </div>
                  <div className="border-l pl-6">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Time</p>
                    <p className="font-bold text-gray-800">{b.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-20 rounded-3xl text-center border-2 border-dashed border-gray-200">
            <p className="text-gray-400 text-lg">You haven't booked any services yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;