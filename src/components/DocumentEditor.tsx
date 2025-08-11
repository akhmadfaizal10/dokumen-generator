import React from 'react';
import { Calendar, User, FileText, MessageSquare, PenTool, Upload, Hash, MapPin, Building2, CreditCard, Users, Clock, DollarSign, Percent } from 'lucide-react';
import { DocumentData, DocumentTemplate } from '../App';

interface DocumentEditorProps {
  documentData: DocumentData;
  onDocumentChange: (data: DocumentData) => void;
  template: DocumentTemplate;
}

function DocumentEditor({ documentData, onDocumentChange, template }: DocumentEditorProps) {
  const handleFieldChange = (field: keyof DocumentData, value: string) => {
    onDocumentChange({
      ...documentData,
      [field]: value
    });
  };

  const handleSignatureImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const signatureImage = e.target?.result as string;
        onDocumentChange({
          ...documentData,
          signature: {
            ...documentData.signature,
            name: documentData.signature?.name || '',
            position: documentData.signature?.position || '',
            signatureImage
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Editor Form */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-4">
          <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Form Dokumen
          </h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <FileText className="w-4 h-4 inline mr-1" />
                Judul Dokumen *
              </label>
              <input
                type="text"
                value={documentData.title}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                placeholder="Masukkan judul dokumen"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Document Number */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Hash className="w-4 h-4 inline mr-1" />
                Nomor Dokumen
              </label>
              <input
                type="text"
                value={documentData.documentNumber || ''}
                onChange={(e) => handleFieldChange('documentNumber', e.target.value)}
                placeholder="001/DOC/2024"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Tanggal
              </label>
              <input
                type="date"
                value={documentData.date}
                onChange={(e) => handleFieldChange('date', e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {(template.type === 'letter' || template.type === 'memo') && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  {template.type === 'letter' ? 'Penerima' : 'Kepada'}
                </label>
                <input
                  type="text"
                  value={documentData.recipient || ''}
                  onChange={(e) => handleFieldChange('recipient', e.target.value)}
                  placeholder={
                    template.type === 'letter' 
                      ? "Nama penerima atau instansi"
                      : "Seluruh karyawan / Tim tertentu"
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            )}

            {template.type === 'letter' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <MessageSquare className="w-4 h-4 inline mr-1" />
                  Perihal
                </label>
                <input
                  type="text"
                  value={documentData.subject || ''}
                  onChange={(e) => handleFieldChange('subject', e.target.value)}
                  placeholder="Perihal surat"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            )}

            {/* Additional fields for different document types */}
            {template.type === 'invoice' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <CreditCard className="w-4 h-4 inline mr-1" />
                    Nomor Invoice
                  </label>
                  <input
                    type="text"
                    value={documentData.invoiceNumber || ''}
                    onChange={(e) => handleFieldChange('invoiceNumber', e.target.value)}
                    placeholder="INV-001/2024"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Jatuh Tempo
                  </label>
                  <input
                    type="date"
                    value={documentData.dueDate || ''}
                    onChange={(e) => handleFieldChange('dueDate', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <DollarSign className="w-4 h-4 inline mr-1" />
                    Total Amount
                  </label>
                  <input
                    type="number"
                    value={documentData.totalAmount || ''}
                    onChange={(e) => handleFieldChange('totalAmount', e.target.value)}
                    placeholder="0"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Percent className="w-4 h-4 inline mr-1" />
                    PPN (%)
                  </label>
                  <input
                    type="number"
                    value={documentData.taxRate || '11'}
                    onChange={(e) => handleFieldChange('taxRate', e.target.value)}
                    placeholder="11"
                    min="0"
                    max="100"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </>
            )}

            {template.type === 'report' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Users className="w-4 h-4 inline mr-1" />
                    Tim/Departemen
                  </label>
                  <input
                    type="text"
                    value={documentData.department || ''}
                    onChange={(e) => handleFieldChange('department', e.target.value)}
                    placeholder="IT Department"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Periode Laporan
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={documentData.periodStart || ''}
                      onChange={(e) => handleFieldChange('periodStart', e.target.value)}
                      className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <input
                      type="date"
                      value={documentData.periodEnd || ''}
                      onChange={(e) => handleFieldChange('periodEnd', e.target.value)}
                      className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Priority Level */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tingkat Prioritas
              </label>
              <select
                value={documentData.priority || 'normal'}
                onChange={(e) => handleFieldChange('priority', e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="low">Rendah</option>
                <option value="normal">Normal</option>
                <option value="high">Tinggi</option>
                <option value="urgent">Mendesak</option>
              </select>
            </div>

            {/* Classification */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Klasifikasi
              </label>
              <select
                value={documentData.classification || 'public'}
                onChange={(e) => handleFieldChange('classification', e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="public">Publik</option>
                <option value="internal">Internal</option>
                <option value="confidential">Rahasia</option>
                <option value="restricted">Terbatas</option>
              </select>
            </div>

            {/* Additional Recipients */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Users className="w-4 h-4 inline mr-1" />
                Tembusan (CC)
              </label>
              <textarea
                value={documentData.cc || ''}
                onChange={(e) => handleFieldChange('cc', e.target.value)}
                placeholder="Nama penerima tembusan (pisahkan dengan enter)"
                rows={3}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Lokasi
              </label>
              <input
                type="text"
                value={documentData.location || ''}
                onChange={(e) => handleFieldChange('location', e.target.value)}
                placeholder="Jakarta"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Signature Section */}
            <div className="border-t pt-6">
              <h4 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <PenTool className="w-5 h-5" />
                Tanda Tangan
              </h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nama Penandatangan
                  </label>
                  <input
                    type="text"
                    value={documentData.signature?.name || ''}
                    onChange={(e) => onDocumentChange({
                      ...documentData,
                      signature: {
                        ...documentData.signature,
                        name: e.target.value,
                        position: documentData.signature?.position || '',
                        signatureImage: documentData.signature?.signatureImage
                      }
                    })}
                    placeholder="Nama lengkap"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Jabatan
                  </label>
                  <input
                    type="text"
                    value={documentData.signature?.position || ''}
                    onChange={(e) => onDocumentChange({
                      ...documentData,
                      signature: {
                        ...documentData.signature,
                        name: documentData.signature?.name || '',
                        position: e.target.value,
                        signatureImage: documentData.signature?.signatureImage
                      }
                    })}
                    placeholder="Jabatan/posisi"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Upload Tanda Tangan (Opsional)
                  </label>
                  {documentData.signature?.signatureImage ? (
                    <div className="space-y-2">
                      <img
                        src={documentData.signature.signatureImage}
                        alt="Signature"
                        className="w-32 h-16 object-contain border border-slate-200 rounded bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => onDocumentChange({
                          ...documentData,
                          signature: {
                            ...documentData.signature,
                            signatureImage: undefined
                          }
                        })}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Hapus tanda tangan
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleSignatureImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:border-slate-400 transition-colors">
                        <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                        <p className="text-sm text-slate-600">Upload gambar tanda tangan</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Digital Signature Option */}
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={documentData.signature?.useDigitalSignature || false}
                      onChange={(e) => onDocumentChange({
                        ...documentData,
                        signature: {
                          ...documentData.signature,
                          name: documentData.signature?.name || '',
                          position: documentData.signature?.position || '',
                          signatureImage: documentData.signature?.signatureImage,
                          useDigitalSignature: e.target.checked
                        }
                      })}
                      className="rounded"
                    />
                    <span className="text-sm text-slate-700">Gunakan tanda tangan digital</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Editor */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-xl font-semibold text-slate-800 mb-6">Konten Dokumen</h3>
          
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span>Template:</span>
              <span className="font-medium text-slate-800">{template.name}</span>
            </div>

            <textarea
              value={documentData.content}
              onChange={(e) => handleFieldChange('content', e.target.value)}
              placeholder={getPlaceholderByTemplate(template)}
              rows={20}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none font-mono text-sm leading-relaxed"
              required
            />

            <div className="text-xs text-slate-500">
              {documentData.content.length} karakter
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getPlaceholderByTemplate(template: DocumentTemplate): string {
  switch (template.type) {
    case 'letter':
      return `Dengan hormat,

Bersama ini kami sampaikan...

[Tulis isi surat di sini]

Demikian surat ini kami sampaikan, atas perhatiannya kami ucapkan terima kasih.

Hormat kami,


[Nama Pengirim]
[Jabatan]`;

    case 'invoice':
      return `Invoice ini dikeluarkan untuk pembayaran jasa/produk berikut:

Item 1: Deskripsi - Rp XXX,XXX
Item 2: Deskripsi - Rp XXX,XXX

Total: Rp XXX,XXX

Metode Pembayaran:
- Transfer Bank: [Nomor Rekening]
- Batas Waktu: [Tanggal]

Terima kasih atas kepercayaan Anda.`;

    case 'report':
      return `RINGKASAN EKSEKUTIF

[Tulis ringkasan laporan]

PENDAHULUAN

[Latar belakang dan tujuan laporan]

HASIL & ANALISIS

[Temuan utama dan analisis data]

KESIMPULAN & REKOMENDASI

[Kesimpulan dan saran tindak lanjut]`;

    case 'memo':
      return `Kepada: Seluruh Tim
Dari: [Nama Pengirim]
Tanggal: ${new Date().toLocaleDateString('id-ID')}
Perihal: [Judul Memo]

Dengan ini kami sampaikan informasi sebagai berikut:

[Tulis isi memo di sini]

Informasi ini berlaku efektif mulai [tanggal].

Terima kasih atas perhatiannya.`;

    default:
      return 'Tulis konten dokumen Anda di sini...';
  }
}

export default DocumentEditor;