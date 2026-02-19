import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

const BookingPage = () => {
    const { providerId } = useParams();
    const navigate = useNavigate();
    const [provider, setProvider] = useState(null);
    const [loading, setLoading] = useState(true);

    const [bookingData, setBookingData] = useState({
        date: "",
        time: "",
        address: "",
    });

    useEffect(() => {
        const fetchProviderDetail = async () => {
            try {
                const res = await api.get(`/providers/${providerId}`);
                setProvider(res.data);
            } catch (err) {
                console.error("Error fetching provider", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProviderDetail();
    }, [providerId]);

    const handleConfirmBooking = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");

            await api.post(
                "/bookings",
                {
                    provider: providerId,
                    date: bookingData.date,
                    time: bookingData.time,
                    address: bookingData.address,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("🎉 Booking request sent successfully!");
            navigate("/");
        } catch (err) {
            alert(err.response?.data?.message || "Booking failed.");
        }
    };

    if (loading)
        return (
            <div className="text-center py-20 font-bold text-orange-500">Loading...</div>
        );

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-6">
            <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
                <div className="bg-orange-600 text-white p-10 md:w-2/5 flex flex-col justify-center">
                    <h2 className="text-3xl font-bold mb-4 uppercase">{provider?.serviceType}</h2>
                    <div className="space-y-4 border-t border-orange-400 pt-6">
                        <p className="flex justify-between">
                            <span>Rate:</span> <b>₹{provider?.price}/hr</b>
                        </p>
                        <p className="flex justify-between">
                            <span>Location:</span> <b>{provider?.location}</b>
                        </p>
                        <p className="flex justify-between">
                            <span>Exp:</span> <b>{provider?.experience} Yrs</b>
                        </p>
                    </div>
                </div>

                <div className="p-10 md:w-3/5">
                    <h3 className="text-2xl font-black text-gray-800 mb-6">
                        Confirm Your Schedule
                    </h3>
                    <form onSubmit={handleConfirmBooking} className="space-y-6">
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase mb-2">
                                Select Date
                            </label>
                            <input
                                type="date"
                                required
                                className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-orange-500 outline-none"
                                onChange={(e) =>
                                    setBookingData({ ...bookingData, date: e.target.value })
                                }
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase mb-2">
                                Select Time
                            </label>
                            <input
                                type="time"
                                required
                                className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-orange-500 outline-none"
                                onChange={(e) =>
                                    setBookingData({ ...bookingData, time: e.target.value })
                                }
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase mb-2">
                                Service Address
                            </label>
                            <textarea
                                required
                                placeholder="Enter full address..."
                                className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-orange-500 outline-none h-24"
                                onChange={(e) =>
                                    setBookingData({ ...bookingData, address: e.target.value })
                                }
                            />
                        </div>

                        <button className="w-full bg-black text-white py-4 rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-xl">
                            Book Appointment
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;
