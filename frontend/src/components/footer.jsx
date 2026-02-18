import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-900 text-white py-6 mt-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 items-center gap-4">
       
        <div className="flex flex-col items-start">
          <h2 className="text-xl font-bold text-orange-500">ServiceHub</h2>
          <p className="text-gray-400 text-[10px] uppercase tracking-wider">
             Connecting You With Local Professionals
          </p>
        </div>

      
        <div className="text-gray-500 text-xs text-center">
          © 2026 ServiceHub. All rights reserved.
        </div>

        
        <div className="text-sm text-gray-400 flex flex-col md:items-end">
          <span>support@servicehub.com</span>
          <span className="text-xs">+1 (234) 567-890</span>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;