import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X, CheckCircle, Building, Mail, Phone, Globe } from 'lucide-react';
import { Letterhead } from '../App';

interface LetterheadCreatorProps {
  onLetterheadCreated: (letterhead: Letterhead) => void;
  selectedLetterhead: Letterhead | null;
  onLetterheadSelect: (letterhead: Letterhead | null) => void;
  existingLetterheads: Letterhead[];
}

function LetterheadCreator({
  onLetterheadCreated,
  selectedLetterhead,
  onLetterheadSelect,
  existingLetterheads
}: LetterheadCreatorProps) {
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    address: '',
    phone: '',
    email: '',
    website: '',
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.companyName) {
      const newLetterhead: Letterhead = {
        id: Date.now().toString(),
        name: formData.name || formData.companyName,
        type: 'manual',
        companyName: formData.companyName,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        website: formData.website,
        logoUrl: logoPreview || undefined,
      };
      onLetterheadCreated(newLetterhead);
      onLetterheadSelect(newLetterhead);
    }
  };

  const isFormValid = formData.companyName.trim() !== '';

  return (
    <div className="space-y-6">
      {/* Creator Form */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-xl font-semibold text-slate-800 mb-6">Buat Kop Surat Manual</h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Logo Perusahaan</label>
            {logoPreview ? (
              <div className="relative inline-block">
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="w-32 h-32 object-contain border border-slate-200 rounded-lg bg-white"
                />
                <button
                  type="button"
                  onClick={removeLogo}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-32 h-32 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-slate-400 transition-colors bg-slate-50"
              >
                <ImageIcon className="w-8 h-8 text-slate-400 mb-2" />
                <span className="text-sm text-slate-600">Upload Logo</span>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nama Template *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Contoh: Kop Resmi Perusahaan"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Building className="w-4 h-4 inline mr-1" />
                Nama Perusahaan *
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                placeholder="PT. Contoh Perusahaan"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Alamat</label>
              <textarea
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Jl. Contoh No. 123, Jakarta"
                rows={3}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Phone className="w-4 h-4 inline mr-1" />
                Nomor Telepon
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+62 21 1234 5678"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="info@contohperusahaan.com"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Globe className="w-4 h-4 inline mr-1" />
                Website
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="www.contohperusahaan.com"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!isFormValid}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Simpan Kop Surat
            </button>
          </div>
        </form>
      </div>

      {/* Preview */}
      {(formData.companyName || logoPreview) && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Preview Kop Surat</h3>
          <div className="border border-slate-200 rounded-lg p-8 bg-gray-50">
            <div className="flex items-start gap-6 mb-6">
              {logoPreview && (
                <img
                  src={logoPreview}
                  alt="Logo"
                  className="w-20 h-20 object-contain"
                />
              )}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                  {formData.companyName || 'Nama Perusahaan'}
                </h2>
                {formData.address && (
                  <p className="text-slate-600 mb-1">{formData.address}</p>
                )}
                <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                  {formData.phone && <span>Tel: {formData.phone}</span>}
                  {formData.email && <span>Email: {formData.email}</span>}
                  {formData.website && <span>Web: {formData.website}</span>}
                </div>
              </div>
            </div>
            <hr className="border-slate-300" />
          </div>
        </div>
      )}

      {/* Existing Manual Letterheads */}
      {existingLetterheads.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-slate-800 mb-4">Kop Surat Manual Tersimpan</h3>
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
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Building className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-800">{letterhead.companyName}</h4>
                    <p className="text-sm text-slate-600">Manual</p>
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

export default LetterheadCreator;