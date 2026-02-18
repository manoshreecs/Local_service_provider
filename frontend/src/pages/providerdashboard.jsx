import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/authcontext";

const ProviderDashboard = () => {
  const { login, token } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [myServices, setMyServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  
  // Auth states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Service states
  const [serviceData, setServiceData] = useState({
    name: "",
    serviceType: "Electrical",
    location: "",
    price: "",
    experience: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (token) {
      fetchMyServices();
      fetchMyBookings();
    }
  }, [token]);

  const fetchMyServices = async () => {
    try {
      const res = await api.get("/providers/my", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyServices(res.data);
    } catch (err) {
      console.error("Error fetching services", err);
    }
  };

  const fetchMyBookings = async () => {
    try {
      const res = await api.get("/bookings/provider", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(res.data);
    } catch (err) {
      console.error("Error fetching bookings", err);
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isLogin) {
        const res = await api.post("/auth/login", { email, password });
        if (res.data.user.role !== "provider") {
          setError("Access Denied: Not a provider account.");
          return;
        }
        login(res.data.token);
      } else {
        await api.post("/auth/register", { name, email, password, role: "provider" });
        setIsLogin(true);
        setError("Account created. Please login.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Auth failed");
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", serviceData.name);
    formData.append("serviceType", serviceData.serviceType);
    formData.append("location", serviceData.location);
    formData.append("price", serviceData.price);
    formData.append("experience", serviceData.experience);
    
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      await api.post("/providers", formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data" 
        }
      });
      alert("Service Published!");
      setServiceData({ name: "", serviceType: "Electrical", location: "", price: "", experience: "" });
      setImageFile(null);
      fetchMyServices();
    } catch (err) {
      alert("Upload failed.");
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await api.put(`/bookings/status/${bookingId}`, 
        { status: newStatus }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchMyBookings(); // Refresh list
    } catch (err) {
      alert("Could not update booking status");
    }
  };

  const toggleAvailability = async (serviceId, currentStatus) => {
    try {
      await api.put(`/providers/${serviceId}`, { isAvailable: !currentStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMyServices();
    } catch (err) {
      alert("Could not update status");
    }
  };

  const deleteService = async (serviceId) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await api.delete(`/providers/${serviceId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMyServices(); 
    } catch (err) {
      alert("Could not delete service");
    }
  };

  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full bg-gray-100">
        <form onSubmit={handleAuthSubmit} className="bg-white max-w-[360px] w-full mx-4 p-6 py-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">{isLogin ? "Provider Login" : "Provider Sign Up"}</h2>
          {!isLogin && (
            <input type="text" placeholder="Name" className="w-full border p-2 mb-3 rounded shadow-sm outline-none focus:ring-1 focus:ring-orange-500" value={name} onChange={(e) => setName(e.target.value)} required />
          )}
          <input type="email" placeholder="Email" className="w-full border p-2 mb-3 rounded shadow-sm outline-none focus:ring-1 focus:ring-orange-500" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" className="w-full border p-2 mb-6 rounded shadow-sm outline-none focus:ring-1 focus:ring-orange-500" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error && <p className="text-red-500 text-xs mb-3 text-center">{error}</p>}
          <button disabled={loading} className="w-full bg-orange-500 py-2.5 rounded text-white font-medium hover:bg-orange-600 transition">
            {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
          </button>
          <button type="button" onClick={() => setIsLogin(!isLogin)} className="w-full text-center mt-4 text-sm text-orange-500 underline">
            {isLogin ? "Create Provider Account" : "Back to Login"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full pb-20">
      <nav className="w-full bg-orange-600 p-4 text-white flex justify-between items-center px-6 md:px-12 shadow-md mb-8">
        <Link to="/" className="text-2xl font-bold tracking-tight">ServiceHub</Link>
        <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="bg-white text-orange-600 px-5 py-2 rounded-full font-bold text-sm hover:bg-gray-100 transition shadow">Logout</button>
      </nav>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 px-6 md:px-10">
        
        {/* SECTION 1: ADD SERVICE FORM */}
        <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-orange-500 h-fit sticky top-24">
          <h3 className="font-bold text-lg mb-4 text-gray-800 uppercase tracking-wide">Publish New Service</h3>
          <form onSubmit={handleAddService} className="space-y-4">
            <input type="text" placeholder="Business Name (e.g. John's Repairs)" className="w-full border p-2.5 rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-orange-400" required value={serviceData.name} onChange={(e) => setServiceData({...serviceData, name: e.target.value})} />
            <select className="w-full border p-2.5 rounded-lg bg-gray-50 outline-none" value={serviceData.serviceType} onChange={(e) => setServiceData({...serviceData, serviceType: e.target.value})}>
              <option>Electrical</option><option>Plumbing</option><option>Cleaning</option><option>Carpentry</option><option>Painting</option>
            </select>
            <input type="text" placeholder="Service Location" className="w-full border p-2.5 rounded-lg bg-gray-50 outline-none" required value={serviceData.location} onChange={(e) => setServiceData({...serviceData, location: e.target.value})} />
            <input type="number" placeholder="Rate (₹/hr)" className="w-full border p-2.5 rounded-lg bg-gray-50 outline-none" required value={serviceData.price} onChange={(e) => setServiceData({...serviceData, price: e.target.value})} />
            <input type="number" placeholder="Years of Experience" className="w-full border p-2.5 rounded-lg bg-gray-50 outline-none" required value={serviceData.experience} onChange={(e) => setServiceData({...serviceData, experience: e.target.value})} />
            <div className="border-2 border-dashed p-4 rounded-lg text-center bg-gray-50">
               <input type="file" className="text-xs w-full cursor-pointer" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
            </div>
            <button className="w-full bg-orange-500 text-white py-3 rounded-lg font-bold hover:bg-orange-600 transition shadow-lg active:scale-95">Publish Service</button>
          </form>
        </div>

        {/* SECTION 2: LISTINGS & BOOKINGS */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* MY LISTINGS */}
          <div>
            <h3 className="font-bold text-xl mb-6 text-gray-800">Your Active Services</h3>
            <div className="grid gap-4">
              {myServices.map(s => (
                <div key={s._id} className={`bg-white p-5 rounded-xl shadow-sm flex justify-between items-center border-l-8 transition-all ${s.isAvailable ? 'border-green-500' : 'border-gray-300 opacity-60'}`}>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {s.image ? <img src={s.image} alt="svc" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">NO IMG</div>}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-lg leading-tight">{s.name || s.serviceType}</h4>
                      <p className="text-xs text-gray-500">₹{s.price}/hr • {s.location}</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-center">
                    <div className="flex flex-col items-center">
                       <button onClick={() => toggleAvailability(s._id, s.isAvailable)} className={`px-4 py-1 rounded-full text-[10px] font-black tracking-tighter shadow-sm text-white ${s.isAvailable ? 'bg-green-500' : 'bg-gray-400'}`}>
                         {s.isAvailable ? "ACTIVE" : "INACTIVE"}
                       </button>
                       <button onClick={() => deleteService(s._id)} className="text-red-400 text-[10px] mt-2 font-bold hover:text-red-600 transition">REMOVE</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* INCOMING BOOKINGS */}
          <div>
            <h3 className="font-bold text-xl mb-6 text-gray-800">Incoming Service Bookings</h3>
            <div className="grid gap-4">
              {bookings.length > 0 ? bookings.map((b) => (
                <div key={b._id} className={`bg-white p-6 rounded-2xl shadow-md border-t-4 transition-all ${
                  b.status === 'accepted' ? 'border-green-500' : 
                  b.status === 'rejected' ? 'border-red-500' : 'border-orange-500'
                }`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-black text-gray-900 text-lg">{b.user?.name || "Customer"}</h4>
                      <p className="text-sm text-gray-500 italic">{b.user?.email}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      b.status === 'accepted' ? 'bg-green-100 text-green-700' : 
                      b.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-600'
                    }`}>
                      {b.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs mb-4 bg-gray-50 p-4 rounded-xl border">
                    <p>📅 <b>DATE:</b> {b.date}</p>
                    <p>⏰ <b>TIME:</b> {b.time}</p>
                    <p className="col-span-2">📍 <b>ADDRESS:</b> {b.address}</p>
                  </div>

                  {b.status === "pending" && (
                    <div className="flex gap-3">
                      <button onClick={() => handleStatusUpdate(b._id, "accepted")} className="flex-1 bg-green-600 text-white py-2.5 rounded-xl font-bold hover:bg-green-700 transition active:scale-95 text-sm">Accept</button>
                      <button onClick={() => handleStatusUpdate(b._id, "rejected")} className="flex-1 bg-gray-200 text-gray-700 py-2.5 rounded-xl font-bold hover:bg-gray-300 transition active:scale-95 text-sm">Decline</button>
                    </div>
                  )}
                </div>
              )) : (
                <div className="p-10 bg-white rounded-2xl border-2 border-dashed text-center">
                  <p className="text-gray-400 italic">No bookings yet. They will appear here when customers find your service.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;