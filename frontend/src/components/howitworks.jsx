import React, { useContext } from "react";
import { FaSearch, FaCalendarCheck, FaCheckCircle } from "react-icons/fa";

import { AuthContext } from "../context/authcontext";

const steps = [
    { icon: < FaSearch className = "w-10 h-10 text-orange-500" / > , title: "Choose a Service", description: "Select the service you need." },
    { icon: < FaCalendarCheck className = "w-10 h-10 text-orange-500" / > , title: "Select Date & Time", description: "Pick a convenient time." },
    { icon: < FaCheckCircle className = "w-10 h-10 text-orange-500" / > , title: "Confirm & Relax", description: "Let professionals handle the rest." }
];

const HowItWorks = () => {

    const { activeStep, nextStep, prevStep } = useContext(AuthContext);

    return ( <
        div className = "mt-12 px-6 md:px-12 py-12 bg-gray-50 rounded-lg shadow-md" >
        <
        h2 className = "text-2xl md:text-3xl font-bold mb-8 text-gray-800 text-center" > How It Works < /h2> <
        div className = "flex flex-col md:flex-row justify-around items-start gap-6" > {
            steps.map((step, index) => ( <
                div key = { index }
                className = { `flex flex-col items-center text-center bg-white p-6 rounded-lg shadow w-full md:w-1/3 ${
              activeStep === index ? "border-2 border-orange-500" : ""
            }` } >
                <
                div className = "mb-4" > { step.icon } < /div> <
                h3 className = "text-xl font-semibold text-gray-800 mb-2" > { step.title } < /h3> <
                p className = "text-gray-600 text-sm" > { step.description } < /p> <
                /div>
            ))
        } <
        /div> <
        div className = "mt-6 flex justify-center gap-4" >
        <
        button onClick = { prevStep }
        className = "px-4 py-2 bg-gray-300 rounded hover:bg-gray-400" > Previous < /button> <
        button onClick = { nextStep }
        className = "px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600" > Next < /button> <
        /div> <
        /div>
    );
};

export default HowItWorks;