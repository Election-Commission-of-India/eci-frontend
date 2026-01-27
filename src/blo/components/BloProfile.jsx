import { useEffect, useState } from 'react';
import { getBloProfile } from '../services/bloService';
import LoadingSmall from '../../components/SmallLoading';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { getCurrentUserId } from '../../utils/auth';

export default function BloProfile() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const userId = getCurrentUserId();
      
      if (!userId) {
        toast.error('User ID not found. Please login again.');
        navigate('/blo/login');
        return;
      }

      const data = await getBloProfile(userId);
      console.log("Profile API data:", data);
      setProfileData(data);
    } catch (error) {
      toast.error('Failed to load profile data');
      console.error('Profile error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSmall size="lg" />
      </div>
    );
  }

  const ProfileField = ({ label, value }) => (
    <div className="border-b border-gray-200 py-3">
      <div className="flex justify-between">
        <span className="text-sm font-medium text-gray-600">{label}</span>
        <span className="text-sm text-gray-900">{value || 'N/A'}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">BLO Profile</h1>
              <p className="text-sm text-gray-600">Booth Level Officer profile information</p>
            </div>
            <button
              onClick={() => navigate('/blo/dashboard')}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white border rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-xl font-medium text-gray-700">
                {profileData?.firstName?.charAt(0) || 'B'}
              </span>
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {profileData?.fullName || 'BLO Officer'}
              </h2>
              <p className="text-sm text-gray-600">{profileData?.userRole || 'BLO'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
              <div className="space-y-1">
                <ProfileField label="User ID" value={profileData?.userId} />
                <ProfileField label="Username" value={profileData?.userName} />
                <ProfileField label="First Name" value={profileData?.firstName} />
                <ProfileField label="Last Name" value={profileData?.lastName} />
                <ProfileField label="Full Name" value={profileData?.fullName} />
                <ProfileField label="Email" value={profileData?.email} />
                <ProfileField label="Mobile" value={profileData?.mobile} />
                <ProfileField label="Role" value={profileData?.userRole} />
              </div>
            </div>

            {/* Assignment Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Assignment Details</h3>
              <div className="space-y-1">
                <ProfileField label="Assembly Constituency ID" value={profileData?.assemblyConstituencyId} />
                <ProfileField label="Assembly Constituency" value={profileData?.assemblyConstituencyName} />
                <ProfileField label="Polling Station ID" value={profileData?.pollingStationId} />
                <ProfileField label="Polling Station" value={profileData?.pollingStationName} />
                <ProfileField label="Part Number" value={profileData?.partNumber} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}