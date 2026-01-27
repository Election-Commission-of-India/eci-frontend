import { useState } from 'react';
import { 
  searchVotersByName, 
  searchVoterByEpic, 
  searchVotersByRelative, 
  searchVotersByConstituency,
  searchVotersByPartNumber,
  searchVotersByAssembly 
} from '../../services/voterSearchService';
import { toast } from 'react-toastify';
import LoadingSmall from '../../components/SmallLoading';
import { useNavigate } from 'react-router';

export default function VoterSearch() {
  const [searchType, setSearchType] = useState('name');
  const [searchParams, setSearchParams] = useState({
    name: '',
    epicNumber: '',
    relativeName: '',
    constituencyName: '',
    constituencyNumber: '',
    constituencyId: '',
    partNumber: '',
    assemblyConstituencyId: ''
  });
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      let results = [];

      switch (searchType) {
        case 'name':
          if (!searchParams.name.trim()) {
            toast.error('Please enter a name');
            return;
          }
          results = await searchVotersByName(searchParams.name);
          break;

        case 'epic':
          if (!searchParams.epicNumber.trim()) {
            toast.error('Please enter EPIC number');
            return;
          }
          const epicResult = await searchVoterByEpic(searchParams.epicNumber);
          results = [epicResult]; // Convert single result to array for consistent display
          break;

        case 'relative':
          if (!searchParams.relativeName.trim()) {
            toast.error('Please enter relative name');
            return;
          }
          results = await searchVotersByRelative(searchParams.relativeName);
          break;

        case 'constituency':
          if (!searchParams.constituencyName.trim() && !searchParams.constituencyNumber) {
            toast.error('Please enter constituency name or number');
            return;
          }
          results = await searchVotersByConstituency(
            searchParams.constituencyName || null,
            searchParams.constituencyNumber || null
          );
          break;

        case 'part':
          if (!searchParams.constituencyId || !searchParams.partNumber) {
            toast.error('Please enter constituency ID and part number');
            return;
          }
          results = await searchVotersByPartNumber(
            parseInt(searchParams.constituencyId),
            parseInt(searchParams.partNumber)
          );
          break;

        case 'assembly':
          if (!searchParams.assemblyConstituencyId) {
            toast.error('Please enter assembly constituency ID');
            return;
          }
          results = await searchVotersByAssembly(parseInt(searchParams.assemblyConstituencyId));
          break;

        default:
          toast.error('Invalid search type');
          return;
      }

      setSearchResults(Array.isArray(results) ? results : []);
      
      if (!results || (Array.isArray(results) && results.length === 0)) {
        toast.info('No voters found');
      }
    } catch (error) {
      if (error.response?.status === 204) {
        setSearchResults([]);
        toast.info('No voters found');
      } else {
        toast.error('Search failed');
        console.error('Search error:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const viewVoterDetails = (voter) => {
    const id = voter.voterId;
    if (id) {
      navigate(`/voters/${id}`);
    } else {
      toast.error('Backend error: voterId not returned. Please fix backend VoterSearchServiceImpl to set dto.setVoterId(voter.getId())');
    }
  };

  const renderSearchForm = () => {
    switch (searchType) {
      case 'name':
        return (
          <input
            type="text"
            name="name"
            value={searchParams.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter voter name"
          />
        );

      case 'epic':
        return (
          <input
            type="text"
            name="epicNumber"
            value={searchParams.epicNumber}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter EPIC number"
          />
        );

      case 'relative':
        return (
          <input
            type="text"
            name="relativeName"
            value={searchParams.relativeName}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter father/mother name"
          />
        );

      case 'constituency':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="constituencyName"
              value={searchParams.constituencyName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Constituency name"
            />
            <input
              type="number"
              name="constituencyNumber"
              value={searchParams.constituencyNumber}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Constituency number"
            />
          </div>
        );

      case 'part':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="number"
              name="constituencyId"
              value={searchParams.constituencyId}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Constituency ID"
            />
            <input
              type="number"
              name="partNumber"
              value={searchParams.partNumber}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Part number"
            />
          </div>
        );

      case 'assembly':
        return (
          <input
            type="number"
            name="assemblyConstituencyId"
            value={searchParams.assemblyConstituencyId}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Assembly constituency ID"
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white border rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Voter Search</h1>
          
          {/* Search Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Type
            </label>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="name">Search by Name</option>
              <option value="epic">Search by EPIC Number</option>
              <option value="relative">Search by Relative Name</option>
              <option value="constituency">Search by Constituency</option>
              <option value="part">Search by Part Number</option>
              <option value="assembly">Search by Assembly Constituency</option>
            </select>
          </div>

          {/* Search Form */}
          <div className="mb-6">
            {renderSearchForm()}
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? <LoadingSmall size="sm" /> : 'Search'}
          </button>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="bg-white border rounded-lg shadow-sm">
            <div className="bg-blue-100 text-blue-900 px-4 py-3 font-medium rounded-t-lg">
              Search Results ({searchResults.length})
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">EPIC Number</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Age</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gender</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Polling Station</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Constituency</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {searchResults.map((voter) => (
                    <tr key={voter.voterId} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{voter.voterName}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{voter.epicNumber || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{voter.age || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{voter.gender || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{voter.pollingStationName || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{voter.assemblyConstituencyName || '-'}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => viewVoterDetails(voter)}
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
          </div>
        )}
      </div>
    </div>
  );
}