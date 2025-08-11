import React from 'react';
import { Calendar, User, FileText, MessageSquare, PenTool, Upload, Hash, MapPin, Building2, CreditCard, Users, Clock, DollarSign, Percent } from 'lucide-react';
import { DocumentData, DocumentTemplate } from '../App';

            <div className="space-y-6">
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
                  </div>
                </div>
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
            {template.type === 'letter' && (
            )}