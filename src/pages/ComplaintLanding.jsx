import React from "react";

import { useNavigate } from "react-router";
import { ClipboardList, Search } from "lucide-react";
import GenericActionCard from "../components/GenericCard";

function ComplaintLanding() {
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <h1 className="text-2xl font-semibold text-center text-gray-900">
        Complaints
      </h1>

      <p className="text-center text-gray-600 mt-2">
        Register and track complaints related to electoral services
      </p>

      {/* Cards */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Register Complaint */}
        <GenericActionCard
          icon={<ClipboardList className="w-6 h-6 text-orange-700" />}
          title="Register Complaint"
          description="Register grievances related to electoral services. You can also use the Voter Mitra chatbot."
          primaryAction={{
            label: "Register Complaint",
            onClick: () => navigate("/complaints/new"),
          }}
          theme={{
            border: "border-orange-400",
            bg: "bg-orange-100",
            iconBg: "bg-orange-200",
            primaryBtn: "bg-orange-500 hover:bg-orange-600",
          }}
        />

        {/* Track Status */}
        <GenericActionCard
          icon={<Search className="w-6 h-6 text-green-700" />}
          title="Track Status"
          description="Track the current status of your registered complaints."
          primaryAction={{
            label: "Track Complaint",
            onClick: () => navigate("/complaints/track"),
          }}
          theme={{
            border: "border-green-400",
            bg: "bg-green-100",
            iconBg: "bg-green-200",
            primaryBtn: "bg-green-500 hover:bg-green-600",
          }}
        />
      </div>
    </div>
  );
}

export default ComplaintLanding;
