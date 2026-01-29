import { useState, useEffect } from 'react';
import { 
  getVoterDetails, 
  getPollingStationDetails, 
  getPollingStationMap, 
  getPollingStationDirections,
  downloadVoterSlip 
} from '../../services/voterSearchService';
import { downloadEpicCard, validateEpicNumber } from '../../services/epicDownloadService';
import { toast } from 'react-toastify';
import LoadingSmall from '../../components/SmallLoading';
import { useNavigate, useParams, useLocation } from 'react-router';

export default function VoterDetails() {
  const [voterData, setVoterData] = useState(null);
  const [pollingStationData, setPollingStationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloadingSlip, setDownloadingSlip] = useState(false);
  const [downloadingEpic, setDownloadingEpic] = useState(false);
  const [showEpicModal, setShowEpicModal] = useState(false);
  const [epicInput, setEpicInput] = useState('');
  const navigate = useNavigate();
  const { voterId } = useParams();
  const location = useLocation();
  
  // Check if we came from EPIC search (unique result)
  const isFromEpicSearch = location.state?.fromEpicSearch || false;
  const searchedEpicNumber = location.state?.epicNumber || '';

  useEffect(() => {
    if (voterId) {
      fetchVoterData();
    }
  }, [voterId]);

  const fetchVoterData = async () => {
    try {
      setLoading(true);
      const [voterDetails, pollingDetails] = await Promise.all([
        getVoterDetails(voterId),
        getPollingStationDetails(voterId)
      ]);
      
      setVoterData(voterDetails);
      setPollingStationData(pollingDetails);
      
      // If from EPIC search, pre-fill the EPIC number
      if (isFromEpicSearch && searchedEpicNumber) {
        setEpicInput(searchedEpicNumber);
      }
    } catch (error) {
      toast.error('Failed to load voter details');
      console.error('Voter details error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadSlip = async () => {
    try {
      setDownloadingSlip(true);
      await downloadVoterSlip(voterId);
      toast.success('Voter slip downloaded successfully');
    } catch (error) {
      toast.error('Failed to download voter slip');
      console.error('Download error:', error);
    } finally {
      setDownloadingSlip(false);
    }
  };

  const handleEpicDownloadClick = () => {
    if (isFromEpicSearch && searchedEpicNumber) {
      // Direct download for EPIC search
      handleDownloadEpic(searchedEpicNumber);
    } else {
      // Show modal for other search types
      setShowEpicModal(true);
      setEpicInput(voterData?.epicNumber || '');
    }
  };

  const handleDownloadEpic = async (epicNumber) => {
    try {
      setDownloadingEpic(true);
      
      // Validate EPIC number first
      const isValid = await validateEpicNumber(epicNumber);
      if (!isValid) {
        toast.error('Invalid EPIC number. Please check and try again.');
        return;
      }
      
      // Download EPIC card
      await downloadEpicCard(epicNumber);
      toast.success('EPIC card downloaded successfully');
      setShowEpicModal(false);
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error('EPIC number not found in the system');
      } else if (error.response?.status === 403) {
        toast.error('You are not authorized to download this EPIC card');
      } else {
        toast.error('Failed to download EPIC card');
      }
      console.error('EPIC download error:', error);
    } finally {
      setDownloadingEpic(false);
    }
  };

  const handleEpicModalSubmit = () => {
    if (!epicInput.trim()) {
      toast.error('Please enter EPIC number');
      return;
    }
    handleDownloadEpic(epicInput.trim());
  };

  const handleViewMap = async () => {
    try {
      const mapUrl = await getPollingStationMap(voterId);
      if (mapUrl) {
        window.open(mapUrl, '_blank');
      } else {
        toast.info('Map URL not available');
      }
    } catch (error) {
      toast.error('Failed to get map URL');
      console.error('Map error:', error);
    }
  };

  const handleGetDirections = async () => {
    try {
      const directionsUrl = await getPollingStationDirections(voterId);
      if (directionsUrl) {
        window.open(directionsUrl, '_blank');
      } else {
        toast.info('Directions URL not available');
      }
    } catch (error) {
      toast.error('Failed to get directions URL');
      console.error('Directions error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSmall size="lg" />
      </div>
    );
  }

  if (!voterData) {
    return (
      <div className="text-center p-8 text-gray-500">
        <span className="text-4xl mb-4 block">🗳️</span>
        Voter not found
      </div>
    );
  }

  const DetailField = ({ label, value, icon }) => (
    <div className="border-b border-gray-200 py-3 last:border-b-0">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-600 flex items-center">
          {icon && <span className="mr-2">{icon}</span>}
          {label}
        </span>
        <span className="text-sm text-gray-900 font-medium">{value || 'N/A'}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white border rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <span className="mr-3">👤</span>
                Voter Details
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Voter ID: {voterId} • {voterData.voterName}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleEpicDownloadClick}
                disabled={downloadingEpic}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-colors"
              >
                {downloadingEpic ? (
                  <>
                    <LoadingSmall size="sm" />
                    <span className="ml-2">Downloading...</span>
                  </>
                ) : (
                  <>
                    <span className="mr-2">🆔</span>
                    Download EPIC Card
                  </>
                )}
              </button>
              <button
                onClick={handleDownloadSlip}
                disabled={downloadingSlip}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-colors"
              >
                {downloadingSlip ? (
                  <>
                    <LoadingSmall size="sm" />
                    <span className="ml-2">Downloading...</span>
                  </>
                ) : (
                  <>
                    <span className="mr-2">📄</span>
                    Download Voter Slip
                  </>
                )}
              </button>
              <button
                onClick={() => navigate('/voters/search')}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center transition-colors"
              >
                <span className="mr-2">←</span>
                Back to Search
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Voter Information */}
          <div className="bg-white border rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <span className="mr-2">📋</span>
              Voter Information
            </h2>
            <div className="space-y-1">
              <DetailField label="Name" value={voterData.voterName} icon="👤" />
              <DetailField label="EPIC Number" value={voterData.epicNumber} icon="🆔" />
              <DetailField label="Age" value={voterData.age} icon="📅" />
              <DetailField label="Gender" value={voterData.gender} icon="⚧" />
              <DetailField label="House Number" value={voterData.houseNumber} icon="🏠" />
              <DetailField label="Relative Name" value={voterData.relativeName} icon="👨‍👩‍👧‍👦" />
              <DetailField label="Relation Type" value={voterData.relationType} icon="🔗" />
              <DetailField label="Address" value={voterData.address} icon="📍" />
            </div>
          </div>

          {/* Polling Station Information */}
          {pollingStationData && (
            <div className="bg-white border rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <span className="mr-2">🗳️</span>
                Polling Station Details
              </h2>
              <div className="space-y-1 mb-6">
                <DetailField label="Station ID" value={pollingStationData.stationId} icon="🏢" />
                <DetailField label="Station Number" value={pollingStationData.stationNumber} icon="#️⃣" />
                <DetailField label="Station Name" value={pollingStationData.stationName} icon="🏛️" />
                <DetailField label="Address" value={pollingStationData.address} icon="📍" />
                <DetailField label="Assembly Constituency" value={pollingStationData.assemblyConstituencyName} icon="🏛️" />
                <DetailField label="Facilities" value={pollingStationData.facilities} icon="♿" />
                {pollingStationData.latitude && pollingStationData.longitude && (
                  <DetailField 
                    label="Coordinates" 
                    value={`${pollingStationData.latitude}, ${pollingStationData.longitude}`}
                    icon="🌍"
                  />
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleViewMap}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center transition-colors"
                >
                  <span className="mr-2">🗺️</span>
                  View on Map
                </button>
                <button
                  onClick={handleGetDirections}
                  className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center justify-center transition-colors"
                >
                  <span className="mr-2">🧭</span>
                  Get Directions
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* EPIC Number Input Modal */}
      {showEpicModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <span className="mr-2">🆔</span>
                Enter EPIC Number
              </h3>
              <button
                onClick={() => setShowEpicModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-3">
                Please enter your EPIC number to download the EPIC card. You can only download your own EPIC card.
              </p>
              <input
                type="text"
                value={epicInput}
                onChange={(e) => setEpicInput(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter EPIC number"
                maxLength={20}
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleEpicModalSubmit}
                disabled={downloadingEpic || !epicInput.trim()}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
              >
                {downloadingEpic ? (
                  <>
                    <LoadingSmall size="sm" />
                    <span className="ml-2">Downloading...</span>
                  </>
                ) : (
                  <>
                    <span className="mr-2">⬇️</span>
                    Download
                  </>
                )}
              </button>
              <button
                onClick={() => setShowEpicModal(false)}
                disabled={downloadingEpic}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}