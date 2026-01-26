import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getApplicationWithBlo } from '../services/eroApis';
import { toast } from 'react-toastify';
import LoadingSmall from '../../components/SmallLoading';

export default function EroApplicationDetails() {
  const { applicationId } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplicationDetails();
  }, [applicationId]);

  const fetchApplicationDetails = async () => {
    try {
      setLoading(true);
      const data = await getApplicationWithBlo(applicationId);
      setApplication(data);
    } catch (error) {
      toast.error('Failed to load application details');
      console.error('Application details error:', error);
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

  if (!application) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">Application Not Found</h2>
          <button
            onClick={() => navigate('/ero/applications')}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Back to Applications
          </button>
        </div>
      </div>
    );
  }

  const InfoCard = ({ title, children }) => (
    <div className="bg-white border rounded-md shadow-sm">
      <div className="bg-blue-100 text-blue-900 px-4 py-2 font-medium rounded-t-md">
        {title}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );

  const InfoRow = ({ label, value }) => (
    <div className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
      <span className="font-medium text-gray-700">{label}:</span>
      <span className="text-gray-900">{value || 'N/A'}</span>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Application Details</h1>
          <p className="text-sm text-gray-600">Application ID: {applicationId}</p>
        </div>
        <button
          onClick={() => navigate('/ero/applications')}
          className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
        >
          Back to Applications
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application Information */}
        <InfoCard title="Application Information">
          <InfoRow label="Form Type" value={application.formType} />
          <InfoRow label="Status" value={application.applicationStatus} />
          <InfoRow label="Submission Date" value={
            application.submissionDate ? new Date(application.submissionDate).toLocaleDateString() : 'N/A'
          } />
          <InfoRow label="Constituency ID" value={application.constituencyId} />
        </InfoCard>

        {/* Applicant Details */}
        <InfoCard title="Applicant Details">
          <InfoRow label="Full Name" value={application.fullName} />
          <InfoRow label="First Name" value={application.firstName} />
          <InfoRow label="Last Name" value={application.lastName} />
          <InfoRow label="Date of Birth" value={
            application.dateOfBirth ? new Date(application.dateOfBirth).toLocaleDateString() : 'N/A'
          } />
          <InfoRow label="Gender" value={application.gender} />
          <InfoRow label="Mobile" value={application.mobile} />
          <InfoRow label="Email" value={application.email} />
        </InfoCard>

        {/* Address Information */}
        <InfoCard title="Address Information">
          <InfoRow label="House Number" value={application.houseNumber} />
          <InfoRow label="Street" value={application.street} />
          <InfoRow label="Locality" value={application.locality} />
          <InfoRow label="Town/City" value={application.townCity} />
          <InfoRow label="District" value={application.district} />
          <InfoRow label="State" value={application.state} />
          <InfoRow label="PIN Code" value={application.pinCode} />
        </InfoCard>

        {/* BLO Review Information */}
        {application.bloRecommendation && (
          <InfoCard title="BLO Review">
            <InfoRow label="BLO Name" value={application.bloName} />
            <InfoRow label="BLO ID" value={application.bloId} />
            <InfoRow label="Recommendation" value={application.bloRecommendation} />
            <InfoRow label="BLO Remarks" value={application.bloRemarks} />
            <InfoRow label="Review Date" value={
              application.bloReviewDate ? new Date(application.bloReviewDate).toLocaleDateString() : 'N/A'
            } />
          </InfoCard>
        )}

        {/* Additional Information for Form 8 */}
        {application.formType === 'FORM8' && (
          <InfoCard title="Correction Details">
            <InfoRow label="EPIC Number" value={application.epicNumber} />
            <InfoRow label="Field to Correct" value={application.fieldToCorrect} />
            <InfoRow label="Current Value" value={application.currentValue} />
            <InfoRow label="New Value" value={application.newValue} />
            <InfoRow label="Reason" value={application.reason} />
          </InfoCard>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex gap-4">
        <button
          onClick={() => navigate(`/ero/documents/application/${applicationId}`)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          View Documents
        </button>
        
        {application.applicationStatus === 'SUBMITTED' && (
          <button
            onClick={() => {
              // Handle application approval/rejection logic
              toast.info('Application review functionality to be implemented');
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Review Application
          </button>
        )}
      </div>
    </div>
  );
}