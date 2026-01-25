import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { applicationAPI } from '../../services/applicationApis';
import { resetForm } from '../../store/slices/form8slice';
import { toast } from 'react-toastify';
import LoadingSmall from '../SmallLoading';

function SubmitSection() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const form8Data = useSelector((state) => state.form8);
  const [loading, setLoading] = useState(false);

  // Don't show until voter details are fetched
  if (!form8Data.voterDetails) {
    return null;
  }

  const handleSubmit = async () => {
    // Comprehensive Validation
    if (!form8Data.relatedEpicNumber) {
      toast.error('Please enter EPIC number');
      return;
    }

    if (!form8Data.voterDetails) {
      toast.error('Please fetch voter details first');
      return;
    }

    if (!form8Data.fieldToCorrect) {
      toast.error('Please select field to correct');
      return;
    }

    if (!form8Data.newValue || form8Data.newValue.trim() === '') {
      toast.error('Please enter new value');
      return;
    }

    // Check if new value is different from old value
    if (form8Data.newValue.trim() === form8Data.oldValue) {
      toast.error('New value must be different from current value');
      return;
    }

    if (!form8Data.assemblyConstituencyId || !form8Data.pollingStationId) {
      toast.error('Please select assembly constituency and polling station');
      return;
    }

    setLoading(true);

    try {
      const correctionData = {
        relatedEpicNumber: form8Data.relatedEpicNumber,
        fieldToCorrect: form8Data.fieldToCorrect,
        newValue: form8Data.newValue,
        assemblyConstituencyId: form8Data.assemblyConstituencyId,
        pollingStationId: form8Data.pollingStationId,
      };

      console.log('Submitting correction data:', correctionData);

      const response = await applicationAPI.submitCorrection(correctionData);

      console.log('Backend Response:', response);

      if (response.success) {
        // Handle the case where data is just an ID number
        let applicationId;
        let applicationNumber;

        if (typeof response.data === 'object' && response.data !== null) {
          // If backend returns object with both values
          applicationId = response.data.applicationId || response.data.id;
          applicationNumber = response.data.applicationNumber || response.data.number;
        } else {
          // If backend returns just the ID as a number
          applicationId = response.data;
          // Generate a temporary application number (backend should provide this)
          applicationNumber = `APP-${applicationId}`;
        }

        console.log('Application ID:', applicationId);
        console.log('Application Number:', applicationNumber);

        if (!applicationId) {
          toast.error('Error: Application ID not received from server');
          setLoading(false);
          return;
        }

        toast.success('Correction request submitted successfully!');

        // Reset form
        dispatch(resetForm());

        // Navigate to upload supporting documents
        navigate(`/form8/${applicationId}/uploaddoc`, {
          replace: true,
          state: {
            applicationId,
            applicationNumber,
            isNewSubmission: true,
          },
        });
      } else {
        throw new Error(response.message || 'Submission failed');
      }
    } catch (error) {
      console.error('Submission error:', error);
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        'Failed to submit correction request. Please try again.';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-lg p-6 bg-gradient-to-r from-green-50 to-blue-50 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">
        📋 Submit Correction Request
      </h2>

      <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
        <p className="text-sm text-gray-700 mb-2">
          <strong>Summary:</strong>
        </p>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• EPIC Number: <strong>{form8Data.relatedEpicNumber}</strong></li>
          <li>• Field to Correct: <strong>{form8Data.fieldToCorrect?.replace(/_/g, ' ')}</strong></li>
          <li>• Current Value: <strong>{form8Data.oldValue}</strong></li>
          <li>• New Value: <strong>{form8Data.newValue || 'Not entered'}</strong></li>
        </ul>
      </div>

      <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3 mb-4">
        <p className="text-xs text-yellow-800">
          ⚠️ <strong>Note:</strong> After submission, you will need to upload a supporting document (Aadhaar, Passport, etc.) to complete your correction request.
        </p>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold shadow-md transition-colors"
      >
        {loading && <LoadingSmall size="sm" />}
        {loading ? 'Submitting Correction Request...' : 'Submit Correction Request'}
      </button>

      <p className="text-xs text-gray-500 text-center mt-3">
        By submitting, you confirm that the information provided is accurate
      </p>
    </div>
  );
}

export default SubmitSection;
