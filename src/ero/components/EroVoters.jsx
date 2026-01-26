import { useState, useEffect } from 'react';
import { getAllVoters } from '../services/eroApis';
import { toast } from 'react-toastify';
import LoadingSmall from '../../components/SmallLoading';

export default function EroVoters() {
  const [voters, setVoters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredVoters, setFilteredVoters] = useState([]);

  useEffect(() => {
    fetchVoters();
  }, []);

  useEffect(() => {
    // Filter voters based on search term
    if (searchTerm.trim() === '') {
      setFilteredVoters(voters);
    } else {
      const filtered = voters.filter(voter =>
        voter.voterName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        voter.epicNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        voter.fatherName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredVoters(filtered);
    }
  }, [searchTerm, voters]);

  const fetchVoters = async () => {
    try {
      setLoading(true);
      const data = await getAllVoters();
      setVoters(data);
      setFilteredVoters(data);
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

      {/* Search Section */}
      <div className="bg-white border rounded-md p-4 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, EPIC number, or father's name..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="text-sm text-gray-600">
            Showing {filteredVoters.length} of {voters.length} voters
          </div>
        </div>
      </div>

      {/* Voters List */}
      <div className="bg-white border rounded-md shadow-sm">
        <div className="bg-blue-100 text-blue-900 px-4 py-2 font-medium rounded-t-md">
          Registered Voters ({filteredVoters.length})
        </div>

        {loading ? (
          <div className="flex justify-center items-center p-8">
            <LoadingSmall size="lg" />
          </div>
        ) : filteredVoters.length === 0 ? (
          <div className="text-center p-8 text-gray-500">
            {searchTerm ? 'No voters found matching your search.' : 'No voters found.'}
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
                {filteredVoters.map((voter) => (
                  <tr key={voter.id || voter.epicNumber} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {voter.epicNumber}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {voter.voterName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {voter.fatherName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {voter.age}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {voter.gender}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate">
                      {voter.address}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {voter.constituencyName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {voter.pollingStationName}
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