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

      const normalizedDocs = Array.isArray(data)
        ? data.map((d, index) => ({
          doc_id: d[0],
          document_type: d[1],
          file_path: d[2],
          verification_status: d[3] || 'PENDING',
          remarks: d[4] ?? null
        }))
        : [];

      console.log('NORMALIZED DOCUMENTS:', normalizedDocs);
      setDocuments(normalizedDocs);

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
      documentId: document.doc_id,
      documentName: document.document_type,
      verificationStatus: document.verification_status || 'PENDING',
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
    if (!verificationModal.documentId) {
      toast.error('Document ID missing');
      return;
    }

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
      fetchDocuments();
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

  const viewDocument = (filePath) => {
    if (filePath) {
      window.open(filePath, '_blank');
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
              <div key={`${document.doc_id}`} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-medium text-gray-900">
                        {document.document_type}
                      </h4>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          document.verification_status
                        )}`}
                      >
                        {document.verification_status || 'PENDING'}
                      </span>
                    </div>

                    <div className="mt-2 text-sm text-gray-600">
                      <p>File Path: {document.file_path}</p>
                      {document.remarks && (
                        <p className="mt-1">
                          <span className="font-medium">Remarks:</span> {document.remarks}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => viewDocument(document.file_path)}
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
                  onChange={(e) =>
                    setVerificationModal({
                      ...verificationModal,
                      verificationStatus: e.target.value
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Status</option>
                  {verificationStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Remarks
                </label>
                <textarea
                  rows={3}
                  value={verificationModal.remarks}
                  onChange={(e) =>
                    setVerificationModal({
                      ...verificationModal,
                      remarks: e.target.value
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleVerifyDocument}
                className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
              >
                Update Verification
              </button>
              <button
                onClick={closeVerificationModal}
                className="px-4 py-2 border rounded-md"
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
