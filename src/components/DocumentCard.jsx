 export default function DocumentCard({ document, isDownloading, onDownload }) {
  const getFileIcon = (fileName) => {
    const extension = fileName?.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return { icon: '📄', color: 'text-red-600', bg: 'bg-red-50' };
      case 'jpg':
      case 'jpeg':
      case 'png':
        return { icon: '🖼️', color: 'text-blue-600', bg: 'bg-blue-50' };
      case 'doc':
      case 'docx':
        return { icon: '📝', color: 'text-blue-600', bg: 'bg-blue-50' };
      default:
        return { icon: '📎', color: 'text-gray-600', bg: 'bg-gray-50' };
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown size';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const documentId = document.attachmentId || document.id;
  const fileName = document.fileName || 'document';
  const fileSize = document.fileSize;
  const documentType = document.documentType || 'Document';
  const uploadedBy = document.uploadedByName;
//   const uploadedDate = document.createdAt;

  const fileStyle = getFileIcon(fileName);

  return (
    <div className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {/* File Icon */}
        <div className={`${fileStyle.bg} ${fileStyle.color} text-3xl p-3 rounded-lg`}>
          {fileStyle.icon}
        </div>
        
        {/* File Info */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 truncate text-lg">{fileName}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mt-1">
            <span className="font-medium">{documentType}</span>
            {fileSize && (
              <>
                <span>•</span>
                <span>{formatFileSize(fileSize)}</span>
              </>
            )}
            {uploadedBy && (
              <>
                <span>•</span>
                <span>Uploaded by {uploadedBy}</span>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Download Button */}
      <button
        onClick={() => onDownload(documentId, fileName)}
        disabled={isDownloading}
        className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all flex items-center gap-2 font-medium shadow-sm hover:shadow-md"
      >
        {isDownloading ? (
          <>
            <LoadingSmall size="sm" />
            <span>Downloading...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Download</span>
          </>
        )}
      </button>
    </div>
  );
}
