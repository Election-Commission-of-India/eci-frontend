import { useState, useEffect } from 'react';
import { getComplaints, getComplaintDetails, assignComplaintToBlo } from '../services/eroApis';
import { toast } from 'react-toastify';
import LoadingSmall from '../../components/SmallLoading';

export default function EroComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [filters, setFilters] = useState({
    constituencyId: '',
    status: ''
  });
  const [assignmentModal, setAssignmentModal] = useState({
    show: false,
    complaintId: null,
    bloId: '',
    remarks: ''
  });

  const complaintStatuses = ['SUBMITTED', 'ASSIGNED_TO_BLO', 'UNDER_INVESTIGATION', 'RESOLVED', 'CLOSED'];

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const fetchComplaints = async () => {
    if (!filters.constituencyId) {
      toast.error('Please enter constituency ID');
      return;
    }

    try {
      setLoading(true);
      const data = await getComplaints(filters.constituencyId, filters.status || null);
      setComplaints(data);
      if (data.length === 0) {
        toast.info('No complaints found for the selected filters');
      }
    } catch (error) {
      toast.error('Failed to fetch complaints');
      console.error('Complaints error:', error);
    } finally {
      setLoading(false);
    }
  };

  const viewComplaintDetails = async (complaintId) => {
    try {
      setDetailsLoading(true);
      const data = await getComplaintDetails(complaintId);
      setSelectedComplaint(data);
    } catch (error) {
      toast.error('Failed to load complaint details');
      console.error('Complaint details error:', error);
    } finally {
      setDetailsLoading(false);
    }
  };

  const openAssignmentModal = (complaintId) => {
    setAssignmentModal({
      show: true,
      complaintId,
      bloId: '',
      remarks: ''
    });
  };

  const closeAssignmentModal = () => {
    setAssignmentModal({
      show: false,
      complaintId: null,
      bloId: '',
      remarks: ''
    });
  };

  const handleAssignToBlo = async () => {
    if (!assignmentModal.bloId) {
      toast.error('Please enter BLO ID');
      return;
    }

    try {
      await assignComplaintToBlo(assignmentModal.complaintId, {
        bloId: assignmentModal.bloId,
        remarks: assignmentModal.remarks
      });
      toast.success('Complaint assigned to BLO successfully');
      closeAssignmentModal();
      fetchComplaints(); // Refresh the list
    } catch (error) {
      toast.error('Failed to assign complaint to BLO');
      console.error('Assignment error:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white border rounded-md p-4 shadow-sm mb-6">
        <h1 className="text-xl font-semibold text-gray-800">Complaints Management</h1>
        <p className="text-sm text-gray-600">View and manage citizen complaints</p>
      </div>

      {/* Filters Section */}
      <div className="bg-white border rounded-md p-4 shadow-sm mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Filters</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Constituency ID <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="constituencyId"
              value={filters.constituencyId}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter constituency ID"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              {complaintStatuses.map(status => (
                <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={fetchComplaints}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Load Complaints
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Complaints List */}
        <div className="bg-white border rounded-md shadow-sm">
          <div className="bg-blue-100 text-blue-900 px-4 py-2 font-medium rounded-t-md">
            Complaints ({complaints.length})
          </div>

          {loading ? (
            <div className="flex justify-center items-center p-8">
              <LoadingSmall size="lg" />
            </div>
          ) : complaints.length === 0 ? (
            <div className="text-center p-8 text-gray-500">
              No complaints found. Use filters to search for complaints.
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {complaints.map((complaint) => (
                <div key={complaint.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">#{complaint.id}</h4>
                      <p className="text-sm text-gray-600 mt-1">{complaint.subject}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          complaint.status === 'RESOLVED' ? 'bg-green-100 text-green-800' :
                          complaint.status === 'ASSIGNED_TO_BLO' ? 'bg-blue-100 text-blue-800' :
                          complaint.status === 'UNDER_INVESTIGATION' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {complaint.status?.replace(/_/g, ' ')}
                        </span>
                        <span className="text-xs text-gray-500">
                          {complaint.submissionDate ? new Date(complaint.submissionDate).toLocaleDateString() : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => viewComplaintDetails(complaint.id)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View Details
                    </button>
                    {complaint.status === 'SUBMITTED' && (
                      <button
                        onClick={() => openAssignmentModal(complaint.id)}
                        className="text-green-600 hover:text-green-800 text-sm font-medium"
                      >
                        Assign to BLO
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Complaint Details */}
        <div className="bg-white border rounded-md shadow-sm">
          <div className="bg-blue-100 text-blue-900 px-4 py-2 font-medium rounded-t-md">
            Complaint Details
          </div>

          {detailsLoading ? (
            <div className="flex justify-center items-center p-8">
              <LoadingSmall size="lg" />
            </div>
          ) : selectedComplaint ? (
            <div className="p-4 space-y-4">
              <div>
                <h4 className="font-medium text-gray-900">Complaint #{selectedComplaint.id}</h4>
                <p className="text-sm text-gray-600">{selectedComplaint.subject}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <p className="text-sm text-gray-900 mt-1">{selectedComplaint.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${
                    selectedComplaint.status === 'RESOLVED' ? 'bg-green-100 text-green-800' :
                    selectedComplaint.status === 'ASSIGNED_TO_BLO' ? 'bg-blue-100 text-blue-800' :
                    selectedComplaint.status === 'UNDER_INVESTIGATION' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedComplaint.status?.replace(/_/g, ' ')}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Priority</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedComplaint.priority || 'N/A'}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Complainant Details</label>
                <div className="text-sm text-gray-900 mt-1">
                  <p>Name: {selectedComplaint.complainantName}</p>
                  <p>Mobile: {selectedComplaint.complainantMobile}</p>
                  <p>Email: {selectedComplaint.complainantEmail}</p>
                </div>
              </div>

              {selectedComplaint.assignedBloName && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Assigned BLO</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedComplaint.assignedBloName}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">Submission Date</label>
                <p className="text-sm text-gray-900 mt-1">
                  {selectedComplaint.submissionDate ? new Date(selectedComplaint.submissionDate).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center p-8 text-gray-500">
              Select a complaint to view details
            </div>
          )}
        </div>
      </div>

      {/* Assignment Modal */}
      {assignmentModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Assign Complaint to BLO</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  BLO ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={assignmentModal.bloId}
                  onChange={(e) => setAssignmentModal({...assignmentModal, bloId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter BLO ID"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Remarks
                </label>
                <textarea
                  value={assignmentModal.remarks}
                  onChange={(e) => setAssignmentModal({...assignmentModal, remarks: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter assignment remarks (optional)"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAssignToBlo}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              >
                Assign
              </button>
              <button
                onClick={closeAssignmentModal}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}