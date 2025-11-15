import React, { useState } from 'react';
import { Card } from './ui/card';
import { Alert } from './ui/alert';
import { 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  FileText,
  X,
  Download
} from 'lucide-react';
import axios from 'axios';

const CMCImport = ({ onImportSuccess }) => {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.name.endsWith('.csv')) {
      setFile(droppedFile);
      setError(null);
    } else {
      setError('Please upload a CSV file');
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.name.endsWith('.csv')) {
      setFile(selectedFile);
      setError(null);
    } else {
      setError('Please upload a CSV file');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setUploading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Replace with your actual portfolio ID
      const portfolioId = '23f6a3f8-efaa-444a-a1d8-3d9acae9cfef'; //Test portfolio
      
      const response = await axios.post(
        `https://lucid-abundance-production.up.railway.app/api/v1/portfolios/${portfolioId}/import/cmc-csv`,`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setResult(response.data);
      if (onImportSuccess) {
        onImportSuccess(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to import CSV');
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card className="p-6 bg-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Import from CMC Markets</h2>
            <p className="text-sm text-gray-600 mt-1">
              Upload your CMC Markets holdings CSV export
            </p>
          </div>
          <Download className="w-8 h-8 text-blue-600" />
        </div>

        <Alert className="mb-4 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-gray-900">How to export from CMC:</p>
              <ol className="text-sm text-gray-700 mt-2 space-y-1 list-decimal list-inside">
                <li>Open CMC Markets app</li>
                <li>Go to Holdings/Portfolio</li>
                <li>Click Export or Download</li>
                <li>Save as CSV and upload here</li>
              </ol>
            </div>
          </div>
        </Alert>

        {!result && (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
              dragging
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-blue-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className={`w-16 h-16 mx-auto mb-4 ${
              dragging ? 'text-blue-600' : 'text-gray-400'
            }`} />
            
            {file ? (
              <div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <FileText className="w-5 h-5 text-green-600" />
                  <p className="text-sm font-semibold text-gray-900">{file.name}</p>
                  <button
                    onClick={handleReset}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-lg font-semibold text-gray-900 mb-2">
                  Drag & drop your CSV here
                </p>
                <p className="text-sm text-gray-600 mb-4">or</p>
                <label className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
                  Browse Files
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>
        )}

        {error && (
          <Alert className="mt-4 bg-red-50 border-red-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <p className="text-sm text-red-900">{error}</p>
            </div>
          </Alert>
        )}

        {file && !result && (
          <div className="mt-6 flex gap-3">
            <button
              onClick={handleUpload}
              disabled={uploading}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${
                uploading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {uploading ? 'Importing...' : 'Import Holdings'}
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        )}

        {result && result.success && (
          <div className="mt-6">
            <Alert className="bg-green-50 border-green-200">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-green-900">
                    {result.message}
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    Imported {result.imported_count} holdings
                  </p>
                </div>
              </div>
            </Alert>

            <div className="flex gap-3 mt-4">
              <button
                onClick={handleReset}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
              >
                Import Another File
              </button>
              <button
                onClick={() => window.location.href = '/portfolio-dashboard'}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
              >
                View Portfolio
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default CMCImport;
