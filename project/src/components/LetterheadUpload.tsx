import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, CheckCircle } from 'lucide-react';
import { Letterhead } from '../App';

interface LetterheadUploadProps {
  onLetterheadCreated: (letterhead: Letterhead) => void;
  selectedLetterhead: Letterhead | null;
  onLetterheadSelect: (letterhead: Letterhead | null) => void;
  existingLetterheads: Letterhead[];
}

function LetterheadUpload({
  onLetterheadCreated,
  selectedLetterhead,
  onLetterheadSelect,
  existingLetterheads
}: LetterheadUploadProps) {
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
      setUploadProgress(0);

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev === null) return 0;
          if (prev >= 100) {
            clearInterval(interval);
            // Create letterhead object
            const newLetterhead: Letterhead = {
              id: Date.now().toString(),
              name: file.name.replace('.pdf', ''),
              type: 'uploaded',
              pdfUrl: URL.createObjectURL(file),
            };
            onLetterheadCreated(newLetterhead);
            onLetterheadSelect(newLetterhead);
            setUploadProgress(null);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
  }, [onLetterheadCreated, onLetterheadSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });

  const removeFile = () => {
    setUploadedFile(null);
    setUploadProgress(null);
    onLetterheadSelect(null);
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : uploadedFile
            ? 'border-emerald-500 bg-emerald-50'
            : 'border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50'
        }`}
      >
        <input {...getInputProps()} />
        
        {uploadProgress !== null ? (
          <div className="space-y-4">
            <Upload className="w-12 h-12 text-blue-500 mx-auto animate-pulse" />
            <div>
              <p className="text-lg font-medium text-slate-800">Mengupload...</p>
              <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-slate-600 mt-1">{uploadProgress}%</p>
            </div>
          </div>
        ) : uploadedFile ? (
          <div className="space-y-4">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
            <div>
              <p className="text-lg font-medium text-slate-800">File berhasil diupload!</p>
              <p className="text-slate-600">{uploadedFile.name}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeFile();
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors inline-flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Hapus File
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className="w-12 h-12 text-slate-400 mx-auto" />
            <div>
              <p className="text-lg font-medium text-slate-800">
                {isDragActive ? 'Drop file PDF di sini...' : 'Upload Kop Surat PDF'}
              </p>
              <p className="text-slate-600">
                Drag & drop file PDF atau klik untuk memilih file
              </p>
              <p className="text-sm text-slate-500 mt-2">
                Maksimal ukuran file: 10MB • Format: PDF
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Existing Letterheads */}
      {existingLetterheads.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-slate-800 mb-4">Kop Surat Tersimpan</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {existingLetterheads.map((letterhead) => (
              <div
                key={letterhead.id}
                onClick={() => onLetterheadSelect(letterhead)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  selectedLetterhead?.id === letterhead.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <FileText className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-800">{letterhead.name}</h4>
                    <p className="text-sm text-slate-600">PDF Upload</p>
                  </div>
                  {selectedLetterhead?.id === letterhead.id && (
                    <CheckCircle className="w-5 h-5 text-blue-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default LetterheadUpload;