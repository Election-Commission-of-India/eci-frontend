import { useState } from 'react';
import { downloadEpicCard, validateEpicNumber } from '../services/epicDownloadService';
import { toast } from 'react-toastify';
import LoadingSmall from './SmallLoading';

export default function EpicDownload() {
  const [epicNumber, setEpicNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (!epicNumber.trim()) {
      toast.error('Please enter EPIC number');
      return;
    }

    try {
      setLoading(true);
      
      // Validate EPIC number first
      const isValid = await validateEpicNumber(epicNumber.trim());
      if (!isValid) {
        toast.error('Invalid EPIC number');
        return;
      }

      // Download EPIC card
      await downloadEpicCard(epicNumber.trim());
      toast.success('EPIC card downloaded successfully');
      setEpicNumber('');
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error('EPIC number not found');
      } else {
        toast.error('Failed to download EPIC card');
      }
      console.error('EPIC download error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border rounded-lg shadow-sm p-6">
      <div className="flex items-center mb-4">
        <div className="bg-blue-600 rounded-lg p-3 mr-4">
          <span className="text-white text-2xl">🆔</span>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Download EPIC Card</h2>
          <p className="text-sm text-gray-600">Enter your EPIC number to download your voter ID card</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            EPIC Number
          </label>
          <input
            type="text"
            value={epicNumber}
            onChange={(e) => setEpicNumber(e.target.value.toUpperCase())}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your EPIC number (e.g., ABC1234567)"
            maxLength={10}
          />
        </div>

        <button
          onClick={handleDownload}
          disabled={loading || !epicNumber.trim()}
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
        >
          {loading ? (
            <>
              <LoadingSmall size="sm" />
              <span className="ml-2">Downloading...</span>
            </>
          ) : (
            <>
              <span className="mr-2">📥</span>
              Download EPIC Card
            </>
          )}
        </button>
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-700">
          <span className="font-medium">Note:</span> The downloaded EPIC card will contain your name, EPIC number, date of birth, gender, and address details in PDF format.
        </p>
      </div>
    </div>
  );
}