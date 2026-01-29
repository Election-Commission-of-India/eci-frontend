import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getApplicationDocuments, downloadApplicationDocument } from '../services/bloService';
import { toast } from 'react-toastify';
import LoadingSmall from '../../components/SmallLoading';

export default function ApplicationDocuments() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingIds, setDownloadingIds] = useState(new Set());

  useEffect(() => {
    fetchDocuments();
  }, [applicationId]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const data = await getApplicationDocuments(applicationId);
      setDocuments(data || []);
    } catch (error) {
      toast.error('Failed to fetch documents');
      console.error('Documents error:', error);
      if (error.response?.status === 401) {
        navigate('/blo/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (documentId, fileName) => {
    try {
      setDownloadingIds(prev => new Set([...prev, documentId]));
      
      const response = await downloadApplicationDocument(applicationId, documentId);
      
      // Create blob and download
      const blob = new Blob([response.data], { 
        type: response.headers['content-type'] || 'application/octet-stream' 
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Use filename from response header or fallback
      const contentDisposition = response.headers['content-disposition'];
      let downloadFileName = fileName;
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (fileNameMatch) {
          downloadFileName = fileNameMatch[1];
        }
      }
      
      link.download = downloadFileName || `document_${documentId}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Document downloaded successfully');
    } catch (error) {
      toast.error('Failed to download document');
      console.error('Download error:', error);
      if (error.response?.status === 401) {
        navigate('/blo/login');
      } else if (error.response?.status === 403) {
        toast.error('You are not authorized to download this document');
      }
    } finally {
      setDownloadingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(documentId);
        return newSet;
      });
    }
  };

  const getDocumentTypeIcon = (documentType) => {
    switch (documentType?.toLowerCase()) {
      case 'photo': return '📷';
      case 'address_proof': return '🏠';
      case 'age_proof': return '📅';
      case 'identity_proof': return '🆔';
      case 'signature': return '✍️';
      default: return '📄';
    }
  };

  const getFileTypeIcon = (fileName) => {
    const extension = fileName?.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf': return '📕';
      case 'jpg':
      case 'jpeg':
      case 'png': return '🖼️';
      case 'doc':
      case 'docx': return '📘';
      default: return '📄';
    }
  };

  const getVerificationStatusColor = (status) => {
    switch (status) {
      case 'VERIFIED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSmall size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border rounded-md p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-800 flex items-center">
              <span className="mr-2">📄</span>
              Application Documents
            </h1>
            <p className="text-sm text-gray-600">
              View and download documents for Application #{applicationId}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/blo/applications/${applicationId}/details`)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center transition-colors"
            >
              <span className="mr-2">👁️</span>
              View Details
            </button>
            <button
              onClick={() => navigate('/blo/applications')}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center transition-colors"
            >
              <span className="mr-2">←</span>
              Back
            </button>
          </div>
        </div>
      </div>

      {/* Documents List */}
      <div className="bg-white border rounded-lg shadow-sm">
        <div className="bg-green-100 text-green-900 px-6 py-4 font-medium rounded-t-lg flex items-center">
          <span className="mr-2 text-xl">📁</span>
          Documents ({documents.length})
        </div>

        {documents.length === 0 ? (
          <div className="text-center p-8 text-gray-500">
            <span className="text-4xl mb-4 block">📭</span>
            No documents found for this application.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {documents.map((doc) => (
              <div key={doc.documentId} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">
                          {getDocumentTypeIcon(doc.documentType)}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {doc.documentType?.replace(/_/g, ' ').toUpperCase() || 'Document'}
                        </h3>
                        <span className="text-lg">
                          {getFileTypeIcon(doc.fileName)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {doc.fileName || 'Unknown file'}
                      </p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-gray-400">
                          Uploaded: {doc.uploadedDate ? new Date(doc.uploadedDate).toLocaleDateString() : 'Unknown'}
                        </span>
                        {doc.fileSize && (
                          <span className="text-xs text-gray-400">
                            Size: {(doc.fileSize / 1024).toFixed(1)} KB
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {/* Document Status */}
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getVerificationStatusColor(doc.verificationStatus)}`}>
                      {doc.verificationStatus || 'PENDING'}
                    </span>
                    
                    {/* Download Button */}
                    <button
                      onClick={() => handleDownload(doc.documentId, doc.fileName)}
                      disabled={downloadingIds.has(doc.documentId)}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {downloadingIds.has(doc.documentId) ? (
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
                  </div>
                </div>
                
                {/* Document Description */}
                {doc.description && (
                  <div className="mt-3 pl-16">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Description:</span> {doc.description}
                    </p>
                  </div>
                )}
                
                {/* Verification Comments */}
                {doc.verificationComments && (
                  <div className="mt-3 pl-16">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Verification Comments:</span> {doc.verificationComments}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {documents.length > 0 && (
        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Next Steps</h3>
              <p className="text-sm text-gray-600">Review documents and provide recommendation</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/blo/applications/${applicationId}/recommend`)}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center transition-colors"
              >
                <span className="mr-2">✅</span>
                Provide Recommendation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}