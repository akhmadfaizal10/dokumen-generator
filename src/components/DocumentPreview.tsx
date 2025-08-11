@@ .. @@
 import React from 'react';
-import { Download, Printer, Share, Save } from 'lucide-react';
+import { Download, Printer, Share, Save, Edit3, Eye } from 'lucide-react';
 import { DocumentData } from '../App';
 import html2pdf from 'html2pdf.js';
+import InteractiveDocumentPreview from './InteractiveDocumentPreview';

 interface DocumentPreviewProps {
   documentData: DocumentData;
   onSaveDocument: () => void;
+  onDocumentChange?: (data: DocumentData) => void;
 }

-function DocumentPreview({ documentData, onSaveDocument }: DocumentPreviewProps) {
+function DocumentPreview({ documentData, onSaveDocument, onDocumentChange }: DocumentPreviewProps) {
   const [isGeneratingPDF, setIsGeneratingPDF] = React.useState(false);
+  const [viewMode, setViewMode] = React.useState<'preview' | 'edit'>('preview');

   const formatDate = (dateString: string) => {
@@ .. @@
         <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-4">
           <h3 className="text-lg font-semibold text-slate-800 mb-4">Aksi Dokumen</h3>
           
+          {/* View Mode Toggle */}
+          <div className="mb-4">
+            <div className="flex bg-slate-100 rounded-lg p-1">
+              <button
+                onClick={() => setViewMode('preview')}
+                className={`flex-1 px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-2 justify-center ${
+                  viewMode === 'preview' 
+                    ? 'bg-white text-slate-800 shadow-sm' 
+                    : 'text-slate-600 hover:text-slate-800'
+                }`}
+              >
+                <Eye className="w-4 h-4" />
+                Preview
+              </button>
+              <button
+                onClick={() => setViewMode('edit')}
+                className={`flex-1 px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-2 justify-center ${
+                  viewMode === 'edit' 
+                    ? 'bg-white text-slate-800 shadow-sm' 
+                    : 'text-slate-600 hover:text-slate-800'
+                }`}
+              >
+                <Edit3 className="w-4 h-4" />
+                Edit
+              </button>
+            </div>
+          </div>
+
           <div className="space-y-3">
             <button 
               onClick={handleDownloadPDF}
@@ .. @@
               {documentData.letterhead.type === 'uploaded' 
                 ? documentData.letterhead.name 
                 : documentData.letterhead.companyName}
+            </p>
+          </div>
+        )}
+        
+        {documentData.documentNumber && (
+          <div>
+            <span className="font-medium text-slate-700">Nomor:</span>
+            <p className="text-slate-600">{documentData.documentNumber}</p>
+          </div>
+        )}
+        
+        {documentData.priority && (
+          <div>
+            <span className="font-medium text-slate-700">Prioritas:</span>
+            <p className={`text-slate-600 ${
+              documentData.priority === 'urgent' ? 'text-red-600 font-medium' :
+              documentData.priority === 'high' ? 'text-orange-600 font-medium' :
+              ''
+            }`}>
+              {documentData.priority === 'low' ? 'Rendah' :
+               documentData.priority === 'normal' ? 'Normal' :
+               documentData.priority === 'high' ? 'Tinggi' :
+               'Mendesak'}
             </p>
           </div>
         )}
@@ .. @@
       {/* Document Preview */}
       <div className="lg:col-span-3">
-        <div className="bg-white rounded-xl shadow-lg border">
+        {viewMode === 'edit' && onDocumentChange ? (
+          <InteractiveDocumentPreview 
+            documentData={documentData}
+            onDocumentChange={onDocumentChange}
+          />
+        ) : (
+          <div className="bg-white rounded-xl shadow-lg border">
           {/* A4 Paper Simulation */}
 <div id="document-content" className="p-16 bg-white">
             {/* Letterhead */}
@@ .. @@
               <div className="text-right mb-8">
                 <p className="text-slate-700 text-base">{formatDate(documentData.date)}</p>
               </div>
+              
+              {documentData.documentNumber && (
+                <div className="text-right mb-4">
+                  <p className="text-slate-700 text-base">No: {documentData.documentNumber}</p>
+                </div>
+              )}

               {documentData.template.type === 'letter' && documentData.recipient && (
@@ .. @@
               <h1 className="text-3xl font-bold text-slate-800 mb-8 text-center">
                 {documentData.title}
               </h1>
+              
+              {/* Priority Badge */}
+              {documentData.priority && documentData.priority !== 'normal' && (
+                <div className="mb-6 flex justify-center">
+                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${
+                    documentData.priority === 'urgent' ? 'bg-red-100 text-red-800' :
+                    documentData.priority === 'high' ? 'bg-orange-100 text-orange-800' :
+                    'bg-blue-100 text-blue-800'
+                  }`}>
+                    {documentData.priority === 'high' ? 'PRIORITAS TINGGI' :
+                     documentData.priority === 'urgent' ? 'MENDESAK' :
+                     'PRIORITAS RENDAH'}
+                  </span>
+                </div>
+              )}
             </div>

@@ .. @@
               </div>
             )}

+            {/* CC Section */}
+            {documentData.cc && (
+              <div className="mt-8">
+                <p className="text-slate-800 text-base mb-2"><strong>Tembusan:</strong></p>
+                <div className="text-slate-700 text-base whitespace-pre-line">
+                  {documentData.cc}
+                </div>
+              </div>
+            )}
+
             {/* Footer for Invoice */}
             {documentData.template.type === 'invoice' && (
@@ .. @@
             )}
           </div>
         </div>
+        )}
       </div>
     </div>
   );