import { useState, useEffect } from 'react';
import { getAssignedApplications, filterApplications, searchApplications } from '../services/bloService';
import { toast } from 'react-toastify';
import LoadingSmall from '../../components/SmallLoading';
import { useNavigate } from 'react-router';

export default function AssignedApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    applicationStatus: '',
    formType: '',
    fromDate: '',
    toDate: ''
  });
  const navigate = useNavigate();

  const applicationStatuses = ['SUBMITTED', 'PENDING_FIELD_VERIFICATION', 'UNDER_VERIFICATION', 'FORWARDED_TO_ERO', 'APPROVED', 'REJECTED', 'QUERY_RAISED', 'BLO_APPROVED', 'BLO_REJECTED'];
  const formTypes = ['FORM6', 'FORM8'];

  useEffect(() => {
    fetchAssignedApplications();
  }, []);

  const fetchAssignedApplications = async () => {
    try {
      setLoading(true);
      const data = await getAssignedApplications();
      setApplications(data || []);
      if (data.length === 0) {
        toast.info('No applications assigned to you');
      }
    } catch (error) {
      toast.error('Failed to fetch assigned applications');
      console.error('Applications error:', error);
      if (error.response?.status === 401) {
        navigate('/blo/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const applyFilters = async () => {
    try {
      setLoading(true);
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '')
      );
      const data = await filterApplications(cleanFilters);
      setApplications(data || []);
    } catch (error) {
      toast.error('Failed to apply filters');
      console.error('Filter error:', error);
      if (error.response?.status === 401) {
        navigate('/blo/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast.error('Please enter a search term');
      return;
    }

    try {
      setLoading(true);
      const data = await searchApplications(searchTerm);
      setApplications(data || []);
    } catch (error) {
      toast.error('Failed to search applications');
      console.error('Search error:', error);
      if (error.response?.status === 401) {
        navigate('/blo/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED':
      case 'BLO_APPROVED': return 'bg-green-100 text-green-800';
      case 'REJECTED':
      case 'BLO_REJECTED': return 'bg-red-100 text-red-800';
      case 'PENDING_FIELD_VERIFICATION': return 'bg-yellow-100 text-yellow-800';
      case 'UNDER_VERIFICATION': return 'bg-blue-100 text-blue-800';
      case 'FORWARDED_TO_ERO': return 'bg-purple-100 text-purple-800';
      case 'QUERY_RAISED': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border rounded-md p-4 shadow-sm">
        <h1 className="text-xl font-semibold text-gray-800 flex items-center">
          <span className="mr-2">📋</span>
          Assigned Applications
        </h1>
        <p className="text-sm text-gray-600">View and manage applications assigned to you</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border rounded-md p-6 shadow-sm">
        {/* Search */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <span className="mr-2">🔍</span>
            Search Applications
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search by name or application number..."
            />
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center transition-colors"
            >
              <span className="mr-2">🔍</span>
              Search
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
            <span className="mr-2">📊</span>
            Filters
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="applicationStatus"
                value={filters.applicationStatus}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                {applicationStatuses.map(status => (
                  <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Form Type</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
              <input
                type="date"
                name="fromDate"
                value={filters.fromDate}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
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
              onClick={applyFilters}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center transition-colors"
            >
              <span className="mr-2">✓</span>
              Apply Filters
            </button>
            <button
              onClick={fetchAssignedApplications}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center transition-colors"
            >
              <span className="mr-2">🔄</span>
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-white border rounded-lg shadow-sm">
        <div className="bg-blue-100 text-blue-900 px-6 py-4 font-medium rounded-t-lg flex items-center">
          <span className="mr-2 text-xl">📄</span>
          Applications ({applications.length})
        </div>

        {loading ? (
          <div className="flex justify-center items-center p-8">
            <LoadingSmall size="lg" />
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center p-8 text-gray-500">
            <span className="text-4xl mb-4 block">📭</span>
            No applications found. Try adjusting your search or filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">App Number</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applicant Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">EPIC Number</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Form Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {applications.map((app) => (
                  <tr key={app.applicationId} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{app.applicationNumber}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{app.fullName}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{app.epicNumber || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{app.formType}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(app.applicationStatus)}`}>
                        {app.applicationStatus?.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {app.submittedDate ? new Date(app.submittedDate).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/blo/applications/${app.applicationId}/details`)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                        >
                          <span className="mr-1">👁️</span>
                          View
                        </button>
                        <button
                          onClick={() => navigate(`/blo/applications/${app.applicationId}/documents`)}
                          className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center hover:bg-green-50 px-2 py-1 rounded transition-colors"
                        >
                          <span className="mr-1">📄</span>
                          Documents
                        </button>
                      </div>
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