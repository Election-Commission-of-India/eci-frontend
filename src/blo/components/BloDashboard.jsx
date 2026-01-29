import { useEffect, useState } from 'react';
import { getBloDashboard, getAssignedApplications } from '../services/bloService';
import LoadingSmall from '../../components/SmallLoading';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { getCurrentUserId, clearAuth } from '../../utils/auth';

export default function BloDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
    fetchAssignedApplications();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const userId = getCurrentUserId();
      if (!userId) {
        throw new Error('User not logged in');
      }
      const data = await getBloDashboard(userId);
      setDashboardData(data);
    } catch (error) {
      console.error('Dashboard error:', error.message);
      toast.error('Please login first to access dashboard');
      if (error.response?.status === 401) {
        clearAuth();
        navigate('/blo/login');
      }
    }
  };

  const fetchAssignedApplications = async () => {
    try {
      const data = await getAssignedApplications();
      setApplications(data || []);
    } catch (error) {
      console.error('Applications error:', error);
      if (error.response?.status === 401) {
        clearAuth();
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSmall size="lg" />
      </div>
    );
  }

  const StatCard = ({ title, value, bgColor, textColor, icon }) => (
    <div className={`${bgColor} border rounded-lg p-6 shadow-sm`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className={`text-sm font-medium ${textColor} opacity-75`}>{title}</h3>
          <p className={`text-3xl font-bold ${textColor} mt-2`}>{value || 0}</p>
        </div>
        <div className={`text-3xl ${textColor} opacity-60`}>{icon}</div>
      </div>
    </div>
  );

  const dashboardCards = [
    { title: "Total Voters in Part", key: "totalVotersInPart", bg: "bg-blue-50", text: "text-blue-700", icon: "👥" },
    { title: "Pending Applications", key: "pendingApplications", bg: "bg-yellow-50", text: "text-yellow-700", icon: "⏳" },
    { title: "Resolved Complaints", key: "resolvedComplaints", bg: "bg-green-50", text: "text-green-700", icon: "✅" },
    { title: "Pending Complaints", key: "pendingComplaints", bg: "bg-red-50", text: "text-red-700", icon: "❌" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border rounded-md p-4 shadow-sm">
        <h1 className="text-xl font-semibold text-gray-800">BLO Dashboard</h1>
        <p className="text-sm text-gray-600">Booth Level Officer Portal</p>
        {dashboardData?.profile && (
          <p className="text-xs text-gray-500 mt-1 flex items-center">
            <span className="mr-1">👨‍💼</span>
            {dashboardData.profile.fullName} - {dashboardData.profile.assemblyConstituencyName}
          </p>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardCards.map(card => (
          <StatCard
            key={card.key}
            title={card.title}
            value={dashboardData?.[card.key]}
            bgColor={card.bg}
            textColor={card.text}
            icon={card.icon}
          />
        ))}
      </div>

      {/* Assigned Applications */}
      <div className="bg-white border rounded-lg shadow-sm">
        <div className="bg-blue-100 text-blue-900 px-6 py-4 font-medium rounded-t-lg flex items-center justify-between">
          <div className="flex items-center">
            <span className="mr-2 text-xl">📋</span>
            Assigned Applications ({applications.length})
          </div>
          <button
            onClick={() => navigate('/blo/applications')}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center hover:bg-blue-50 px-3 py-1 rounded transition-colors"
          >
            View All →
          </button>
        </div>

        {applications.length === 0 ? (
          <div className="text-center p-8 text-gray-500">
            <span className="text-4xl mb-4 block">📄</span>
            No applications assigned to you yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">App Number</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applicant Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Form Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {applications.slice(0, 5).map((app) => (
                  <tr key={app.applicationId} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{app.applicationNumber}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{app.fullName}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{app.formType}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(app.applicationStatus)}`}>
                        {app.applicationStatus?.replace(/_/g, ' ')}
                      </span>
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