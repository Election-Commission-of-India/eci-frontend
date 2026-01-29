import { useState, useEffect } from 'react';
import { getAuditLogsByTable } from '../../services/auditLogService';
import { toast } from 'react-toastify';
import LoadingSmall from '../../components/SmallLoading';

export default function AuditLogs() {
  const [tableName, setTableName] = useState('');
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Common table names based on backend entities
  const tableOptions = [
    'VoterRegistrationApplication',
    'ElectoralRoll',
    'Complaint',
    'User',
    'BLOAssignment',
    'Document'
  ];

  const fetchAuditLogs = async () => {
    if (!tableName.trim()) {
      toast.error('Please select or enter a table name');
      return;
    }

    try {
      setLoading(true);
      const logs = await getAuditLogsByTable(tableName);
      setAuditLogs(logs);
      
      if (logs.length === 0) {
        toast.info('No audit logs found for this table');
      }
    } catch (error) {
      if (error.response?.status === 204) {
        setAuditLogs([]);
        toast.info('No audit logs found for this table');
      } else {
        toast.error('Failed to fetch audit logs');
        console.error('Audit logs error:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return 'N/A';
    return new Date(dateTime).toLocaleString();
  };

  const getActionColor = (action) => {
    switch (action?.toUpperCase()) {
      case 'CREATE':
      case 'INSERT': return 'bg-green-100 text-green-800';
      case 'UPDATE': return 'bg-blue-100 text-blue-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white border rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Audit Logs</h1>
          
          {/* Search Form */}
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Table Name
              </label>
              <div className="flex gap-2">
                <select
                  value={tableName}
                  onChange={(e) => setTableName(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a table</option>
                  {tableOptions.map(table => (
                    <option key={table} value={table}>{table}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={tableName}
                  onChange={(e) => setTableName(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Or enter custom table name"
                />
              </div>
            </div>
            <button
              onClick={fetchAuditLogs}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? <LoadingSmall size="sm" /> : 'Search Logs'}
            </button>
          </div>
        </div>

        {/* Audit Logs Results */}
        {auditLogs.length > 0 && (
          <div className="bg-white border rounded-lg shadow-sm">
            <div className="bg-blue-100 text-blue-900 px-4 py-3 font-medium rounded-t-lg">
              Audit Logs for {tableName} ({auditLogs.length})
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Log ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Record ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Old Value</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">New Value</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP Address</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {auditLogs.map((log) => (
                    <tr key={log.auditLogId} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{log.auditLogId}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <div>
                          <div className="font-medium">{log.userName || 'N/A'}</div>
                          <div className="text-xs text-gray-500">ID: {log.userId || 'N/A'}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getActionColor(log.action)}`}>
                          {log.action || 'N/A'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{log.recordId || 'N/A'}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate" title={log.oldValue}>
                        {log.oldValue || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate" title={log.newValue}>
                        {log.newValue || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{log.ipAddress || 'N/A'}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{formatDateTime(log.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}