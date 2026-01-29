import { useState } from 'react';
import { createDocumentType } from '../services/adminApis';
import { toast } from 'react-toastify';

export default function AdminDocumentTypeManagement() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    typeName: '',
    description: '',
    validationRules: '',
    isRequired: true,
    maxFileSize: 5,
    allowedFormats: 'PDF,JPG,PNG',
    isActive: true
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createDocumentType(formData);

      if (response.success) {
        toast.success(response.message);
        setShowCreateModal(false);
        resetForm();
      } else {
        toast.error(response.message || 'Failed to create document type');
      }
    } catch (error) {
      console.error('Error creating document type:', error);
      toast.error('Failed to create document type');
    }
  };

  const resetForm = () => {
    setFormData({
      typeName: '',
      description: '',
      validationRules: '',
      isRequired: true,
      maxFileSize: 5,
      allowedFormats: 'PDF,JPG,PNG',
      isActive: true
    });
  };

  const documentTypeExamples = [
    {
      name: 'Aadhaar Card',
      description: 'Government issued identity proof',
      formats: 'PDF, JPG, PNG',
      maxSize: '5 MB'
    },
    {
      name: 'Voter ID Card',
      description: 'Election Commission issued voter identity card',
      formats: 'PDF, JPG, PNG',
      maxSize: '5 MB'
    },
    {
      name: 'Passport',
      description: 'Government issued passport for identity verification',
      formats: 'PDF, JPG, PNG',
      maxSize: '10 MB'
    },
    {
      name: 'Driving License',
      description: 'Government issued driving license',
      formats: 'PDF, JPG, PNG',
      maxSize: '5 MB'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Document Type Management</h1>
          <p className="text-gray-600">Configure document types and validation rules</p>
        </div>
        {/* <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create Document Type
        </button> */}
      </div>

      {/* Info Card */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center">
          <span className="text-yellow-600 text-xl mr-3">📄</span>
          <div>
            <h3 className="text-sm font-medium text-yellow-800">Document Validation Configuration</h3>
            <p className="text-sm text-yellow-700 mt-1">
              Define document types that users can upload during registration and verification processes.
              Set validation rules, file size limits, and allowed formats.
            </p>
          </div>
        </div>
      </div>

      {/* Document Type Examples */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Common Document Types</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documentTypeExamples.map((doc, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{doc.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                  <div className="mt-2 space-y-1">
                    <div className="text-xs text-gray-500">
                      <span className="font-medium">Formats:</span> {doc.formats}
                    </div>
                    <div className="text-xs text-gray-500">
                      <span className="font-medium">Max Size:</span> {doc.maxSize}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      typeName: doc.name,
                      description: doc.description,
                      allowedFormats: doc.formats.replace(/,\s*/g, ',')
                    }));
                    setShowCreateModal(true);
                  }}
                  className="ml-3 text-blue-600 hover:text-blue-800 text-sm"
                >
                  Use Template
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Configuration Guidelines */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Configuration Guidelines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">File Size Recommendations</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Identity Documents: 5 MB max</li>
              <li>• Address Proofs: 5 MB max</li>
              <li>• Certificates: 10 MB max</li>
              <li>• Photos: 2 MB max</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Supported Formats</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• PDF: For official documents</li>
              <li>• JPG/JPEG: For photos and scanned docs</li>
              <li>• PNG: For high-quality images</li>
              <li>• WEBP: For optimized web images</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Sample Document Types Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Document Types</h2>
        </div>
        <div className="p-6 text-center text-gray-500">
          <div className="text-4xl mb-4">📄</div>
          <p>Document type list will appear here after API integration</p>
          <p className="text-sm mt-2">Use the "Create Document Type" button to add new document types</p>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Create New Document Type
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Document Type Name *
                </label>
                <input
                  type="text"
                  value={formData.typeName}
                  onChange={(e) => setFormData(prev => ({ ...prev, typeName: e.target.value }))}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Aadhaar Card, Passport"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  required
                  rows={2}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the document type and its purpose"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Validation Rules
                </label>
                <textarea
                  value={formData.validationRules}
                  onChange={(e) => setFormData(prev => ({ ...prev, validationRules: e.target.value }))}
                  rows={2}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Define specific validation rules (optional)"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max File Size (MB) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={formData.maxFileSize}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxFileSize: parseInt(e.target.value) }))}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Allowed Formats *
                  </label>
                  <input
                    type="text"
                    value={formData.allowedFormats}
                    onChange={(e) => setFormData(prev => ({ ...prev, allowedFormats: e.target.value }))}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="PDF,JPG,PNG"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isRequired"
                    checked={formData.isRequired}
                    onChange={(e) => setFormData(prev => ({ ...prev, isRequired: e.target.checked }))}
                    className="mr-2"
                  />
                  <label htmlFor="isRequired" className="text-sm text-gray-700">
                    Required Document
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="mr-2"
                  />
                  <label htmlFor="isActive" className="text-sm text-gray-700">
                    Active
                  </label>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Preview</h4>
                <div className="text-sm text-gray-600">
                  <div><strong>Type:</strong> {formData.typeName || 'Document Type Name'}</div>
                  <div><strong>Max Size:</strong> {formData.maxFileSize} MB</div>
                  <div><strong>Formats:</strong> {formData.allowedFormats}</div>
                  <div><strong>Required:</strong> {formData.isRequired ? 'Yes' : 'No'}</div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Create Document Type
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}