import { useEffect, useState } from 'react';
import { getEroDashboard } from '../services/eroApis';
import LoadingSmall from '../../components/SmallLoading';
import { toast } from 'react-toastify';

export default function EroDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await getEroDashboard();
      console.log("Dashboard API data:", data);
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

  const StatCard = ({ title, value, bgColor, textColor }) => (
    <div className={`${bgColor} border rounded-lg p-6 shadow-sm`}>
      <h3 className={`text-sm font-medium ${textColor} opacity-75`}>{title}</h3>
      <p className={`text-3xl font-bold ${textColor} mt-2`}>{value || 0}</p>
    </div>
  );
  const dashboardCards = [
    { title: "Total Applications", key: "totalApplications", bg: "bg-blue-50", text: "text-blue-700" },
    { title: "Submitted Applications", key: "submitted", bg: "bg-yellow-50", text: "text-yellow-700" },
    { title: "Pending Field Verification", key: "pendingFieldVerification", bg: "bg-orange-50", text: "text-orange-700" },
    { title: "Under Verification", key: "underVerification", bg: "bg-indigo-50", text: "text-indigo-700" },
    { title: "Forwarded to ERO", key: "forwardedToEro", bg: "bg-cyan-50", text: "text-cyan-700" },
    { title: "Approved", key: "approved", bg: "bg-green-50", text: "text-green-700" },
    { title: "Rejected", key: "rejected", bg: "bg-red-50", text: "text-red-700" },
    { title: "Query Raised", key: "queryRaised", bg: "bg-pink-50", text: "text-pink-700" },
    { title: "Form 6 Applications", key: "form6", bg: "bg-emerald-50", text: "text-emerald-700" },
    { title: "Form 8 Applications", key: "form8", bg: "bg-purple-50", text: "text-purple-700" }
  ];
  return (
    <div className="p-6">
      <div className="bg-white border rounded-md p-4 shadow-sm mb-6">
        <h1 className="text-xl font-semibold text-gray-800">ERO Dashboard</h1>
        <p className="text-sm text-gray-600">Executive statistics and overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardCards.map(card => (
          <StatCard
            key={card.key}
            title={card.title}
            value={dashboardData?.[card.key]}
            bgColor={card.bg}
            textColor={card.text}
          />
        ))}
      </div>

    </div>
  );
}