import { useState, useEffect } from 'react';
import { createConstituency, updateConstituency, toggleConstituencyStatus, getDistricts } from '../services/adminApis';
import { toast } from 'react-toastify';

export default function AdminConstituencyManagement() {
  const [constituencies, setConstituencies] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingConstituency, setEditingConstituency] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    districtId: null,
    description: '',
    isActive: true
  });

  useEffect(() => {
    fetchDistricts();
  }, []);

  const fetchDistricts = async () => {
    try {
      const response = await getDistricts();
      console.log('Districts response:', response); // Debug log
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
      if (editingConstituency) {
        response = await updateConstituency(editingConstituency.id, formData);
      } else {
        response = await createConstituency(formData);
      }

      if (response.success) {
        toast.success(response.message);
        setShowCreateModal(false);
        setEditingConstituency(null);
        resetForm();
        // In a real app, you'd fetch constituencies here
      } else {
        toast.error(response.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Error saving constituency:', error);
      toast.error('Failed to save constituency');
    }
  };

  const handleToggleStatus = async (constituencyId) => {
    try {
      const response = await toggleConstituencyStatus(constituencyId);
      if (response.success) {
        toast.success(response.message);
        // In a real app, you'd refresh the list here
      } else {
        toast.error(response.message || 'Failed to toggle status');
      }
    } catch (error) {
      console.error('Error toggling constituency status:', error);
      toast.error('Failed to toggle constituency status');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      districtId: null,
      description: '',
      isActive: true
    });
  };

  const openEditModal = (constituency) => {
    setEditingConstituency(constituency);
    setFormData({
      name: constituency.name || '',
      code: constituency.code || '',
      districtId: constituency.districtId || '',
      description: constituency.description || '',
      isActive: constituency.isActive !== false
    });
    setShowCreateModal(true);
  };

  const openCreateModal = () => {
    setEditingConstituency(null);
    resetForm();
    setShowCreateModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Constituency Management</h1>
          <p className="text-gray-600">Manage assembly constituencies and their districts</p>
        </div>
        {/* <button
          onClick={openCreateModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create Constituency
        </button> */}
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center">
          <span className="text-blue-600 text-xl mr-3">ℹ️</span>
          <div>
            <h3 className="text-sm font-medium text-blue-800">Constituency Management</h3>
            <p className="text-sm text-blue-700 mt-1">
              Create and manage assembly constituencies. Each constituency must be assigned to a district.
              Available districts: {districts.length}
            </p>
          </div>
        </div>
      </div>

      {/* Districts Overview */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Districts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {districts.map((district) => (
            <div key={district.districtId} className="border border-gray-200 rounded-lg p-3">
              <div className="font-medium text-gray-900">{district.districtName}</div>
              <div className="text-sm text-gray-600">Code: {district.districtCode}</div>
              <div className="text-sm text-gray-600">State: {district.stateName} ({district.stateCode})</div>
            </div>
          ))}
        </div>
      </div>

      {/* Sample Constituencies Table (In real app, this would fetch from API) */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Constituencies</h2>
        </div>
        <div className="p-6 text-center text-gray-500">
          <div className="text-4xl mb-4">🏛️</div>
          <p>Constituency list will appear here after API integration</p>
          <p className="text-sm mt-2">Use the "Create Constituency" button to add new constituencies</p>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {editingConstituency ? 'Edit Constituency' : 'Create New Constituency'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Constituency Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter constituency name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Constituency Code *
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter constituency code"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  District * ({districts.length} available)
                </label>
                <select
                  value={formData.districtId || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    console.log('Selected district ID:', value); // Debug log
                    setFormData(prev => ({
                      ...prev,
                      districtId: value ? parseInt(value) : null
                    }));
                  }}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select District</option>
                  {districts.length > 0 ? (
                    districts.map((district) => (
                      <option key={district.districtId} value={district.districtId}>
                        {district.districtName} - {district.stateName}
                      </option>
                    ))
                  ) : (
                    <option disabled>No districts available</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter constituency description"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="mr-2"
                />
                <label htmlFor="isActive" className="text-sm text-gray-700">
                  Active Constituency
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingConstituency(null);
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
                  {editingConstituency ? 'Update' : 'Create'} Constituency
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}