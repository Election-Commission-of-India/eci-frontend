import React from "react";
import { useNavigate } from "react-router";

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-pink-50 border-2 border-pink-400 rounded-xl p-6">
      
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
        
        {/* Icon */}
        <div className="flex items-start">
          <div className="w-16 h-16 rounded-full bg-pink-200 flex items-center justify-center">
            🏛️
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-900">
            About Us
          </h2>

          <p className="text-gray-700 mt-2 leading-relaxed">
            The Election Commission of India is an autonomous constitutional
            authority responsible for administering Union and State election
            processes in India. The body administers elections to the Lok Sabha,
            Rajya Sabha, State Legislative Assemblies, and the offices of the
            President and Vice President of India.
          </p>

          <div className="mt-4">
            <button
              onClick={() => navigate("/aboutus")}
              className="bg-pink-500 text-white px-5 py-2 rounded-lg hover:bg-pink-600 transition"
            >
              Read More →
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutUs;
