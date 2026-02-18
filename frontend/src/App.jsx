import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/sidebar";
import Login from "./pages/login";
import ServiceCategories from "./components/servicecategories";
import ProviderList from "./components/providerlist";
import HowItWorks from "./components/howitworks";
import Footer from "./components/footer";
import ProviderDashboard from "./pages/providerdashboard";
import BookingPage from "./pages/bookingpage";
import MyBookings from "./pages/mybookings";
import ServicesPage from "./pages/servicepage";

function App() {
    const [selectedService, setSelectedService] = useState("Electrical");
    const location = useLocation();

    const hideSidebar =
        location.pathname.startsWith("/provider") ||
        location.pathname.startsWith("/book");

    return ( <
        div className = "flex min-h-screen w-full bg-gray-50" > {!hideSidebar && < Sidebar / > }

        <
        div className = { `flex-1 flex flex-col items-start w-full ${!hideSidebar ? "pt-20" : ""}` } >
        <
        Routes >
        <
        Route path = "/"
        element = { <
            div className = "w-full flex flex-col items-start" >
            <
            div className = "w-full text-center py-12 bg-orange-100 border-b border-orange-200" >
            <
            h1 className = "text-3xl md:text-5xl font-extrabold text-orange-600 tracking-tight" > Welcome to ServiceHub < /h1> <
            p className = "text-gray-600 mt-3 text-lg" > Find the best local service professionals near you in seconds < /p> <
            /div> <
            div className = "w-full px-6 md:px-12" >
            <
            ServiceCategories setSelectedService = { setSelectedService }
            /> <
            ProviderList selectedService = { selectedService }
            /> <
            HowItWorks / >
            <
            Footer / >
            <
            /div> <
            /div>
        }
        />

        <
        Route path = "/login"
        element = { < Login / > }
        /> <
        Route path = "/services"
        element = { < ServicesPage / > }
        /> <
        Route path = "/provider-dashboard"
        element = { < ProviderDashboard / > }
        /> <
        Route path = "/book/:providerId"
        element = { < BookingPage / > }
        /> <
        Route path = "/bookings"
        element = { < MyBookings / > }
        /> <
        /Routes> <
        /div> <
        /div>
    );
}

export default App;