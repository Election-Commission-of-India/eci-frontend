import { useEffect, useState } from 'react';
import { getBloDashboard } from '../services/bloService';
import LoadingSmall from '../../components/SmallLoading';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { getCurrentUserId } from '../../utils/auth';

export default function BloDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const userId = getCurrentUserId();
      
      if (!userId) {
        toast.error('User ID not found. Please login again.');
        navigate('/blo/login');
        return;
      }

      console.log('Fetching dashboard for BLO user ID:', userId);
      const data = await getBloDashboard(userId);
      console.log("Dashboard API response:", data);
      console.log("Statistics:", {
        totalVotersInPart: data?.totalVotersInPart,
        pendingApplications: data?.pendingApplications,
        resolvedComplaints: data?.resolvedComplaints,
        pendingComplaints: data?.pendingComplaints
      });
      setDashboardData(data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSmall size="lg" />
      </div>
    );
  }

  const StatCard = ({ title, value, bgColor, textColor, icon, loading }) => (
    <div className={`${bgColor} border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className={`text-sm font-medium ${textColor} opacity-75`}>{title}</h3>
          {loading ? (
            <div className="flex items-center mt-2">
              <LoadingSmall size="sm" />
              <span className={`text-lg font-bold ${textColor} ml-2`}>Loading...</span>
            </div>
          ) : (
            <p className={`text-3xl font-bold ${textColor} mt-2`}>{value || 0}</p>
          )}
        </div>
        <div className={`text-3xl ${textColor} opacity-60`}>{icon}</div>
      </div>
    </div>
  );

  const ActionCard = ({ title, description, onClick, bgColor, textColor, icon }) => (
    <div 
      className={`${bgColor} border rounded-lg p-6 shadow-sm cursor-pointer hover:shadow-md transition-all hover:scale-105`}
      onClick={onClick}
    >
      <div className="flex items-center mb-3">
        <div className={`text-3xl mr-4 ${textColor}`}>{icon}</div>
        <h3 className={`text-lg font-semibold ${textColor}`}>{title}</h3>
      </div>
      <p className={`text-sm ${textColor} opacity-75`}>{description}</p>
    </div>
  );

  const dashboardCards = [
    { title: "Total Voters in Part", key: "totalVotersInPart", bg: "bg-blue-50", text: "text-blue-700", icon: "👥" },
    { title: "Pending Applications", key: "pendingApplications", bg: "bg-yellow-50", text: "text-yellow-700", icon: "⏳" },
    { title: "Resolved Complaints", key: "resolvedComplaints", bg: "bg-green-50", text: "text-green-700", icon: "✅" },
    { title: "Pending Complaints", key: "pendingComplaints", bg: "bg-red-50", text: "text-red-700", icon: "❗" }
  ];

  const actionCards = [
    {
      title: "Assigned Applications",
      description: "View and manage applications assigned to you",
      onClick: () => navigate('/blo/applications'),
      bg: "bg-blue-50",
      text: "text-blue-700",
      icon: "📋"
    },
    {
      title: "Profile",
      description: "View and manage your profile information",
      onClick: () => navigate('/blo/profile'),
      bg: "bg-green-50",
      text: "text-green-700",
      icon: "👤"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="bg-blue-600 rounded-lg p-3 mr-4">
                <span className="text-white text-2xl">🏛️</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  BLO Dashboard
                  <span className="ml-3 text-blue-600">📊</span>
                </h1>
                <p className="text-sm text-gray-600 mt-1">Booth Level Officer Portal</p>
                {dashboardData?.profile && (
                  <p className="text-xs text-gray-500 mt-1 flex items-center">
                    <span className="mr-1">👨‍💼</span>
                    {dashboardData.profile.fullName} - {dashboardData.profile.assemblyConstituencyName}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => navigate('/blo/profile')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center transition-colors"
            >
              <span className="mr-2">👤</span>
              View Profile
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <span className="mr-3 text-2xl">📈</span>
            Statistics Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {dashboardCards.map(card => (
              <StatCard
                key={card.key}
                title={card.title}
                value={dashboardData?.[card.key]}
                bgColor={card.bg}
                textColor={card.text}
                icon={card.icon}
                loading={loading}
              />
            ))}
          </div>
        </div>

        {/* Action Cards */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <span className="mr-3 text-2xl">⚡</span>
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {actionCards.map((card, index) => (
              <ActionCard
                key={index}
                title={card.title}
                description={card.description}
                onClick={card.onClick}
                bgColor={card.bg}
                textColor={card.text}
                icon={card.icon}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}