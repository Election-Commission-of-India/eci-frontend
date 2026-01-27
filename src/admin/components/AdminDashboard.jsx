import { useState, useEffect } from 'react';
import { getAllUsers } from '../services/adminApis';
import { toast } from 'react-toastify';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    adminUsers: 0,
    eroUsers: 0,
    bloUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Fetch all users to calculate stats
      const allUsersResponse = await getAllUsers(0, 1000); // Get large page to count all
      const users = allUsersResponse.content || [];
      
      const stats = {
        totalUsers: users.length,
        activeUsers: users.filter(user => user.active).length,
        inactiveUsers: users.filter(user => !user.active).length,
        adminUsers: users.filter(user => user.userRole === 'ROLE_ADMIN').length,
        eroUsers: users.filter(user => user.userRole === 'ROLE_ERO').length,
        bloUsers: users.filter(user => user.userRole === 'ROLE_BLO').length
      };
      
      setStats(stats);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color = 'blue' }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`flex-shrink-0 p-3 rounded-lg bg-${color}-100`}>
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-semibold text-${color}-600`}>
            {loading ? '...' : value}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome to the Election Commission Administrative Portal
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon="👥"
          color="blue"
        />
        <StatCard
          title="Active Users"
          value={stats.activeUsers}
          icon="✅"
          color="green"
        />
        <StatCard
          title="Inactive Users"
          value={stats.inactiveUsers}
          icon="❌"
          color="red"
        />
        <StatCard
          title="Admin Users"
          value={stats.adminUsers}
          icon="👑"
          color="purple"
        />
        <StatCard
          title="ERO Users"
          value={stats.eroUsers}
          icon="🏛️"
          color="indigo"
        />
        <StatCard
          title="BLO Users"
          value={stats.bloUsers}
          icon="👤"
          color="yellow"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <div className="text-2xl mb-2">👥</div>
            <div className="font-medium text-gray-900">Manage Users</div>
            <div className="text-sm text-gray-600">Create and manage user accounts</div>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <div className="text-2xl mb-2">🏛️</div>
            <div className="font-medium text-gray-900">Constituencies</div>
            <div className="text-sm text-gray-600">Manage assembly constituencies</div>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <div className="text-2xl mb-2">🗳️</div>
            <div className="font-medium text-gray-900">Polling Stations</div>
            <div className="text-sm text-gray-600">Configure polling stations</div>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <div className="text-2xl mb-2">📄</div>
            <div className="font-medium text-gray-900">Document Types</div>
            <div className="text-sm text-gray-600">Manage document validation</div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">System Overview</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-green-600">✅</span>
              <span className="text-sm text-gray-700">System Status: Online</span>
            </div>
            <span className="text-xs text-gray-500">Active</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-blue-600">🔒</span>
              <span className="text-sm text-gray-700">Security: JWT Authentication Enabled</span>
            </div>
            <span className="text-xs text-gray-500">Secure</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-purple-600">📊</span>
              <span className="text-sm text-gray-700">Database: Connected</span>
            </div>
            <span className="text-xs text-gray-500">Operational</span>
          </div>
        </div>
      </div>
    </div>
  );
}