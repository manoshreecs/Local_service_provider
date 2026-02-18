import React from "react";
import electrical from "../assets/electrical.png";
import painter from "../assets/painter.png";
import cleaning from "../assets/cleaning.png";
import plumber from "../assets/plumber.png";
import masonry from "../assets/masonry.png";
import carpenter from "../assets/carpenter.png";
const services = [
    { name: "Electrical", image: electrical },
    { name: "Painting", image: painter },
    { name: "Cleaning", image: cleaning },
    { name: "Plumbing", image: plumber },
    { name: "Masonry", image: masonry },
    { name: "Carpentry", image: carpenter },
];
const ServiceCategories = ({ setSelectedService }) => {
    const handleServiceClick = (name) => {
        setSelectedService(name);


        const section = document.getElementById("provider-results");
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    };

    return ( <
        div className = "mt-12 px-6 md:px-12" >
        <
        h2 className = "text-2xl md:text-3xl font-bold mb-8 text-gray-800" >
        Our Services <
        /h2>

        <
        div className = "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6" > {
            services.map((service, index) => ( <
                div key = { index }
                onClick = {
                    () => handleServiceClick(service.name)
                }
                className = "rounded-xl shadow-md overflow-hidden transition-all duration-300 cursor-pointer border-2 active:scale-95 bg-blue-100 border-blue-200 hover:bg-blue-200" >
                <
                div className = "p-4 flex flex-col items-center" >
                <
                img src = { service.image }
                alt = { service.name }
                className = "w-full h-32 object-contain" /
                >
                <
                h3 className = "mt-4 text-lg font-bold text-blue-800" > { service.name } <
                /h3> < /
                div > <
                /div>
            ))
        } <
        /div> < /
        div >
    );
};

export default ServiceCategories;