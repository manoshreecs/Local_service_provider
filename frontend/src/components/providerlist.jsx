import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const ProviderList = ({ selectedService }) => {
  const navigate = useNavigate();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [authData, setAuthData] = useState({ name: "", email: "", password: "" });

  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    const fetchProviders = async () => {
      if (!selectedService) return;
      setLoading(true);
      try {
        const response = await api.get(`/providers/service/${selectedService}`);
        setProviders(response.data);
      } catch (error) {
        console.error("Error fetching providers:", error);
        setProviders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProviders();
  }, [selectedService]);

  const handleBookClick = (providerId) => {
    if (!isLoggedIn) {
      setShowAuthModal(true);
    } else {
      // Redirect to the dedicated booking page
      navigate(`/book/${providerId}`);
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isRegistering ? "/auth/register" : "/auth/login";
      const res = await api.post(endpoint, authData);
      
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userName", res.data.user.name);
      
      setShowAuthModal(false);
      window.location.reload(); 
    } catch (err) {
      alert(err.response?.data?.message || "Authentication failed");
    }
  };

  if (!selectedService) return null;

  return (
    <div id="provider-results" className="mt-12 px-6 md:px-12 pb-12 w-full">
      <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800">
        Available {selectedService} Professionals
      </h2>

      {loading ? (
        <p className="text-orange-500 font-medium italic animate-pulse">Searching for experts...</p>
      ) : providers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers.map((provider) => (
            <div key={provider._id} className="bg-white p-5 rounded-xl shadow-md border-t-4 border-t-orange-500 hover:shadow-lg transition-all">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold text-gray-900">{provider.name || "Service Expert"}</h3>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500">{provider.experience} Yrs Exp</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">📍 {provider.location}</p>
              <p className="text-orange-600 font-bold mt-3 text-xl">₹ {provider.price} <span className="text-sm text-gray-400 font-normal">/ hr</span></p>
              
              <button 
                onClick={() => handleBookClick(provider._id)}
                className="mt-4 w-full bg-orange-500 text-white py-2 rounded-lg text-sm font-bold hover:bg-orange-600 transition shadow-sm active:scale-95"
              >
                Book Now
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 p-10 rounded-xl text-center border-2 border-dashed">
          <p className="text-gray-500">No {selectedService} providers available right now.</p>
        </div>
      )}

      {/* AUTH MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 relative">
            <button onClick={() => setShowAuthModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{isRegistering ? "Create an Account" : "Login to Book"}</h2>
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {isRegistering && (
                <input type="text" placeholder="Full Name" required className="w-full border p-3 rounded-lg outline-orange-500" onChange={(e) => setAuthData({...authData, name: e.target.value})} />
              )}
              <input type="email" placeholder="Email Address" required className="w-full border p-3 rounded-lg outline-orange-500" onChange={(e) => setAuthData({...authData, email: e.target.value})} />
              <input type="password" placeholder="Password" required className="w-full border p-3 rounded-lg outline-orange-500" onChange={(e) => setAuthData({...authData, password: e.target.value})} />
              <button type="submit" className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 transition-all shadow-lg">
                {isRegistering ? "Register & Continue" : "Login & Continue"}
              </button>
            </form>
            <button onClick={() => setIsRegistering(!isRegistering)} className="w-full text-center mt-4 text-sm text-orange-600 font-bold">
              {isRegistering ? "Already have an account? Login" : "New here? Create account"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderList;