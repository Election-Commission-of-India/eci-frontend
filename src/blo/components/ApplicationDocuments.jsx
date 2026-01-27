import { useState, useEffect } from 'react';
import { getApplicationDocuments, verifyDocument } from '../services/bloService';
import { toast } from 'react-toastify';
import LoadingSmall from '../../components/SmallLoading';
import { useNavigate, useParams } from 'react-router';

export default function ApplicationDocuments() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifyingDocId, setVerifyingDocId] = useState(null);
  const [verificationModal, setVerificationModal] = useState({ show: false, document: null });
  const [verificationData, setVerificationData] = useState({
    verificationStatus: '',
    verificationNotes: ''
  });
  const navigate = useNavigate();
  const { applicationId } = useParams();

  useEffect(() => {
    if (applicationId) {
      fetchDocuments();
    }
  }, [applicationId]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const data = await getApplicationDocuments(applicationId);
      console.log("Documents:", data);
      setDocuments(data);
    } catch (error) {
      toast.error('Failed to load documents');
      console.error('Documents error:', error);
    } finally {
      setLoading(false);
    }
  };

  const openVerificationModal = (document) => {
    setVerificationModal({ show: true, document });
    setVerificationData({
      verificationStatus: '',
      verificationNotes: ''
    });
  };

  const closeVerificationModal = () => {
    setVerificationModal({ show: false, document: null });
    setVerificationData({
      verificationStatus: '',
      verificationNotes: ''
    });
  };

  const handleVerificationSubmit = async () => {
    if (!verificationData.verificationStatus) {
      toast.error('Please select verification status');
      return;
    }

    try {
      setVerifyingDocId(verificationModal.document.documentId);
      
      const payload = {
        documentId: verificationModal.document.documentId,
        verificationStatus: verificationData.verificationStatus,
        verificationNotes: verificationData.verificationNotes
      };

      await verifyDocument(payload);
      toast.success('Document verification updated successfully');
      closeVerificationModal();
      fetchDocuments(); // Refresh the documents list
    } catch (error) {
      toast.error('Failed to update document verification');
      console.error('Verification error:', error);
    } finally {
      setVerifyingDocId(null);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getDocumentTypeColor = (type) => {
    switch (type) {
      case 'IDENTITY_PROOF': return 'bg-blue-100 text-blue-800';
      case 'ADDRESS_PROOF': return 'bg-green-100 text-green-800';
      case 'AGE_PROOF': return 'bg-yellow-100 text-yellow-800';
      case 'PHOTO': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Application Documents</h1>
              <p className="text-sm text-gray-600">View and verify uploaded documents</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/blo/applications/${applicationId}/recommend`)}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Make Recommendation
              </button>
              <button
                onClick={() => navigate(`/blo/applications/${applicationId}/details`)}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Back to Details
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSmall size="lg" />
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center p-8 text-gray-500">
            No documents found for this application
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <div key={doc.documentId} className="bg-white border rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDocumentTypeColor(doc.documentType)}`}>
                    {doc.documentType?.replace(/_/g, ' ')}
                  </span>
                  <span className="text-xs text-gray-500">
                    ID: {doc.documentId}
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{doc.fileName}</h3>
                    <p className="text-xs text-gray-600">{doc.documentSubType}</p>
                  </div>

                  <div className="text-xs text-gray-600">
                    <p>Size: {formatFileSize(doc.fileSize)}</p>
                    <p>Type: {doc.mimeType}</p>
                  </div>

                  <div className="flex gap-2 pt-3 border-t">
                    <button
                      onClick={() => {
                        // In a real app, this would open the document viewer
                        toast.info('Document viewer would open here');
                      }}
                      className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      View
                    </button>
                    <button
                      onClick={() => openVerificationModal(doc)}
                      disabled={verifyingDocId === doc.documentId}
                      className="flex-1 bg-green-600 text-white px-3 py-2 rounded-md text-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {verifyingDocId === doc.documentId ? 'Verifying...' : 'Verify'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Verification Modal */}
      {verificationModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Verify Document
            </h3>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Document: {verificationModal.document?.fileName}
              </p>
              <p className="text-sm text-gray-600">
                Type: {verificationModal.document?.documentType?.replace(/_/g, ' ')}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Status *
                </label>
                <select
                  value={verificationData.verificationStatus}
                  onChange={(e) => setVerificationData({
                    ...verificationData,
                    verificationStatus: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Status</option>
                  <option value="VERIFIED">Verified</option>
                  <option value="INVALID">Invalid</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Notes
                </label>
                <textarea
                  value={verificationData.verificationNotes}
                  onChange={(e) => setVerificationData({
                    ...verificationData,
                    verificationNotes: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Add any notes about the verification..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleVerificationSubmit}
                disabled={verifyingDocId}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {verifyingDocId ? 'Submitting...' : 'Submit Verification'}
              </button>
              <button
                onClick={closeVerificationModal}
                disabled={verifyingDocId}
                className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
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