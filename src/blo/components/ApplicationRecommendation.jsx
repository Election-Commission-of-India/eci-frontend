import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getApplicationDetails, recommendApplication } from '../services/bloService';
import { toast } from 'react-toastify';
import LoadingSmall from '../../components/SmallLoading';

export default function ApplicationRecommendation() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [applicationDetails, setApplicationDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [recommendation, setRecommendation] = useState({
    applicationId: parseInt(applicationId),
    recommendation: '', // 'APPROVE' or 'REJECT'
    remarks: ''
  });

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

  const handleRecommendationChange = (value) => {
    setRecommendation(prev => ({
      ...prev,
      recommendation: value
    }));
  };

  const handleRemarksChange = (e) => {
    setRecommendation(prev => ({
      ...prev,
      remarks: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!recommendation.recommendation) {
      toast.error('Please select a recommendation');
      return;
    }
    
    if (!recommendation.remarks.trim()) {
      toast.error('Please provide remarks for your recommendation');
      return;
    }

    try {
      setSubmitting(true);
      await recommendApplication(recommendation);
      toast.success(`Application ${recommendation.recommendation.toLowerCase()}d successfully`);
      navigate('/blo/applications');
    } catch (error) {
      toast.error('Failed to submit recommendation');
      console.error('Recommendation error:', error);
      if (error.response?.status === 401) {
        navigate('/blo/login');
      }
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

  if (!applicationDetails) {
    return (
      <div className="text-center p-8">
        <span className="text-4xl mb-4 block">📄</span>
        <p className="text-gray-500">Application details not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border rounded-md p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-800 flex items-center">
              <span className="mr-2">✅</span>
              Application Recommendation
            </h1>
            <p className="text-sm text-gray-600">
              Provide recommendation for Application #{applicationDetails.applicationNumber}
            </p>
          </div>
          <button
            onClick={() => navigate('/blo/applications')}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center transition-colors"
          >
            <span className="mr-2">←</span>
            Back
          </button>
        </div>
      </div>

      {/* Application Summary */}
      <div className="bg-white border rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">📋</span>
          Application Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Applicant Name</p>
            <p className="font-medium text-gray-900">{applicationDetails.fullName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Form Type</p>
            <p className="font-medium text-gray-900">{applicationDetails.formType}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">EPIC Number</p>
            <p className="font-medium text-gray-900">{applicationDetails.epicNumber || 'New Registration'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Current Status</p>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              applicationDetails.applicationStatus === 'APPROVED' ? 'bg-green-100 text-green-800' :
              applicationDetails.applicationStatus === 'REJECTED' ? 'bg-red-100 text-red-800' :
              applicationDetails.applicationStatus === 'PENDING_FIELD_VERIFICATION' ? 'bg-yellow-100 text-yellow-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {applicationDetails.applicationStatus?.replace(/_/g, ' ')}
            </span>
          </div>
        </div>
      </div>

      {/* Recommendation Form */}
      <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
          <span className="mr-2">📝</span>
          BLO Recommendation
        </h3>

        {/* Recommendation Options */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Recommendation *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                recommendation.recommendation === 'APPROVE'
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-green-300'
              }`}
              onClick={() => handleRecommendationChange('APPROVE')}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  name="recommendation"
                  value="APPROVE"
                  checked={recommendation.recommendation === 'APPROVE'}
                  onChange={() => handleRecommendationChange('APPROVE')}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                />
                <div className="ml-3">
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">✅</span>
                    <span className="text-lg font-medium text-gray-900">Approve</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Recommend this application for approval
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                recommendation.recommendation === 'REJECT'
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-200 hover:border-red-300'
              }`}
              onClick={() => handleRecommendationChange('REJECT')}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  name="recommendation"
                  value="REJECT"
                  checked={recommendation.recommendation === 'REJECT'}
                  onChange={() => handleRecommendationChange('REJECT')}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                />
                <div className="ml-3">
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">❌</span>
                    <span className="text-lg font-medium text-gray-900">Reject</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Recommend this application for rejection
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Remarks */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Remarks *
          </label>
          <textarea
            value={recommendation.remarks}
            onChange={handleRemarksChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={`Please provide detailed remarks for your ${recommendation.recommendation?.toLowerCase() || 'recommendation'}...`}
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Provide clear reasoning for your recommendation. This will be visible to ERO.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={submitting || !recommendation.recommendation || !recommendation.remarks.trim()}
            className={`flex-1 flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-colors ${
              recommendation.recommendation === 'APPROVE'
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : recommendation.recommendation === 'REJECT'
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {submitting ? (
              <>
                <LoadingSmall size="sm" />
                <span className="ml-2">Submitting...</span>
              </>
            ) : (
              <>
                <span className="mr-2">
                  {recommendation.recommendation === 'APPROVE' ? '✅' : 
                   recommendation.recommendation === 'REJECT' ? '❌' : '📤'}
                </span>
                Submit Recommendation
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={() => navigate(`/blo/applications/${applicationId}/details`)}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Review Details
          </button>
        </div>
      </form>

      {/* Guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
          <span className="mr-2">💡</span>
          Recommendation Guidelines
        </h4>
        <ul className="text-sm text-blue-800 space-y-2">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            Verify all documents are authentic and match the application details
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            Ensure the applicant meets all eligibility criteria
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            Check for any duplicate registrations or conflicting information
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            Provide clear and detailed remarks to support your recommendation
          </li>
        </ul>
      </div>
    </div>
  );
}