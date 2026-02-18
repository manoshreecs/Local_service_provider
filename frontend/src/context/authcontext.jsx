import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [token, setToken] = useState(localStorage.getItem("token"));

    const login = (jwtToken) => {
        localStorage.setItem("token", jwtToken);
        setToken(jwtToken);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
    };


    const [activeStep, setActiveStep] = useState(0);

    const nextStep = () => {
        setActiveStep((prev) => (prev < 2 ? prev + 1 : prev));
    };

    const prevStep = () => {
        setActiveStep((prev) => (prev > 0 ? prev - 1 : prev));
    };

    return ( <
        AuthContext.Provider value = {
            {
                token,
                login,
                logout,
                activeStep,
                nextStep,
                prevStep
            }
        } >
        { children } <
        /AuthContext.Provider>
    );
};