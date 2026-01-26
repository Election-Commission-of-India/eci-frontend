import { useState, useEffect } from 'react';
import { getApplicationsByConstituency, filterApplications } from '../services/eroApis';
import { toast } from 'react-toastify';
import LoadingSmall from '../../components/SmallLoading';
import { useNavigate } from 'react-router';

export default function EroApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    constituencyId: '',
    status: '',
    formType: '',
    bloId: '',
    fromDate: '',
    toDate: ''
  });
  const navigate = useNavigate();

  const applicationStatuses = ['SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'];
  const formTypes = ['FORM6', 'FORM8'];

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const fetchApplicationsByConstituency = async () => {
    if (!filters.constituencyId) {
      toast.error('Please select a constituency');
      return;
    }

    try {
      setLoading(true);
      const data = await getApplicationsByConstituency(filters.constituencyId);
      setApplications(data);
      if (data.length === 0) {
        toast.info('No applications found for this constituency');
      }
    } catch (error) {
      toast.error('Failed to fetch applications');
      console.error('Applications error:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = async () => {
    try {
      setLoading(true);
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '')
      );
      const data = await filterApplications(cleanFilters);
      setApplications(data);
    } catch (error) {
      toast.error('Failed to apply filters');
      console.error('Filter error:', error);
    } finally {
      setLoading(false);
    }
  };

  const viewApplicationDetails = (applicationId) => {
    navigate(`/ero/applications/${applicationId}/details`);
  };

  return (
    <div className="p-6">
      <div className="bg-white border rounded-md p-4 shadow-sm mb-6">
        <h1 className="text-xl font-semibold text-gray-800">Applications Management</h1>
        <p className="text-sm text-gray-600">View and manage voter registration applications</p>
      </div>

      {/* Filters Section */}
      <div className="bg-white border rounded-md p-4 shadow-sm mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Filters</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Constituency ID
            </label>
            <input
              type="number"
              name="constituencyId"
              value={filters.constituencyId}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter ID"
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
              {applicationStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Form Type
            </label>
            <select
              name="formType"
              value={filters.formType}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Forms</option>
              {formTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              BLO ID
            </label>
            <input
              type="number"
              name="bloId"
              value={filters.bloId}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="BLO ID"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From Date
            </label>
            <input
              type="date"
              name="fromDate"
              value={filters.fromDate}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To Date
            </label>
            <input
              type="date"
              name="toDate"
              value={filters.toDate}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          <button
            onClick={fetchApplicationsByConstituency}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Load by Constituency
          </button>
          <button
            onClick={applyFilters}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-white border rounded-md shadow-sm">
        <div className="bg-blue-100 text-blue-900 px-4 py-2 font-medium rounded-t-md">
          Applications ({applications.length})
        </div>

        {loading ? (
          <div className="flex justify-center items-center p-8">
            <LoadingSmall size="lg" />
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center p-8 text-gray-500">
            No applications found. Use filters to search for applications.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applicant Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Form Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{app.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{app.applicantName || app.fullName}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{app.formType}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        app.applicationStatus === 'APPROVED' ? 'bg-green-100 text-green-800' :
                        app.applicationStatus === 'REJECTED' ? 'bg-red-100 text-red-800' :
                        app.applicationStatus === 'UNDER_REVIEW' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {app.applicationStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {app.submissionDate ? new Date(app.submissionDate).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => viewApplicationDetails(app.id)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}