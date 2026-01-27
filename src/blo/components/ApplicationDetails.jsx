import { useState, useEffect } from 'react';
import { getApplicationDetails } from '../services/bloService';
import { toast } from 'react-toastify';
import LoadingSmall from '../../components/SmallLoading';
import { useNavigate, useParams } from 'react-router';

export default function ApplicationDetails() {
  const [applicationData, setApplicationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { applicationId } = useParams();

  useEffect(() => {
    if (applicationId) {
      fetchApplicationDetails();
    }
  }, [applicationId]);

  const fetchApplicationDetails = async () => {
    try {
      setLoading(true);
      console.log('Fetching application details for ID:', applicationId);
      const data = await getApplicationDetails(applicationId);
      console.log("Application details:", data);
      setApplicationData(data);
    } catch (error) {
      console.error('Full error object:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      toast.error(`Failed to load application details: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSmall size="lg" />
      </div>
    );
  }

  if (!applicationData) {
    return (
      <div className="text-center p-8 text-gray-500">
        Application not found
      </div>
    );
  }

  const DetailField = ({ label, value }) => (
    <div className="border-b border-gray-200 py-3">
      <div className="flex justify-between">
        <span className="text-sm font-medium text-gray-600">{label}</span>
        <span className="text-sm text-gray-900">{value || 'N/A'}</span>
      </div>
    </div>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'PENDING_FIELD_VERIFICATION': return 'bg-yellow-100 text-yellow-800';
      case 'UNDER_VERIFICATION': return 'bg-blue-100 text-blue-800';
      case 'FORWARDED_TO_ERO': return 'bg-purple-100 text-purple-800';
      case 'QUERY_RAISED': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="bg-blue-600 rounded-lg p-3 mr-4">
                <span className="text-white text-2xl">📄</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  Application Details
                  <span className="ml-3 text-blue-600">🔍</span>
                </h1>
                <p className="text-sm text-gray-600 mt-1 flex items-center">
                  <span className="mr-1">#</span>
                  Application #{applicationData.applicationNumber}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/blo/applications/${applicationId}/documents`)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center transition-colors"
              >
                <span className="mr-2">📁</span>
                View Documents
              </button>
              <button
                onClick={() => navigate('/blo/applications')}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center transition-colors"
              >
                <span className="mr-2">←</span>
                Back to Applications
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Basic Information */}
          <div className="bg-white border rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(applicationData.applicationStatus)}`}>
                {applicationData.applicationStatus?.replace(/_/g, ' ')}
              </span>
            </div>

            <div className="space-y-1">
              <DetailField label="Application Number" value={applicationData.applicationNumber} />
              <DetailField label="Form Type" value={applicationData.formType} />
              <DetailField label="Full Name" value={applicationData.fullName} />
              <DetailField label="First Name" value={applicationData.firstName} />
              <DetailField label="Last Name" value={applicationData.lastName} />
              <DetailField label="Date of Birth" value={applicationData.dob ? new Date(applicationData.dob).toLocaleDateString() : null} />
              <DetailField label="Gender" value={applicationData.gender} />
              <DetailField label="EPIC Number" value={applicationData.epicNumber} />
            </div>
          </div>

          {/* Family Information */}
          <div className="bg-white border rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Family Information</h2>
            <div className="space-y-1">
              <DetailField label="Father's Name" value={applicationData.fatherName} />
              <DetailField label="Mother's Name" value={applicationData.motherName} />
              <DetailField label="Husband's Name" value={applicationData.husbandName} />
              <DetailField label="Related EPIC" value={applicationData.relatedEPIC} />
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-white border rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Address Information</h2>
            <div className="space-y-1">
              <DetailField label="Address" value={applicationData.address} />
              <DetailField label="City" value={applicationData.city} />
              <DetailField label="Postal Code" value={applicationData.postalcode} />
              <DetailField label="New Address" value={applicationData.newAddress} />
            </div>
          </div>

          {/* Electoral Information */}
          <div className="bg-white border rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Electoral Information</h2>
            <div className="space-y-1">
              <DetailField label="Assembly Constituency" value={applicationData.assemblyConstituencyName} />
              <DetailField label="Polling Station" value={applicationData.pollingStationName} />
              <DetailField label="Part Number" value={applicationData.partNumber} />
            </div>
          </div>

          {/* Form 8 Specific Information */}
          {applicationData.formType === 'FORM8' && (
            <div className="bg-white border rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Correction Details</h2>
              <div className="space-y-1">
                <DetailField label="Field to Correct" value={applicationData.fiedlToCorrect} />
                <DetailField label="Old Value" value={applicationData.oldValue} />
                <DetailField label="New Value" value={applicationData.newValue} />
                <DetailField label="Deletion Reason" value={applicationData.deletionReason} />
              </div>
            </div>
          )}

          {/* Application Status Information */}
          <div className="bg-white border rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Status Information</h2>
            <div className="space-y-1">
              <DetailField label="Submitted Date" value={applicationData.submittedDate ? new Date(applicationData.submittedDate).toLocaleString() : null} />
              <DetailField label="Rejection Reason" value={applicationData.rejectionReason} />
              <DetailField label="Query Raised" value={applicationData.queryRaised} />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => navigate(`/blo/applications/${applicationId}/documents`)}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            View & Verify Documents
          </button>
          <button
            onClick={() => navigate(`/blo/applications/${applicationId}/recommend`)}
            className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Make Recommendation
          </button>
        </div>
      </div>
    </div>
  );
}