import { useState } from 'react';
import { assignBloToBooth } from '../services/eroApis';
import { toast } from 'react-toastify';
import LoadingSmall from '../../components/SmallLoading';

export default function EroBloAssignment() {
  const [assignmentData, setAssignmentData] = useState({
    boothId: '',
    bloId: '',
    assemblyConstituencyId: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setAssignmentData({
      ...assignmentData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!assignmentData.boothId || !assignmentData.bloId || !assignmentData.assemblyConstituencyId) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      setLoading(true);
      await assignBloToBooth(assignmentData);
      toast.success('BLO assigned to booth successfully');
      
      // Reset form
      setAssignmentData({
        boothId: '',
        bloId: '',
        assemblyConstituencyId: ''
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to assign BLO');
      console.error('BLO assignment error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white border rounded-md p-4 shadow-sm mb-6">
        <h1 className="text-xl font-semibold text-gray-800">BLO Assignment</h1>
        <p className="text-sm text-gray-600">Assign Booth Level Officers to polling stations</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white border rounded-md shadow-sm">
          <div className="bg-blue-100 text-blue-900 px-4 py-2 font-medium rounded-t-md">
            Assign BLO to Booth
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Booth ID <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="boothId"
                value={assignmentData.boothId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter polling station/booth ID"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter the unique ID of the polling station/booth
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                BLO ID <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="bloId"
                value={assignmentData.bloId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter BLO user ID"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter the unique ID of the Booth Level Officer
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assembly Constituency ID <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="assemblyConstituencyId"
                value={assignmentData.assemblyConstituencyId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter assembly constituency ID"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter the assembly constituency ID where the booth is located
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Important Notes
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <ul className="list-disc list-inside space-y-1">
                      <li>Ensure the BLO ID corresponds to a valid Booth Level Officer</li>
                      <li>Verify the booth ID exists in the system</li>
                      <li>The assembly constituency ID must be valid and active</li>
                      <li>This assignment will override any existing BLO assignment for the booth</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? <LoadingSmall size="sm" /> : 'Assign BLO'}
              </button>
              
              <button
                type="button"
                onClick={() => setAssignmentData({ boothId: '', bloId: '', assemblyConstituencyId: '' })}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Clear
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}