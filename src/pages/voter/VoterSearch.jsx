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
      let isEpicSearch = false;

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
          try {
            const epicResult = await searchVoterByEpic(searchParams.epicNumber);
            results = [epicResult];
            isEpicSearch = true;
          } catch (epicError) {
            if (epicError.response?.status === 404) {
              toast.info('No voter found with this EPIC number');
              setSearchResults([]);
              return;
            }
            throw epicError;
          }
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

      // Store search context for results
      const resultsWithContext = Array.isArray(results) ? results.map(voter => ({
        ...voter,
        searchContext: {
          isEpicSearch,
          searchedEpicNumber: isEpicSearch ? searchParams.epicNumber : null
        }
      })) : [];

      setSearchResults(resultsWithContext);
      
      if (!results || (Array.isArray(results) && results.length === 0)) {
        toast.info('No voters found');
      } else {
        toast.success(`Found ${Array.isArray(results) ? results.length : 1} voter(s)`);
      }
    } catch (error) {
      console.error('Search error details:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        searchType: searchType,
        searchParams: searchParams
      });
      
      if (error.response?.status === 204) {
        setSearchResults([]);
        toast.info('No voters found');
      } else if (error.response?.status === 404) {
        setSearchResults([]);
        toast.info('No voters found for the given criteria');
      } else if (error.response?.status === 500) {
        toast.error('Server error. Please try again later.');
      } else {
        toast.error(`Search failed: ${error.response?.data?.message || error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const viewVoterDetails = (voter) => {
    const id = voter.voterId;
    if (id) {
      // Pass search context to voter details page
      navigate(`/voters/${id}`, {
        state: {
          fromEpicSearch: voter.searchContext?.isEpicSearch || false,
          epicNumber: voter.searchContext?.searchedEpicNumber || null
        }
      });
    } else {
      toast.error('Voter ID not found. Please contact support.');
    }
  };

  const getSearchTypeIcon = (type) => {
    switch (type) {
      case 'name': return '👤';
      case 'epic': return '🆔';
      case 'relative': return '👨👩👧👦';
      case 'constituency': return '🏛️';
      case 'part': return '#️⃣';
      case 'assembly': return '🏢';
      default: return '🔍';
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter voter name (e.g., John Doe)"
          />
        );

      case 'epic':
        return (
          <input
            type="text"
            name="epicNumber"
            value={searchParams.epicNumber}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter EPIC number (e.g., ABC1234567)"
            maxLength={20}
          />
        );

      case 'relative':
        return (
          <input
            type="text"
            name="relativeName"
            value={searchParams.relativeName}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Constituency name"
            />
            <input
              type="number"
              name="constituencyNumber"
              value={searchParams.constituencyNumber}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Constituency ID"
            />
            <input
              type="number"
              name="partNumber"
              value={searchParams.partNumber}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Assembly constituency ID"
          />
        );

      default:
        return null;
    }
  };

  const clearSearch = () => {
    setSearchParams({
      name: '',
      epicNumber: '',
      relativeName: '',
      constituencyName: '',
      constituencyNumber: '',
      constituencyId: '',
      partNumber: '',
      assemblyConstituencyId: ''
    });
    setSearchResults([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white border rounded-lg shadow-sm p-6 mb-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center">
              <span className="mr-3">🔍</span>
              Voter Search Portal
            </h1>
            <p className="text-gray-600 mt-2">Search for voter information using various criteria</p>
          </div>
          
          {/* Search Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
              <span className="mr-2">📊</span>
              Search Type
            </label>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="name">👤 Search by Name</option>
              <option value="epic">🆔 Search by EPIC Number</option>
              <option value="relative">👨👩👧👦 Search by Relative Name</option>
              <option value="constituency">🏛️ Search by Constituency</option>
              <option value="part">#️⃣ Search by Part Number</option>
              <option value="assembly">🏢 Search by Assembly Constituency</option>
            </select>
          </div>

          {/* Search Form */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
              <span className="mr-2">{getSearchTypeIcon(searchType)}</span>
              Search Parameters
            </label>
            {renderSearchForm()}
          </div>

          {/* Search Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
            >
              {loading ? (
                <>
                  <LoadingSmall size="sm" />
                  <span className="ml-2">Searching...</span>
                </>
              ) : (
                <>
                  <span className="mr-2">🔍</span>
                  Search Voters
                </>
              )}
            </button>
            <button
              onClick={clearSearch}
              disabled={loading}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-colors"
            >
              <span className="mr-2">🔄</span>
              Clear
            </button>
          </div>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="bg-white border rounded-lg shadow-sm">
            <div className="bg-green-100 text-green-900 px-6 py-4 font-medium rounded-t-lg flex items-center justify-between">
              <div className="flex items-center">
                <span className="mr-2 text-xl">📄</span>
                Search Results ({searchResults.length})
              </div>
              {searchResults[0]?.searchContext?.isEpicSearch && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                  🆔 EPIC Search - Direct Download Available
                </span>
              )}
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
                  {searchResults.map((voter, index) => (
                    <tr key={voter.voterId || index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">{voter.voterName}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-mono">
                          {voter.epicNumber || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{voter.age || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          voter.gender === 'MALE' ? 'bg-blue-100 text-blue-800' :
                          voter.gender === 'FEMALE' ? 'bg-pink-100 text-pink-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {voter.gender === 'MALE' ? '👨' : voter.gender === 'FEMALE' ? '👩' : '⚧'}
                          <span className="ml-1">{voter.gender || '-'}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{voter.pollingStationName || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{voter.assemblyConstituencyName || '-'}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => viewVoterDetails(voter)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium flex items-center transition-colors"
                        >
                          <span className="mr-2">👁️</span>
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

        {/* Help Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
            <span className="mr-2">📝</span>
            Search Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <h4 className="font-medium mb-2">👤 Name Search:</h4>
              <p>Enter full or partial name. Case insensitive.</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">🆔 EPIC Search:</h4>
              <p>Enter complete EPIC number for exact match.</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">👨👩👧👦 Relative Search:</h4>
              <p>Search by father's or mother's name.</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">🏛️ Constituency Search:</h4>
              <p>Use either name or number (or both).</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}