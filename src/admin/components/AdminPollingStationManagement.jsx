import { useState, useEffect } from 'react';
import {
  createPollingStation,
  updatePollingStation,
  assignPollingStationToConstituency,
  checkPollingStationAssignment,
  getDistricts
} from '../services/adminApis';
import { toast } from 'react-toastify';

export default function AdminPollingStationManagement() {
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [editingStation, setEditingStation] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    address: '',
    latitude: '',
    longitude: '',
    facilities: '',
    constituencyId: '',
    active: true
  });

  const [assignmentData, setAssignmentData] = useState({
    stationId: '',
    constituencyId: ''
  });

  useEffect(() => {
    fetchDistricts();
  }, []);

  const fetchDistricts = async () => {
    try {
      const response = await getDistricts();
      setDistricts(response || []);
    } catch (error) {
      console.error('Error fetching districts:', error);
      toast.error('Failed to fetch districts');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (editingStation) {
        response = await updatePollingStation(editingStation.id, formData);
      } else {
        response = await createPollingStation(formData);
      }

      if (response.success) {
        toast.success(response.message);
        setShowCreateModal(false);
        setEditingStation(null);
        resetForm();
      } else {
        toast.error(response.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Error saving polling station:', error);
      toast.error('Failed to save polling station');
    }
  };

  const handleAssignment = async (e) => {
    e.preventDefault();
    try {
      const response = await assignPollingStationToConstituency(
        assignmentData.stationId,
        assignmentData.constituencyId
      );

      if (response.success) {
        toast.success(response.message);
        setShowAssignModal(false);
        setAssignmentData({ stationId: '', constituencyId: '' });
      } else {
        toast.error(response.message || 'Assignment failed');
      }
    } catch (error) {
      console.error('Error assigning polling station:', error);
      toast.error('Failed to assign polling station');
    }
  };

  const handleCheckAssignment = async (stationId) => {
    try {
      const response = await checkPollingStationAssignment(stationId);
      if (response.success) {
        toast.info(response.message);
      } else {
        toast.error(response.message || 'Failed to check assignment');
      }
    } catch (error) {
      console.error('Error checking assignment:', error);
      toast.error('Failed to check assignment');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      address: '',
      latitude: '',
      longitude: '',
      facilities: '',
      constituencyId: '',
      active: true
    });
  };

  const openCreateModal = () => {
    setEditingStation(null);
    resetForm();
    setShowCreateModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Polling Station Management</h1>
          <p className="text-gray-600">Manage polling stations and their constituency assignments</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAssignModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Assign Station
          </button>
          <button
            onClick={openCreateModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Station
          </button>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <span className="text-blue-600 text-xl mr-3">🗳️</span>
            <div>
              <h3 className="text-sm font-medium text-blue-800">Polling Station Creation</h3>
              <p className="text-sm text-blue-700 mt-1">
                Create polling stations with location details and facilities information.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <span className="text-green-600 text-xl mr-3">🏛️</span>
            <div>
              <h3 className="text-sm font-medium text-green-800">Constituency Assignment</h3>
              <p className="text-sm text-green-700 mt-1">
                Assign polling stations to specific constituencies for election management.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="text-2xl mb-2">📍</div>
            <div className="font-medium text-gray-900">Check Assignment</div>
            <div className="text-sm text-gray-600 mb-3">Verify polling station assignments</div>
            <input
              type="number"
              placeholder="Station ID"
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm mb-2"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.target.value) {
                  handleCheckAssignment(e.target.value);
                  e.target.value = '';
                }
              }}
            />
            <button
              onClick={() => {
                const input = document.querySelector('input[placeholder="Station ID"]');
                if (input.value) {
                  handleCheckAssignment(input.value);
                  input.value = '';
                }
              }}
              className="w-full bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
            >
              Check
            </button>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="text-2xl mb-2">📊</div>
            <div className="font-medium text-gray-900">Station Statistics</div>
            <div className="text-sm text-gray-600 mb-3">View polling station metrics</div>
            <div className="text-xs text-gray-500">
              Total Districts: {districts.length}
            </div>
          </div>

          {/* <div className="border border-gray-200 rounded-lg p-4">
            <div className="text-2xl mb-2">🔧</div>
            <div className="font-medium text-gray-900">Bulk Operations</div>
            <div className="text-sm text-gray-600 mb-3">Manage multiple stations</div>
            <button className="w-full bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700">
              Coming Soon
            </button>
          </div> */}
        </div>
      </div>

      {/* Sample Stations Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Polling Stations</h2>
        </div>
        <div className="p-6 text-center text-gray-500">
          <div className="text-4xl mb-4">🗳️</div>
          <p>Polling station list will appear here after API integration</p>
          <p className="text-sm mt-2">Use the "Create Station" button to add new polling stations</p>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {editingStation ? 'Edit Polling Station' : 'Create New Polling Station'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Station Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter station name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Station Code *
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter station code"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  required
                  rows={2}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter station address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) => setFormData(prev => ({ ...prev, latitude: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter latitude"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) => setFormData(prev => ({ ...prev, longitude: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter longitude"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Constituency
                </label>
                <input
                  type="number"
                  value={formData.constituencyId}
                  onChange={(e) => setFormData(prev => ({ ...prev, constituencyId: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter constituency ID (optional)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Facilities
                </label>
                <textarea
                  value={formData.facilities}
                  onChange={(e) => setFormData(prev => ({ ...prev, facilities: e.target.value }))}
                  rows={2}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter available facilities"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                  className="mr-2"
                />
                <label htmlFor="active" className="text-sm text-gray-700">
                  Active Station
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingStation(null);
                    resetForm();
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingStation ? 'Update' : 'Create'} Station
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assignment Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Assign Polling Station to Constituency
            </h2>
            <form onSubmit={handleAssignment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Station ID *
                </label>
                <input
                  type="number"
                  value={assignmentData.stationId}
                  onChange={(e) => setAssignmentData(prev => ({ ...prev, stationId: e.target.value }))}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter polling station ID"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Constituency ID *
                </label>
                <input
                  type="number"
                  value={assignmentData.constituencyId}
                  onChange={(e) => setAssignmentData(prev => ({ ...prev, constituencyId: e.target.value }))}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter constituency ID"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAssignModal(false);
                    setAssignmentData({ stationId: '', constituencyId: '' });
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Assign Station
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}