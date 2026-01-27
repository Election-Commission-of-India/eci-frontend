import { useState, useEffect } from 'react';
import { getAllVoters } from '../services/eroApis';
import { toast } from 'react-toastify';
import LoadingSmall from '../../components/SmallLoading';

export default function EroVoters() {
  const [voters, setVoters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVoters();
  }, []);

  const fetchVoters = async () => {
    try {
      setLoading(true);

      const data = await getAllVoters();

      // Normalize backend response for consistent frontend usage
      const normalized = (data || []).map(v => ({
        epicNumber: v.epicNumber,
        fullName: v.fullName,
        gender: v.gender,
        age: v.age,
        constituency: v.constituency,
        pollingStation: v.pollingStation
      }));

      setVoters(normalized);

    } catch (error) {
      toast.error('Failed to load voters data');
      console.error('Voters error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white border rounded-md p-4 shadow-sm mb-6">
        <h1 className="text-xl font-semibold text-gray-800">Electoral Roll</h1>
        <p className="text-sm text-gray-600">View all registered voters</p>
      </div>

      <div className="bg-white border rounded-md shadow-sm">
        <div className="bg-blue-100 text-blue-900 px-4 py-2 font-medium rounded-t-md">
          Registered Voters ({voters.length})
        </div>

        {loading ? (
          <div className="flex justify-center items-center p-8">
            <LoadingSmall size="lg" />
          </div>
        ) : voters.length === 0 ? (
          <div className="text-center p-8 text-gray-500">
            No voters found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">EPIC Number</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Voter Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Father's Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Age</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gender</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Constituency</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Polling Station</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {voters.map((voter) => (
                  <tr key={voter.epicNumber} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {voter.epicNumber}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {voter.fullName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      N/A
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {voter.age}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {voter.gender}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      N/A
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {voter.constituency}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {voter.pollingStation}
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
