import { useState, useEffect } from 'react';
import { 
  getVoterDetails, 
  getPollingStationDetails, 
  getPollingStationMap, 
  getPollingStationDirections,
  downloadVoterSlip 
} from '../../services/voterSearchService';
import { toast } from 'react-toastify';
import LoadingSmall from '../../components/SmallLoading';
import { useNavigate, useParams } from 'react-router';

export default function VoterDetails() {
  const [voterData, setVoterData] = useState(null);
  const [pollingStationData, setPollingStationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloadingSlip, setDownloadingSlip] = useState(false);
  const navigate = useNavigate();
  const { voterId } = useParams();

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
        Voter not found
      </div>
    );
  }

  const DetailField = ({ label, value }) => (
    <div className="border-b border-gray-200 py-3">
      <div className="flex justify-between">
        <span className="text-sm font-medium text-gray-600">{label}</span>
        <span className="text-sm text-gray-900">{value || 'N/A'}</span>
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
              <h1 className="text-2xl font-bold text-gray-900">Voter Details</h1>
              <p className="text-sm text-gray-600">Voter ID: {voterId}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleDownloadSlip}
                disabled={downloadingSlip}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {downloadingSlip ? <LoadingSmall size="sm" /> : 'Download Voter Slip'}
              </button>
              <button
                onClick={() => navigate('/voters/search')}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Back to Search
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Voter Information */}
          <div className="bg-white border rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Voter Information</h2>
            <div className="space-y-1">
              <DetailField label="Name" value={voterData.voterName} />
              <DetailField label="EPIC Number" value={voterData.epicNumber} />
              <DetailField label="Age" value={voterData.age} />
              <DetailField label="Gender" value={voterData.gender} />
              <DetailField label="House Number" value={voterData.houseNumber} />
              <DetailField label="Relative Name" value={voterData.relativeName} />
              <DetailField label="Relation Type" value={voterData.relationType} />
              <DetailField label="Address" value={voterData.address} />
            </div>
          </div>

          {/* Polling Station Information */}
          {pollingStationData && (
            <div className="bg-white border rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Polling Station Details</h2>
              <div className="space-y-1 mb-6">
                <DetailField label="Station ID" value={pollingStationData.stationId} />
                <DetailField label="Station Number" value={pollingStationData.stationNumber} />
                <DetailField label="Station Name" value={pollingStationData.stationName} />
                <DetailField label="Address" value={pollingStationData.address} />
                <DetailField label="Assembly Constituency" value={pollingStationData.assemblyConstituencyName} />
                <DetailField label="Facilities" value={pollingStationData.facilities} />
                {pollingStationData.latitude && pollingStationData.longitude && (
                  <DetailField 
                    label="Coordinates" 
                    value={`${pollingStationData.latitude}, ${pollingStationData.longitude}`} 
                  />
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleViewMap}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  View on Map
                </button>
                <button
                  onClick={handleGetDirections}
                  className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  Get Directions
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}