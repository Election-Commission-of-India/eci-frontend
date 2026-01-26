import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getDocumentsByApplication, verifyDocument } from '../services/eroApis';
import { toast } from 'react-toastify';
import LoadingSmall from '../../components/SmallLoading';

export default function EroDocuments() {
  const { applicationId } = useParams();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verificationModal, setVerificationModal] = useState({
    show: false,
    documentId: null,
    documentName: '',
    verificationStatus: '',
    remarks: ''
  });
  const navigate = useNavigate();

  const verificationStatuses = ['APPROVED', 'REJECTED', 'PENDING'];

  useEffect(() => {
    if (applicationId) {
      fetchDocuments();
    }
  }, [applicationId]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const data = await getDocumentsByApplication(applicationId);
      setDocuments(data);
    } catch (error) {
      toast.error('Failed to load documents');
      console.error('Documents error:', error);
    } finally {
      setLoading(false);
    }
  };

  const openVerificationModal = (document) => {
    setVerificationModal({
      show: true,
      documentId: document.id,
      documentName: document.documentType || document.fileName,
      verificationStatus: document.verificationStatus || 'PENDING',
      remarks: document.remarks || ''
    });
  };

  const closeVerificationModal = () => {
    setVerificationModal({
      show: false,
      documentId: null,
      documentName: '',
      verificationStatus: '',
      remarks: ''
    });
  };

  const handleVerifyDocument = async () => {
    if (!verificationModal.verificationStatus) {
      toast.error('Please select verification status');
      return;
    }

    try {
      await verifyDocument(verificationModal.documentId, {
        verificationStatus: verificationModal.verificationStatus,
        remarks: verificationModal.remarks
      });
      toast.success('Document verification updated successfully');
      closeVerificationModal();
      fetchDocuments(); // Refresh the list
    } catch (error) {
      toast.error('Failed to update document verification');
      console.error('Verification error:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const viewDocument = (documentUrl) => {
    if (documentUrl) {
      window.open(documentUrl, '_blank');
    } else {
      toast.error('Document URL not available');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Document Verification</h1>
          <p className="text-sm text-gray-600">Application ID: {applicationId}</p>
        </div>
        <button
          onClick={() => navigate('/ero/applications')}
          className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
        >
          Back to Applications
        </button>
      </div>

      <div className="bg-white border rounded-md shadow-sm">
        <div className="bg-blue-100 text-blue-900 px-4 py-2 font-medium rounded-t-md">
          Documents ({documents.length})
        </div>

        {loading ? (
          <div className="flex justify-center items-center p-8">
            <LoadingSmall size="lg" />
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center p-8 text-gray-500">
            No documents found for this application.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {documents.map((document) => (
              <div key={document.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-medium text-gray-900">
                        {document.documentType || document.fileName}
                      </h4>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(document.verificationStatus)}`}>
                        {document.verificationStatus || 'PENDING'}
                      </span>
                    </div>
                    
                    <div className="mt-2 text-sm text-gray-600">
                      <p>File Name: {document.fileName}</p>
                      <p>File Size: {document.fileSize ? `${(document.fileSize / 1024).toFixed(2)} KB` : 'N/A'}</p>
                      <p>Upload Date: {document.uploadDate ? new Date(document.uploadDate).toLocaleDateString() : 'N/A'}</p>
                      {document.remarks && (
                        <p className="mt-1">
                          <span className="font-medium">Remarks:</span> {document.remarks}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => viewDocument(document.documentUrl)}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      View
                    </button>
                    <button
                      onClick={() => openVerificationModal(document)}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                    >
                      Verify
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
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Verify Document: {verificationModal.documentName}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Verification Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={verificationModal.verificationStatus}
                  onChange={(e) => setVerificationModal({
                    ...verificationModal, 
                    verificationStatus: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Status</option>
                  {verificationStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Remarks
                </label>
                <textarea
                  value={verificationModal.remarks}
                  onChange={(e) => setVerificationModal({
                    ...verificationModal, 
                    remarks: e.target.value
                  })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter verification remarks (optional)"
                />
              </div>

              {verificationModal.verificationStatus === 'REJECTED' && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm text-red-700">
                    Please provide detailed remarks explaining why the document is being rejected.
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleVerifyDocument}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              >
                Update Verification
              </button>
              <button
                onClick={closeVerificationModal}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
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