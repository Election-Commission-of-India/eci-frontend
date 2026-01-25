import { useState } from "react";
import { toast } from "react-toastify";
import { applicationAPI } from "../services/applicationApis";

export default function TrackStatus() {
  const [referenceNumber, setReferenceNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [applicationData, setApplicationData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!referenceNumber.trim()) {
      toast.error("Please enter reference number");
      return;
    }

    setLoading(true);
    setApplicationData(null);

    try {
      const response = await applicationAPI.trackStatus(referenceNumber.trim());
      
      console.log("Full Response:", response); // Debug

      if (response.success) {
        setApplicationData(response.data); // ← Fixed: response.data NOT response.data.data
        toast.success(response.message || "Application found!");
      } else {
        toast.error(response.message || "Application not found");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error.response?.data?.message || "Application not found"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch (error) {
      return "N/A" ;
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      SUBMITTED: "bg-blue-500",
      UNDER_VERIFICATION: "bg-yellow-500",
      PENDING_FIELD_VERIFICATION: "bg-orange-500",
      APPROVED: "bg-green-500",
      REJECTED: "bg-red-500",
      QUERY_RAISED: "bg-purple-500",
    };
    return colors[status] || "bg-gray-500";
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        
        {/* Search Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Purple Header */}
          <div className="bg-eci-primary py-2 px-1">
            <h1 className="text-2xl font-bold text-white">
              Track Your Application
            </h1>
          </div>

          {/* Form */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-gray-700 font-medium mb-2">
                  Reference Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Reference Number"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value.toUpperCase())}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-eci-primary text-white font-medium py-2 px-8 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? "Searching..." : "Submit"}
              </button>
            </form>
          </div>
        </div>

       
        {applicationData && (
          <div className="mt-6 bg-white rounded-lg shadow-md p-6">
            
          
            <div className="text-center mb-6">
              <span
                className={`inline-block ${getStatusColor(
                  applicationData.applicationStatus
                )} text-white px-6 py-2 rounded-full font-semibold text-lg`}
              >
                {applicationData.applicationStatus?.replace(/_/g, " ")}
              </span>
            </div>

          
            <div className="space-y-4">
              <DetailRow 
                label="Application Number" 
                value={applicationData.applicationNumber} 
              />
              <DetailRow 
                label="Applicant Name" 
                value={applicationData.fullName} 
              />
              <DetailRow 
                label="Form Type" 
                value={applicationData.formType} 
              />
              <DetailRow 
                label="Submitted Date" 
                value={formatDate(applicationData.submittedDate)} 
              />
              <DetailRow 
                label="Assembly Constituency" 
                value={applicationData.assemblyConstituencyName} 
              />
              <DetailRow 
                label="Polling Station" 
                value={applicationData.pollingStationName} 
              />
              
              {applicationData.assignedBloName && (
                <DetailRow 
                  label="Assigned Officer" 
                  value={applicationData.assignedBloName} 
                />
              )}

              {applicationData.approvedDate && (
                <DetailRow 
                  label="Approved Date" 
                  value={formatDate(applicationData.approvedDate)}
                  valueClass="text-green-600 font-semibold"
                />
              )}

              {applicationData.rejectedDate && (
                <DetailRow 
                  label="Rejected Date" 
                  value={formatDate(applicationData.rejectedDate)}
                  valueClass="text-red-600 font-semibold"
                />
              )}
            </div>

            {/* Query/Rejection Messages */}
            {applicationData.queryRaised && (
              <div className="mt-6 bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
                <p className="font-semibold text-purple-800 mb-1">Query Raised</p>
                <p className="text-purple-700 text-sm">{applicationData.queryRaised}</p>
              </div>
            )}

            {applicationData.rejectionReason && (
              <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="font-semibold text-red-800 mb-1">Rejection Reason</p>
                <p className="text-red-700 text-sm">{applicationData.rejectionReason}</p>
              </div>
            )}

          
          </div>
        )}

      </div>
    </div>
  );
}


function DetailRow({ label, value, valueClass = "text-gray-800" }) {
  return (
    <div className="flex justify-between py-2 border-b">
      <span className="text-gray-600 font-medium">{label}</span>
      <span className={`${valueClass} font-semibold`}>{value || "N/A"}</span>
    </div>
  );
}
