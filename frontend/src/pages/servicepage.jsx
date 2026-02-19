import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import api from "../api/axios";

const ServicesPage = () => {
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchTerm = queryParams.get("search")?.toLowerCase() || "";

    useEffect(() => {
        const fetchProviders = async () => {
            setLoading(true);
            try {
                const res = await api.get("/providers");
                let data = res.data;

                if (searchTerm) {
                    data = data.filter(
                        p =>
                            p.serviceType.toLowerCase().includes(searchTerm) ||
                            p.location.toLowerCase().includes(searchTerm)
                    );
                }

                setProviders(data);
            } catch (err) {
                console.error("Error fetching providers", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProviders();
    }, [searchTerm]);

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-6 w-full">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl font-black text-gray-800 mb-2">
                    {searchTerm ? `Results for "${searchTerm}"` : "All Service Professionals"}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
                    {providers.length > 0 ? (
                        providers.map(p => (
                            <div key={p._id} className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
                                <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-md uppercase">
                                    {p.serviceType}
                                </span>
                                <h3 className="text-xl font-bold mt-2">{p.name}</h3>
                                <p className="text-gray-500 text-sm mb-4">📍{p.location}</p>
                                <div className="flex justify-between items-center border-t pt-4">
                                    <p className="font-bold">₹{p.price}/hr</p>
                                    <Link
                                        to={`/book/${p._id}`}
                                        className="bg-black text-white px-4 py-2 rounded-lg text-sm"
                                    >
                                        Book Now
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20">
                            <p className="text-gray-400 text-xl">
                                No services found for "{searchTerm}" in that location.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ServicesPage;
