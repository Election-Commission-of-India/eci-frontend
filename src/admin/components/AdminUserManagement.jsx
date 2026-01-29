import { useState, useEffect } from 'react';
import { getAllUsers, createUser, toggleUserStatus, assignRole } from '../services/adminApis';
import { toast } from 'react-toastify';

export default function AdminUserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [filters, setFilters] = useState({
    role: '',
    isActive: ''
  });

  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0
  });

  // ✅ FIXED FORM STATE
  const [formData, setFormData] = useState({
    userName: '',
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    userRole: '',
    isActive: true
  });

  useEffect(() => {
    fetchUsers();
  }, [filters, pagination.page]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers(
        pagination.page,
        pagination.size,
        filters.role || null,
        filters.isActive !== '' ? filters.isActive === 'true' : null
      );

      setUsers(response?.content || []);
      setPagination(prev => ({
        ...prev,
        totalElements: response?.totalElements || 0,
        totalPages: response?.totalPages || 0
      }));
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED PAYLOAD
  const handleCreateUser = async (e) => {
    e.preventDefault();

    const payload = {
      userName: formData.userName,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      mobile: formData.mobile,
      userRole: formData.userRole,
      isActive: formData.isActive
    };

    try {
      const response = await createUser(payload);

      if (response?.success) {
        toast.success('User created successfully');
        setShowCreateModal(false);
        setFormData({
          userName: '',
          firstName: '',
          lastName: '',
          email: '',
          mobile: '',
          userRole: '',
          isActive: true
        });
        fetchUsers();
      } else {
        toast.error(response?.message || 'Failed to create user');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to create user');
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      const response = await toggleUserStatus(userId);
      if (response?.success) {
        toast.success(response.message);
        fetchUsers();
      }
    } catch (error) {
      toast.error('Failed to toggle user status');
    }
  };

  const handleAssignRole = async (userId, role) => {
    try {
      const response = await assignRole(userId, role);
      if (response?.success) {
        toast.success(response.message);
        fetchUsers();
      }
    } catch (error) {
      toast.error('Failed to assign role');
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-gray-600">Manage system users</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create User
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="min-w-full divide-y">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">Username</th>
              <th className="px-6 py-3 text-left">Contact</th>
              <th className="px-6 py-3 text-left">Role</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="p-4 text-center">Loading...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan="5" className="p-4 text-center">No users found</td></tr>
            ) : (
              users.map(user => (
                <tr key={user.id} className="border-t">
                  <td className="px-6 py-4">{user.userName}</td>
                  <td className="px-6 py-4">{user.email}<br />{user.mobile}</td>
                  <td className="px-6 py-4">
                    <select
                      value={user.userRole}
                      onChange={(e) => handleAssignRole(user.id, e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      <option value="ROLE_ERO">ERO</option>
                      <option value="ROLE_BLO">BLO</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    {user.active ? 'Active' : 'Inactive'}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleStatus(user.id)}
                      className="text-blue-600"
                    >
                      Toggle
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Create New User</h2>

            <form onSubmit={handleCreateUser} className="space-y-3">

              <input
                placeholder="Username"
                value={formData.userName}
                onChange={(e) => setFormData(p => ({ ...p, userName: e.target.value }))}
                required
                className="w-full border px-3 py-2 rounded"
              />

              <input
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData(p => ({ ...p, firstName: e.target.value }))}
                required
                className="w-full border px-3 py-2 rounded"
              />

              <input
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData(p => ({ ...p, lastName: e.target.value }))}
                required
                className="w-full border px-3 py-2 rounded"
              />

              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                required
                className="w-full border px-3 py-2 rounded"
              />

              <input
                placeholder="Mobile"
                value={formData.mobile}
                onChange={(e) => setFormData(p => ({ ...p, mobile: e.target.value }))}
                required
                className="w-full border px-3 py-2 rounded"
              />

              <select
                value={formData.userRole}
                onChange={(e) => setFormData(p => ({ ...p, userRole: e.target.value }))}
                required
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Select Role</option>
                <option value="ROLE_BLO">BLO</option>
                <option value="ROLE_ERO">ERO</option>
              </select>

              <div className="flex justify-end gap-3 pt-3">
                <button type="button" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                  Create
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
