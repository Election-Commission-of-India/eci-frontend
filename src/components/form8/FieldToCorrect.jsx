import { useDispatch, useSelector } from 'react-redux';
import { updateField } from '../../store/slices/form8slice';
import FormSectionCard from '../form6/FormSectionCard';
import { useEffect } from 'react';

function FieldToCorrect() {
  const dispatch = useDispatch();
  const form8Data = useSelector((state) => state.form8);

  // Auto-set old value when field is selected
  useEffect(() => {
    if (form8Data.fieldToCorrect && form8Data.voterDetails) {
      let oldVal = '';
      
      switch (form8Data.fieldToCorrect) {
        case 'FULL_NAME':
          oldVal = form8Data.voterDetails.voterName;
          break;
        case 'DOB':
          oldVal = form8Data.voterDetails.dob;
          break;
        case 'GENDER':
          oldVal = form8Data.voterDetails.gender;
          break;
        case 'ADDRESS':
          oldVal = form8Data.voterDetails.houseNumber;
          break;
        case 'RELATIVE_NAME':
          oldVal = form8Data.voterDetails.relativeName;
          break;
        default:
          oldVal = '';
      }
      
      dispatch(updateField({ fieldName: 'oldValue', value: oldVal }));
    }
  }, [form8Data.fieldToCorrect, form8Data.voterDetails, dispatch]);

  const handleFieldChange = (e) => {
    dispatch(updateField({ fieldName: 'fieldToCorrect', value: e.target.value }));
    dispatch(updateField({ fieldName: 'newValue', value: '' })); // Reset new value
  };

  const handleNewValueChange = (value) => {
    dispatch(updateField({ fieldName: 'newValue', value }));
  };

  const renderNewValueInput = () => {
    switch (form8Data.fieldToCorrect) {
      case 'FULL_NAME':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="input"
              placeholder="Enter corrected full name"
              value={form8Data.newValue}
              onChange={(e) => handleNewValueChange(e.target.value)}
              required
            />
          </div>
        );

      case 'DOB':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Date of Birth <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              className="input"
              value={form8Data.newValue}
              onChange={(e) => handleNewValueChange(e.target.value)}
              required
            />
          </div>
        );

      case 'GENDER':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Gender <span className="text-red-500">*</span>
            </label>
            <select
              className="input"
              value={form8Data.newValue}
              onChange={(e) => handleNewValueChange(e.target.value)}
              required
            >
              <option value="">Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        );

      case 'ADDRESS':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Address <span className="text-red-500">*</span>
            </label>
            <textarea
              className="input"
              rows="3"
              placeholder="Enter corrected address"
              value={form8Data.newValue}
              onChange={(e) => handleNewValueChange(e.target.value)}
              required
            />
          </div>
        );

      case 'RELATIVE_NAME':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Relative Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="input"
              placeholder="Enter corrected relative name"
              value={form8Data.newValue}
              onChange={(e) => handleNewValueChange(e.target.value)}
              required
            />
          </div>
        );

      default:
        return null;
    }
  };

  // Don't show this section until voter details are fetched
  if (!form8Data.voterDetails) {
    return null;
  }

  return (
    <FormSectionCard title="Select Field for Correction">
      <div className="border rounded p-4 bg-gray-50 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Field to Correct <span className="text-red-500">*</span>
          </label>
          <select
            className="input"
            value={form8Data.fieldToCorrect}
            onChange={handleFieldChange}
            required
          >
            <option value="">-- Select Field to Correct --</option>
            <option value="FULL_NAME">Full Name</option>
            <option value="DOB">Date of Birth</option>
            <option value="GENDER">Gender</option>
            <option value="ADDRESS">Address</option>
            <option value="RELATIVE_NAME">Relative Name</option>
          </select>
        </div>

        {/* Show Current Value */}
        {form8Data.fieldToCorrect && form8Data.oldValue && (
          <div className="bg-yellow-50 border border-yellow-300 rounded p-3">
            <p className="text-sm font-semibold text-yellow-800 mb-1">Current Value:</p>
            <p className="text-yellow-900 font-medium">{form8Data.oldValue}</p>
          </div>
        )}

        {/* Show new value input based on selected field */}
        {form8Data.fieldToCorrect && renderNewValueInput()}
      </div>
    </FormSectionCard>
  );
}

export default FieldToCorrect;
