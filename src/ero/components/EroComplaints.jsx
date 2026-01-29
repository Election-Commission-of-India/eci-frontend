import { useState } from 'react';
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

  // ✅ Backend-aligned enum values
  const complaintStatuses = [
    'REGISTERED',
    'ASSIGNED_TO_BLO',
    'IN_PROGRESS',
    'RESOLVED',
    'REJECTED'
  ];

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
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const viewComplaintDetails = async (complaintId) => {
    if (!complaintId) {
      toast.error('Invalid complaint ID');
      return;
    }

    try {
      setDetailsLoading(true);
      const data = await getComplaintDetails(complaintId);
      setSelectedComplaint(data);
    } catch (error) {
      toast.error('Failed to load complaint details');
      console.error(error);
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
      fetchComplaints();
    } catch (error) {
      toast.error('Failed to assign complaint');
      console.error(error);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'RESOLVED':
        return 'bg-green-100 text-green-800';
      case 'ASSIGNED_TO_BLO':
        return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      {/* Filters */}
      <div className="bg-white border rounded-md p-4 shadow-sm mb-6">
        <h3 className="text-lg font-medium mb-4">Filters</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="number"
            name="constituencyId"
            placeholder="Constituency ID"
            value={filters.constituencyId}
            onChange={handleFilterChange}
            className="border px-3 py-2 rounded-md"
          />

          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="border px-3 py-2 rounded-md"
          >
            <option value="">All Status</option>
            {complaintStatuses.map(status => (
              <option key={status} value={status}>
                {status.replace(/_/g, ' ')}
              </option>
            ))}
          </select>

          <button
            onClick={fetchComplaints}
            className="bg-blue-600 text-white rounded-md px-4 py-2"
          >
            Load Complaints
          </button>
        </div>
      </div>

      {/* Complaints List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border rounded-md">
          <div className="bg-blue-100 px-4 py-2 font-medium">
            Complaints ({complaints.length})
          </div>

          {loading ? (
            <div className="p-6 text-center">
              <LoadingSmall />
            </div>
          ) : (
            complaints.map(c => (
              <div key={c.complaintId} className="p-4 border-b">
                <h4 className="font-medium">#{c.complaintId}</h4>
                <p className="text-sm">{c.subject}</p>

                <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${getStatusBadge(c.complaintStatus)}`}>
                  {c.complaintStatus.replace(/_/g, ' ')}
                </span>

                <div className="text-xs text-gray-500 mt-1">
                  {new Date(c.createdAt).toLocaleDateString()}
                </div>

                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => viewComplaintDetails(c.complaintId)}
                    className="text-blue-600 text-sm"
                  >
                    View Details
                  </button>

                  {c.complaintStatus === 'REGISTERED' && (
                    <button
                      onClick={() => openAssignmentModal(c.complaintId)}
                      className="text-green-600 text-sm"
                    >
                      Assign to BLO
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Details */}
        <div className="bg-white border rounded-md">
          <div className="bg-blue-100 px-4 py-2 font-medium">
            Complaint Details
          </div>

          {detailsLoading ? (
            <div className="p-6 text-center">
              <LoadingSmall />
            </div>
          ) : selectedComplaint ? (
            <div className="p-4 space-y-3">
              <h4 className="font-medium">
                Complaint #{selectedComplaint.complaintId}
              </h4>
              <p>{selectedComplaint.description}</p>
            </div>
          ) : (
            <div className="p-6 text-gray-500 text-center">
              Select a complaint to view details
            </div>
          )}
        </div>
      </div>

      {/* Assignment Modal */}
      {assignmentModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md w-96">
            <h3 className="font-medium mb-4">Assign to BLO</h3>

            <input
              type="number"
              placeholder="BLO ID"
              value={assignmentModal.bloId}
              onChange={e =>
                setAssignmentModal({ ...assignmentModal, bloId: e.target.value })
              }
              className="border px-3 py-2 w-full mb-3"
            />

            <textarea
              placeholder="Remarks"
              value={assignmentModal.remarks}
              onChange={e =>
                setAssignmentModal({ ...assignmentModal, remarks: e.target.value })
              }
              className="border px-3 py-2 w-full mb-3"
            />

            <div className="flex gap-3">
              <button
                onClick={handleAssignToBlo}
                className="bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Assign
              </button>
              <button
                onClick={closeAssignmentModal}
                className="border px-4 py-2 rounded-md"
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
