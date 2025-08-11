import React from 'react';
import { Download, Printer, Share, Save, Edit3, Eye } from 'lucide-react';
import { DocumentData } from '../App';
import html2pdf from 'html2pdf.js';
import InteractiveDocumentPreview from './InteractiveDocumentPreview';

interface DocumentPreviewProps {
  documentData: DocumentData;
  onSaveDocument: () => void;
  onDocumentChange?: (data: DocumentData) => void;
}

function DocumentPreview({ documentData, onSaveDocument, onDocumentChange }: DocumentPreviewProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<'preview' | 'edit'>('preview');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    
    const element = document.getElementById('document-content');
    const opt = {
      margin: 0,
      filename: `${documentData.title || 'document'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    try {
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: documentData.title,
          text: 'Dokumen yang dibuat dengan Document Generator',
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link telah disalin ke clipboard!');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-4">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Aksi Dokumen</h3>
          
          {/* View Mode Toggle */}
          <div className="mb-4">
            <div className="flex bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('preview')}
                className={`flex-1 px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-2 justify-center ${
                  viewMode === 'preview' 
                    ? 'bg-white text-slate-800 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>
              <button
                onClick={() => setViewMode('edit')}
                className={`flex-1 px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-2 justify-center ${
                  viewMode === 'edit' 
                    ? 'bg-white text-slate-800 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                <Edit3 className="w-4 h-4" />
                Edit
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <button 
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 justify-center"
            >
              <Download className="w-4 h-4" />
              {isGeneratingPDF ? 'Membuat PDF...' : 'Download PDF'}
            </button>
            
            <button 
              onClick={handlePrint}
              className="w-full bg-slate-600 hover:bg-slate-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 justify-center"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
            
            <button 
              onClick={handleShare}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 justify-center"
            >
              <Share className="w-4 h-4" />
              Share
            </button>
            
            <button 
              onClick={onSaveDocument}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 justify-center"
            >
              <Save className="w-4 h-4" />
              Simpan Dokumen
            </button>
          </div>
        </div>

        {/* Document Info */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mt-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Info Dokumen</h3>
          
          <div className="space-y-3 text-sm">
            <div>
              <span className="font-medium text-slate-700">Template:</span>
              <p className="text-slate-600">{documentData.template.name}</p>
            </div>
            
            <div>
              <span className="font-medium text-slate-700">Tanggal:</span>
              <p className="text-slate-600">{formatDate(documentData.date)}</p>
            </div>
            
            {documentData.letterhead && (
              <div>
                <span className="font-medium text-slate-700">Kop Surat:</span>
                <p className="text-slate-600">
                  {documentData.letterhead.type === 'uploaded' 
                    ? documentData.letterhead.name 
                    : documentData.letterhead.companyName}
                </p>
              </div>
            )}
            
            {documentData.documentNumber && (
              <div>
                <span className="font-medium text-slate-700">Nomor:</span>
                <p className="text-slate-600">{documentData.documentNumber}</p>
              </div>
            )}
            
            {documentData.priority && (
              <div>
                <span className="font-medium text-slate-700">Prioritas:</span>
                <p className={`text-slate-600 ${
                  documentData.priority === 'urgent' ? 'text-red-600 font-medium' :
                  documentData.priority === 'high' ? 'text-orange-600 font-medium' :
                  ''
                }`}>
                  {documentData.priority === 'low' ? 'Rendah' :
                   documentData.priority === 'normal' ? 'Normal' :
                   documentData.priority === 'high' ? 'Tinggi' :
                   'Mendesak'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Document Preview */}
      <div className="lg:col-span-3">
        {viewMode === 'edit' && onDocumentChange ? (
          <InteractiveDocumentPreview 
            documentData={documentData}
            onDocumentChange={onDocumentChange}
          />
        ) : (
          <div className="bg-white rounded-xl shadow-lg border">
            {/* A4 Paper Simulation */}
            <div id="document-content" className="p-16 bg-white">
              {/* Letterhead */}
              {documentData.letterhead && (
                <div className="mb-12">
                  {documentData.letterhead.type === 'uploaded' ? (
                    <div className="text-center">
                      <img 
                        src={documentData.letterhead.url} 
                        alt="Letterhead" 
                        className="max-h-32 mx-auto"
                      />
                    </div>
                  ) : (
                    <div className="text-center border-b-2 border-slate-300 pb-6">
                      <h2 className="text-2xl font-bold text-slate-800 mb-2">
                        {documentData.letterhead.companyName}
                      </h2>
                      <p className="text-slate-600 text-base">
                        {documentData.letterhead.address}
                      </p>
                      <p className="text-slate-600 text-base">
                        {documentData.letterhead.phone} | {documentData.letterhead.email}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Date */}
              <div className="text-right mb-8">
                <p className="text-slate-700 text-base">{formatDate(documentData.date)}</p>
              </div>
              
              {documentData.documentNumber && (
                <div className="text-right mb-4">
                  <p className="text-slate-700 text-base">No: {documentData.documentNumber}</p>
                </div>
              )}

              {documentData.template.type === 'letter' && documentData.recipient && (
                <div className="mb-8">
                  <p className="text-slate-700 text-base mb-2">Kepada:</p>
                  <div className="text-slate-800 text-base">
                    <p className="font-medium">{documentData.recipient.name}</p>
                    <p>{documentData.recipient.position}</p>
                    <p>{documentData.recipient.organization}</p>
                    <div className="whitespace-pre-line">{documentData.recipient.address}</div>
                  </div>
                </div>
              )}

              {/* Title */}
              <h1 className="text-3xl font-bold text-slate-800 mb-8 text-center">
                {documentData.title}
              </h1>
              
              {/* Priority Badge */}
              {documentData.priority && documentData.priority !== 'normal' && (
                <div className="mb-6 flex justify-center">
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                    documentData.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                    documentData.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {documentData.priority === 'high' ? 'PRIORITAS TINGGI' :
                     documentData.priority === 'urgent' ? 'MENDESAK' :
                     'PRIORITAS RENDAH'}
                  </span>
                </div>
              )}

              {/* Content */}
              <div className="text-slate-700 text-base leading-relaxed mb-12 whitespace-pre-line">
                {documentData.content}
              </div>

              {/* Signature */}
              {documentData.signature && (
                <div className="text-right">
                  <p className="text-slate-700 text-base mb-16">
                    {documentData.signature.closing}
                  </p>
                  <div>
                    <p className="text-slate-800 text-base font-medium">
                      {documentData.signature.name}
                    </p>
                    <p className="text-slate-700 text-base">
                      {documentData.signature.position}
                    </p>
                  </div>
                </div>
              )}

              {/* CC Section */}
              {documentData.cc && (
                <div className="mt-8">
                  <p className="text-slate-800 text-base mb-2"><strong>Tembusan:</strong></p>
                  <div className="text-slate-700 text-base whitespace-pre-line">
                    {documentData.cc}
                  </div>
                </div>
              )}

              {/* Footer for Invoice */}
              {documentData.template.type === 'invoice' && (
                <div className="mt-12 pt-8 border-t border-slate-200">
                  <p className="text-slate-600 text-sm text-center">
                    Terima kasih atas kepercayaan Anda
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DocumentPreview;