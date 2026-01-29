import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { applicationAPI } from "../services/applicationApis";
import { documentApis } from "../services/documentApis";
import LoadingSmall from "../components/SmallLoading";
import { toast } from "react-toastify";
import DocumentCard from "../components/DocumentCard";

export default function ApplicationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState(null);
  const [downloadingDoc, setDownloadingDoc] = useState(null); 

  
  
  
  // Track which doc is downloading

  useEffect(() => {
    fetchApplicationDetails();
  }, [id]);

  const fetchApplicationDetails = async () => {
    setLoading(true);
    try {
      const response = await applicationAPI.getApplication(id);
      
      console.log("Application Details:", response);
      
      if (response.success) {
        setApplication(response.data);
      } else {
        toast.error(response.message || "Failed to load application details");
        navigate("/my-applications");
      }
    } catch (error) {
      console.error("Error fetching application:", error);
      toast.error("Failed to load application details");
      navigate("/my-applications");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadDocument = async (documentId, fileName) => {
    setDownloadingDoc(documentId);
    try {
      await documentApis.downloadDocument(id, documentId, fileName);
      toast.success("Document downloaded successfully!");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download document");
    } finally {
      setDownloadingDoc(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSmall size="lg" />
        <p className="ml-3 text-gray-600">Loading application details...</p>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800 font-semibold">Application not found</p>
          <button
            onClick={() => navigate("/my-applications")}
            className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
          >
            Back to Applications
          </button>
        </div>
      </div>
    );
  }

  const statusColors = {
    SUBMITTED: "bg-blue-100 text-blue-800 border-blue-300",
    UNDER_VERIFICATION: "bg-yellow-100 text-yellow-800 border-yellow-300",
    APPROVED: "bg-green-100 text-green-800 border-green-300",
    REJECTED: "bg-red-100 text-red-800 border-red-300",
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <button
            onClick={() => navigate("/my-applications")}
            className="text-blue-600 hover:text-blue-800 mb-2 flex items-center gap-1"
          >
            ← Back to Applications
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Application Details
          </h1>
          <p className="text-gray-600 mt-1">{application.applicationNumber}</p>
        </div>
        <span
          className={`px-4 py-2 rounded-full text-sm font-semibold border-2 ${
            statusColors[application.applicationStatus]
          }`}
        >
          {application.applicationStatus.replace(/_/g, " ")}
        </span>
      </div>

      {/* Application Info */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Application Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InfoField label="Form Type" value={application.formType} />
          <InfoField label="Submitted Date" value={formatDate(application.submittedDate)} />
          <InfoField label="Part Number" value={application.partNumber || "N/A"} />
          {application.approvedDate && (
            <InfoField label="Approved Date" value={formatDate(application.approvedDate)} />
          )}
          {application.rejectedDate && (
            <InfoField label="Rejected Date" value={formatDate(application.rejectedDate)} />
          )}
        </div>
      </div>

      {/* Personal Details */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Personal Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoField 
            label="Full Name" 
            value={application.fullName || `${application.firstName} ${application.lastName}`} 
          />
          <InfoField label="Date of Birth" value={formatDate(application.dob)} />
          <InfoField label="Gender" value={application.gender} />
          <InfoField 
            label="Marital Status" 
            value={application.maritalStatus ? "Married" : "Unmarried"} 
          />
          <InfoField label="Father's Name" value={application.fatherName || "N/A"} />
          <InfoField label="Mother's Name" value={application.motherName || "N/A"} />
          {application.husbandName && (
            <InfoField label="Husband's Name" value={application.husbandName} />
          )}
        </div>
      </div>

      {/* Address Details */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Address Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoField label="Address" value={application.address} className="md:col-span-2" />
          <InfoField label="City" value={application.city} />
          <InfoField label="Postal Code" value={application.postalcode} />
        </div>
      </div>

      {/* Location Details */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Electoral Location
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoField 
            label="Assembly Constituency" 
            value={application.assemblyConstituencyName} 
          />
          <InfoField 
            label="Polling Station" 
            value={application.pollingStationName} 
          />
        </div>
      </div>

      {/* BLO Assignment */}
      {application.assignedBloName && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">
            Assigned Booth Level Officer (BLO)
          </h2>
          <p className="text-blue-800 font-medium">{application.assignedBloName}</p>
        </div>
      )}

     
      {application.documents && application.documents.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            📎 Uploaded Documents ({application.documents.length})
          </h2>
          <div className="space-y-3">
            {application.documents.map((doc) => (
              <DocumentCard
                key={doc.attachmentId || doc.id}
                document={doc}
                applicationId={id}
                isDownloading={downloadingDoc === (doc.attachmentId || doc.id)}
                onDownload={handleDownloadDocument}
              />
            ))}
          </div>
        </div>
      )}

      {/* No Documents Message */}
      {(!application.documents || application.documents.length === 0) && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <p className="text-gray-500">No documents uploaded for this application</p>
        </div>
      )}
    </div>
  );
}


function InfoField({ label, value, className = "" }) {
  return (
    <div className={className}>
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="font-medium text-gray-900">{value || "N/A"}</p>
    </div>
  );
}
