import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getApplicationDetails } from '../services/bloService';
import { toast } from 'react-toastify';
import LoadingSmall from '../../components/SmallLoading';

export default function ApplicationDetails() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [applicationDetails, setApplicationDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplicationDetails();
  }, [applicationId]);

  const fetchApplicationDetails = async () => {
    try {
      setLoading(true);
      const data = await getApplicationDetails(applicationId);
      setApplicationDetails(data);
    } catch (error) {
      toast.error('Failed to fetch application details');
      console.error('Application details error:', error);
      if (error.response?.status === 401) {
        navigate('/blo/login');
      }
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

  if (!applicationDetails) {
    return (
      <div className="text-center p-8">
        <span className="text-4xl mb-4 block">📄</span>
        <p className="text-gray-500">Application details not found</p>
      </div>
    );
  }

  const DetailSection = ({ title, children, icon }) => (
    <div className="bg-white border rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <span className="mr-2 text-xl">{icon}</span>
        {title}
      </h3>
      {children}
    </div>
  );

  const DetailField = ({ label, value }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 py-2 border-b border-gray-100 last:border-b-0">
      <dt className="text-sm font-medium text-gray-600">{label}</dt>
      <dd className="text-sm text-gray-900 md:col-span-2">{value || '-'}</dd>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border rounded-md p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-800 flex items-center">
              <span className="mr-2">📋</span>
              Application Details
            </h1>
            <p className="text-sm text-gray-600">
              Application #{applicationDetails.applicationNumber}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/blo/applications/${applicationId}/documents`)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center transition-colors"
            >
              <span className="mr-2">📄</span>
              View Documents
            </button>
            <button
              onClick={() => navigate(`/blo/applications/${applicationId}/recommend`)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center transition-colors"
            >
              <span className="mr-2">✅</span>
              Recommend
            </button>
            <button
              onClick={() => navigate('/blo/applications')}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center transition-colors"
            >
              <span className="mr-2">←</span>
              Back
            </button>
          </div>
        </div>
      </div>

      {/* Application Status */}
      <div className="bg-white border rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Application Status</h3>
            <p className="text-sm text-gray-600">Current processing status</p>
          </div>
          <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
            applicationDetails.applicationStatus === 'APPROVED' ? 'bg-green-100 text-green-800' :
            applicationDetails.applicationStatus === 'REJECTED' ? 'bg-red-100 text-red-800' :
            applicationDetails.applicationStatus === 'PENDING_FIELD_VERIFICATION' ? 'bg-yellow-100 text-yellow-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {applicationDetails.applicationStatus?.replace(/_/g, ' ')}
          </span>
        </div>
      </div>

      {/* Personal Information */}
      <DetailSection title="Personal Information" icon="👤">
        <dl className="divide-y divide-gray-100">
          <DetailField label="Full Name" value={applicationDetails.fullName} />
          <DetailField label="Father's Name" value={applicationDetails.fatherName} />
          <DetailField label="Mother's Name" value={applicationDetails.motherName} />
          <DetailField label="Date of Birth" value={applicationDetails.dateOfBirth} />
          <DetailField label="Gender" value={applicationDetails.gender} />
          <DetailField label="Mobile Number" value={applicationDetails.mobileNumber} />
          <DetailField label="Email" value={applicationDetails.email} />
          <DetailField label="EPIC Number" value={applicationDetails.epicNumber} />
        </dl>
      </DetailSection>

      {/* Address Information */}
      <DetailSection title="Address Information" icon="🏠">
        <dl className="divide-y divide-gray-100">
          <DetailField label="House Number" value={applicationDetails.houseNumber} />
          <DetailField label="Street" value={applicationDetails.street} />
          <DetailField label="Locality" value={applicationDetails.locality} />
          <DetailField label="Town/City" value={applicationDetails.town} />
          <DetailField label="District" value={applicationDetails.district} />
          <DetailField label="State" value={applicationDetails.state} />
          <DetailField label="PIN Code" value={applicationDetails.pinCode} />
        </dl>
      </DetailSection>

      {/* Application Information */}
      <DetailSection title="Application Information" icon="📝">
        <dl className="divide-y divide-gray-100">
          <DetailField label="Form Type" value={applicationDetails.formType} />
          <DetailField label="Application Number" value={applicationDetails.applicationNumber} />
          <DetailField label="Submitted Date" value={applicationDetails.submittedDate ? new Date(applicationDetails.submittedDate).toLocaleDateString() : '-'} />
          <DetailField label="Assembly Constituency" value={applicationDetails.assemblyConstituencyName} />
          <DetailField label="Polling Station" value={applicationDetails.pollingStationName} />
        </dl>
      </DetailSection>

      {/* Form 8 Specific Information */}
      {applicationDetails.formType === 'FORM8' && applicationDetails.correctionField && (
        <DetailSection title="Correction Details" icon="✏️">
          <dl className="divide-y divide-gray-100">
            <DetailField label="Field to Correct" value={applicationDetails.correctionField} />
            <DetailField label="Current Value" value={applicationDetails.currentValue} />
            <DetailField label="New Value" value={applicationDetails.newValue} />
            <DetailField label="Reason" value={applicationDetails.reason} />
          </dl>
        </DetailSection>
      )}
    </div>
  );
}