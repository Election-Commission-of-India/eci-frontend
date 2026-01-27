import { useState, useEffect } from 'react';
import { getApplicationDetails, recommendApplication } from '../services/bloService';
import { toast } from 'react-toastify';
import LoadingSmall from '../../components/SmallLoading';
import { useNavigate, useParams } from 'react-router';

export default function ApplicationRecommendation() {
  const [applicationData, setApplicationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [recommendationData, setRecommendationData] = useState({
    recommendation: '',
    notes: ''
  });
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
      const data = await getApplicationDetails(applicationId);
      console.log("Application details for recommendation:", data);
      setApplicationData(data);
    } catch (error) {
      toast.error('Failed to load application details');
      console.error('Application details error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setRecommendationData({
      ...recommendationData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmitRecommendation = async () => {
    if (!recommendationData.recommendation) {
      toast.error('Please select a recommendation');
      return;
    }

    if (!recommendationData.notes.trim()) {
      toast.error('Please provide notes for your recommendation');
      return;
    }

    try {
      setSubmitting(true);
      
      const payload = {
        applicationId: parseInt(applicationId),
        recommendation: recommendationData.recommendation,
        notes: recommendationData.notes.trim()
      };

      await recommendApplication(payload);
      toast.success('Recommendation submitted successfully');
      navigate('/blo/applications');
    } catch (error) {
      toast.error('Failed to submit recommendation');
      console.error('Recommendation error:', error);
    } finally {
      setSubmitting(false);
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
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Make Recommendation</h1>
              <p className="text-sm text-gray-600">Application #{applicationData.applicationNumber}</p>
            </div>
            <button
              onClick={() => navigate(`/blo/applications/${applicationId}/details`)}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Back to Details
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Application Summary */}
        <div className="bg-white border rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Application Summary</h2>
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(applicationData.applicationStatus)}`}>
              {applicationData.applicationStatus?.replace(/_/g, ' ')}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Applicant Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="text-gray-900">{applicationData.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">EPIC Number:</span>
                  <span className="text-gray-900">{applicationData.epicNumber || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Form Type:</span>
                  <span className="text-gray-900">{applicationData.formType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date of Birth:</span>
                  <span className="text-gray-900">
                    {applicationData.dob ? new Date(applicationData.dob).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Electoral Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Constituency:</span>
                  <span className="text-gray-900">{applicationData.assemblyConstituencyName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Polling Station:</span>
                  <span className="text-gray-900">{applicationData.pollingStationName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Part Number:</span>
                  <span className="text-gray-900">{applicationData.partNumber || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Submitted:</span>
                  <span className="text-gray-900">
                    {applicationData.submittedDate ? new Date(applicationData.submittedDate).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendation Form */}
        <div className="bg-white border rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">BLO Recommendation</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Recommendation *
              </label>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="recommendation"
                    value="APPROVE"
                    checked={recommendationData.recommendation === 'APPROVE'}
                    onChange={handleInputChange}
                    className="mr-3 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm">
                    <span className="font-medium text-green-700">Approve</span> - Recommend this application for approval
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="recommendation"
                    value="REJECT"
                    checked={recommendationData.recommendation === 'REJECT'}
                    onChange={handleInputChange}
                    className="mr-3 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm">
                    <span className="font-medium text-red-700">Reject</span> - Recommend this application for rejection
                  </span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recommendation Notes *
              </label>
              <textarea
                name="notes"
                value={recommendationData.notes}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="6"
                placeholder="Provide detailed notes explaining your recommendation. Include any observations from field verification, document verification results, and other relevant factors..."
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Please provide comprehensive notes to support your recommendation decision.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t">
              <button
                onClick={handleSubmitRecommendation}
                disabled={submitting || !recommendationData.recommendation || !recommendationData.notes.trim()}
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {submitting ? (
                  <>
                    <LoadingSmall size="sm" />
                    <span className="ml-2">Submitting...</span>
                  </>
                ) : (
                  'Submit Recommendation'
                )}
              </button>
              <button
                onClick={() => navigate(`/blo/applications/${applicationId}/details`)}
                disabled={submitting}
                className="bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={() => navigate(`/blo/applications/${applicationId}/documents`)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Review Documents Again
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={() => navigate('/blo/applications')}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Back to Applications List
          </button>
        </div>
      </div>
    </div>
  );
}