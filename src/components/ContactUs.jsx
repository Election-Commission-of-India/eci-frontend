import React from "react";
import { FiPhone, FiMail, FiHome } from "react-icons/fi";

const ContactUs = () => {
  return (
    <div className="w-full bg-eci-yellowish border-2 border-yellow-400 rounded-xl p-6">
      
      <div className="max-w-6xl mx-auto">
        
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Contact Us
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Phone */}
          <div className="flex gap-3">
            <FiPhone size={24} />
            <div>
              <p className="font-semibold">Contact Number</p>
              <p className="text-gray-700">1950 (Toll-free Number)</p>
            </div>
          </div>

          {/* Address */}
          <div className="flex gap-3">
            <FiHome size={24} />
            <div>
              <p className="font-semibold">Postal Address</p>
              <p className="text-gray-700">
                Election Commission of India,  
                Nirvachan Sadan, Ashoka Road,  
                New Delhi 110001
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="flex gap-3">
            <FiMail size={24} />
            <div>
              <p className="font-semibold">Email</p>
              <p className="text-gray-700">
                complaints@eci.gov.in
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ContactUs;
