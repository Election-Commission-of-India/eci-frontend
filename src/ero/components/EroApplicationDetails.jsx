import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getApplicationWithBlo, generateEpic } from '../services/eroApis';
import { toast } from 'react-toastify';
import LoadingSmall from '../../components/SmallLoading';

export default function EroApplicationDetails() {
  const { applicationId } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [epicGenerating, setEpicGenerating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplicationDetails();
  }, [applicationId]);
  const normalizeApplication = (data) => ({
    ...data,

    // dates
    submissionDate: data.submissionDate || data.submitted_date,
    dateOfBirth: data.dateOfBirth || data.dob,

    // ids
    constituencyId: data.constituencyId || data.assembly_id || data.assemblyId,

    // applicant name fallback
    fullName: data.fullName || data.applicantName,

    // BLO fields
    bloId: data.bloId || data.assigned_blo,
    bloName: data.bloName || data.assignedBloName,
  });

  const fetchApplicationDetails = async () => {
    try {
      setLoading(true);
      const rawData = await getApplicationWithBlo(applicationId);
      const normalizedData = normalizeApplication(rawData);

      console.log('RAW API DATA:', rawData);
      console.log('NORMALIZED DATA:', normalizedData);

      setApplication(normalizedData);

    } catch (error) {
      toast.error('Failed to load application details');
      console.error('Application details error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateEpic = async () => {
    try {
      setEpicGenerating(true);
      const response = await generateEpic(applicationId);

      toast.success(`EPIC Generated Successfully! EPIC Number: ${response.epicNumber}`);

      // Update application state with new EPIC number
      setApplication(prev => ({
        ...prev,
        epicNumber: response.epicNumber,
        applicationStatus: 'EPIC_GENERATED'
      }));

    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to generate EPIC';
      toast.error(errorMessage);
    } finally {
      setEpicGenerating(false);
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
          <InfoRow label="EPIC Number" value={application.epicNumber || 'Not Generated'} />
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

        {/* EPIC Generation Button */}
        {application.applicationStatus === 'APPROVED' && !application.epicNumber && (
          <button
            onClick={handleGenerateEpic}
            disabled={epicGenerating}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {epicGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Generating EPIC...
              </>
            ) : (
              'Generate EPIC'
            )}
          </button>
        )}

        {/* EPIC Generated Status */}
        {application.epicNumber && (
          <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-md">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            ✔ EPIC Generated: {application.epicNumber}
          </div>
        )}

        {application.applicationStatus === 'SUBMITTED' && (
          <button
            onClick={() => {
              toast.info('Application review functionality to be implemented');
            }}
            className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700"
          >
            Review Application
          </button>
        )}
      </div>
    </div>
  );
}