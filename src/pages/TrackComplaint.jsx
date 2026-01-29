import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const TrackComplaint = () => {
  const [complaintNumber, setComplaintNumber] = useState("");
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();

    if (!complaintNumber.trim()) {
      toast.error("Please enter complaint number");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/complaints/track/${complaintNumber}`
      );
      if (response.data.success) {
        setComplaint(response.data.data);
        toast.success("Complaint found");
      }
    } catch (error) {
      toast.error("Complaint not found");
      setComplaint(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: "bg-amber-50 text-amber-700 border-amber-200",
      IN_PROGRESS: "bg-blue-50 text-blue-700 border-blue-200",
      RESOLVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
      REJECTED: "bg-red-50 text-red-700 border-red-200",
    };
    return colors[status] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        
        {/* Track Card */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl border-2 border-green-200 p-8 mb-8">
          <div className="flex items-start gap-5">
            {/* Icon */}
            <div className="bg-white bg-opacity-60 p-4 rounded-full flex-shrink-0">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Content */}
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Track Status
              </h2>
              <p className="text-gray-600 mb-6">
                Track the current status of your registered complaints.
              </p>

              {/* Search Form */}
              <form onSubmit={handleTrack} className="space-y-3">
                <input
                  type="text"
                  value={complaintNumber}
                  onChange={(e) => setComplaintNumber(e.target.value.toUpperCase())}
                  placeholder="Enter Complaint Number"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition font-medium"
                >
                  {loading ? "Searching..." : "Track Complaint"}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Results */}
        {complaint && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Complaint Number</p>
                <p className="text-lg font-semibold text-gray-900">{complaint.complaintNumber}</p>
              </div>
              <span className={`px-4 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(complaint.status)}`}>
                {complaint.status}
              </span>
            </div>

            {/* Details */}
            <div className="p-6 space-y-5">
              <div>
                <p className="text-sm text-gray-500 mb-1">Subject</p>
                <p className="text-gray-900">{complaint.subject}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Type</p>
                <p className="text-gray-900">{complaint.type}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Submitted On</p>
                <p className="text-gray-900">
                  {new Date(complaint.submittedDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>

              {complaint.resolution && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-green-700 font-medium mb-2">Resolution</p>
                  <p className="text-gray-700 leading-relaxed">{complaint.resolution}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackComplaint;
