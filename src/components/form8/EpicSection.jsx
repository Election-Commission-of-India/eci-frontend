import { useDispatch, useSelector } from 'react-redux';
import { updateField, setVoterDetails, setFetchingVoter, setVoterNotFound } from '../../store/slices/form8slice';
import { applicationAPI } from '../../services/applicationApis';
import { toast } from 'react-toastify';
import FormSectionCard from '../form6/FormSectionCard';
import LoadingSmall from '../SmallLoading';

function EpicSection() {
  const dispatch = useDispatch();
  const form8Data = useSelector((state) => state.form8);

  const handleFetchVoter = async () => {
    if (!form8Data.relatedEpicNumber || form8Data.relatedEpicNumber.length < 10) {
      toast.error('Please enter a valid EPIC number');
      return;
    }

    dispatch(setFetchingVoter(true));

    try {
      const response = await applicationAPI.getVoterByEpic(form8Data.relatedEpicNumber);

      if (response.success) {
        dispatch(setVoterDetails(response.data));
        toast.success('Voter details found!');
      } else {
        dispatch(setVoterNotFound());
        toast.error('Voter not found with this EPIC number');
      }
    } catch (error) {
      dispatch(setVoterNotFound());
      toast.error(error.response?.data?.message || 'Voter not found');
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-IN');
  };

  return (
    <FormSectionCard title="EPIC Number (Voter ID)">
      <div className="border rounded p-4 bg-gray-50 space-y-4">
        
        {/* EPIC Input with Fetch Button */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter EPIC Number <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <input
              className="input flex-1"
              type="text"
              placeholder="Enter EPIC Number (e.g., ABC1234567)"
              value={form8Data.relatedEpicNumber}
              onChange={(e) =>
                dispatch(
                  updateField({
                    fieldName: 'relatedEpicNumber',
                    value: e.target.value.toUpperCase(),
                  })
                )
              }
              disabled={form8Data.voterDetails !== null}
              required
            />
            
            {!form8Data.voterDetails && (
              <button
                type="button"
                onClick={handleFetchVoter}
                disabled={form8Data.fetchingVoter || !form8Data.relatedEpicNumber}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {form8Data.fetchingVoter && <LoadingSmall size="sm" />}
                {form8Data.fetchingVoter ? 'Fetching...' : 'Fetch Details'}
              </button>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Enter your existing voter ID number and click Fetch Details
          </p>
        </div>

        {/* Voter Not Found Message */}
        {form8Data.voterNotFound && (
          <div className="bg-red-50 border border-red-300 rounded p-3">
            <p className="text-red-700 text-sm font-semibold">
              ❌ Voter not found with EPIC number: {form8Data.relatedEpicNumber}
            </p>
            <p className="text-red-600 text-xs mt-1">
              Please check the EPIC number and try again
            </p>
          </div>
        )}

        {/* Display Fetched Voter Details (Read-Only) */}
        {form8Data.voterDetails && (
          <div className="bg-green-50 border border-green-300 rounded p-4 space-y-3">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-green-800">✅ Voter Details Found</h3>
              <button
                type="button"
                onClick={() => {
                  dispatch(setVoterDetails(null));
                  dispatch(updateField({ fieldName: 'relatedEpicNumber', value: '' }));
                }}
                className="text-xs text-red-600 hover:text-red-800 underline"
              >
                Change EPIC
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <ReadOnlyField label="EPIC Number" value={form8Data.voterDetails.epicNumber} />
              <ReadOnlyField label="Voter Name" value={form8Data.voterDetails.voterName} />
              <ReadOnlyField label="Relative Name" value={form8Data.voterDetails.relativeName} />
              <ReadOnlyField 
                label="Relation" 
                value={form8Data.voterDetails.relationType?.replace(/_/g, ' ')} 
              />
              <ReadOnlyField label="House Number" value={form8Data.voterDetails.houseNumber} />
              <ReadOnlyField 
                label="Date of Birth" 
                value={formatDate(form8Data.voterDetails.dob)} 
              />
              <ReadOnlyField 
                label="Gender" 
                value={form8Data.voterDetails.gender} 
              />
              <ReadOnlyField 
                label="Part/Serial" 
                value={`${form8Data.voterDetails.partNumber} / ${form8Data.voterDetails.serialNumber}`} 
              />
            </div>

            <div className="pt-2 border-t">
              <ReadOnlyField 
                label="Assembly Constituency" 
                value={form8Data.voterDetails.assemblyConstituencyName} 
              />
              <ReadOnlyField 
                label="Polling Station" 
                value={form8Data.voterDetails.pollingStationName} 
                className="mt-2"
              />
            </div>
          </div>
        )}
      </div>
    </FormSectionCard>
  );
}

// Read-Only Field Component
function ReadOnlyField({ label, value, className = "" }) {
  return (
    <div className={className}>
      <p className="text-xs text-gray-600">{label}</p>
      <p className="font-semibold text-gray-800">{value || 'N/A'}</p>
    </div>
  );
}

export default EpicSection;
