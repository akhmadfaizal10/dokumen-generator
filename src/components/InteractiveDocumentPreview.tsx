import React, { useState, useRef, useEffect } from 'react';
import { Move, RotateCw, Trash2, Edit3, Type, Image as ImageIcon } from 'lucide-react';
import { DocumentData } from '../App';

interface DraggableElement {
  id: string;
  type: 'text' | 'image' | 'signature';
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize?: number;
  fontWeight?: string;
  color?: string;
  rotation?: number;
}

interface InteractiveDocumentPreviewProps {
  documentData: DocumentData;
  onDocumentChange: (data: DocumentData) => void;
}

function InteractiveDocumentPreview({ documentData, onDocumentChange }: InteractiveDocumentPreviewProps) {
  const [elements, setElements] = useState<DraggableElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showTextEditor, setShowTextEditor] = useState(false);
  const [newText, setNewText] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize elements from document data
  useEffect(() => {
    const initialElements: DraggableElement[] = [];
    
    // Add title as draggable element
    if (documentData.title) {
      initialElements.push({
        id: 'title',
        type: 'text',
        content: documentData.title,
        x: 50,
        y: 100,
        width: 400,
        height: 40,
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1e293b'
      });
    }

    // Add signature as draggable element
    if (documentData.signature?.signatureImage) {
      initialElements.push({
        id: 'signature',
        type: 'signature',
        content: documentData.signature.signatureImage,
        x: 400,
        y: 500,
        width: 150,
        height: 75
      });
    }

    setElements(initialElements);
  }, [documentData]);

  const handleMouseDown = (e: React.MouseEvent, elementId: string) => {
    e.preventDefault();
    setSelectedElement(elementId);
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedElement) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    setElements(prev => prev.map(el => 
      el.id === selectedElement 
        ? { ...el, x: Math.max(0, el.x + deltaX), y: Math.max(0, el.y + deltaY) }
        : el
    ));

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  const handleResize = (elementId: string, direction: string, deltaX: number, deltaY: number) => {
    setElements(prev => prev.map(el => {
      if (el.id !== elementId) return el;
      
      let newWidth = el.width;
      let newHeight = el.height;
      let newX = el.x;
      let newY = el.y;

      switch (direction) {
        case 'se': // Southeast
          newWidth = Math.max(50, el.width + deltaX);
          newHeight = Math.max(20, el.height + deltaY);
          break;
        case 'sw': // Southwest
          newWidth = Math.max(50, el.width - deltaX);
          newHeight = Math.max(20, el.height + deltaY);
          newX = el.x + deltaX;
          break;
        case 'ne': // Northeast
          newWidth = Math.max(50, el.width + deltaX);
          newHeight = Math.max(20, el.height - deltaY);
          newY = el.y + deltaY;
          break;
        case 'nw': // Northwest
          newWidth = Math.max(50, el.width - deltaX);
          newHeight = Math.max(20, el.height - deltaY);
          newX = el.x + deltaX;
          newY = el.y + deltaY;
          break;
      }

      return { ...el, width: newWidth, height: newHeight, x: newX, y: newY };
    }));
  };

  const addTextElement = () => {
    if (!newText.trim()) return;
    
    const newElement: DraggableElement = {
      id: `text-${Date.now()}`,
      type: 'text',
      content: newText,
      x: 100,
      y: 200,
      width: 200,
      height: 30,
      fontSize: 16,
      color: '#1e293b'
    };

    setElements(prev => [...prev, newElement]);
    setNewText('');
    setShowTextEditor(false);
  };

  const deleteElement = (elementId: string) => {
    setElements(prev => prev.filter(el => el.id !== elementId));
    setSelectedElement(null);
  };

  const rotateElement = (elementId: string) => {
    setElements(prev => prev.map(el => 
      el.id === elementId 
        ? { ...el, rotation: (el.rotation || 0) + 90 }
        : el
    ));
  };

  const updateElementStyle = (elementId: string, property: string, value: any) => {
    setElements(prev => prev.map(el => 
      el.id === elementId 
        ? { ...el, [property]: value }
        : el
    ));
  };

  const selectedElementData = elements.find(el => el.id === selectedElement);

  return (
    <div className="bg-white rounded-xl shadow-sm border">
      {/* Toolbar */}
      <div className="p-4 border-b border-slate-200 flex items-center gap-4">
        <button
          onClick={() => setShowTextEditor(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <Type className="w-4 h-4" />
          Tambah Teks
        </button>
        
        {selectedElement && (
          <>
            <button
              onClick={() => rotateElement(selectedElement)}
              className="px-3 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors"
            >
              <RotateCw className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => deleteElement(selectedElement)}
              className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Style Panel */}
      {selectedElementData && (
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <h4 className="font-medium text-slate-800 mb-3">Style Element</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {selectedElementData.type === 'text' && (
              <>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Font Size</label>
                  <input
                    type="number"
                    value={selectedElementData.fontSize || 16}
                    onChange={(e) => updateElementStyle(selectedElement!, 'fontSize', parseInt(e.target.value))}
                    className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                    min="8"
                    max="72"
                  />
                </div>
                
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Color</label>
                  <input
                    type="color"
                    value={selectedElementData.color || '#1e293b'}
                    onChange={(e) => updateElementStyle(selectedElement!, 'color', e.target.value)}
                    className="w-full h-8 border border-slate-300 rounded"
                  />
                </div>
                
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Weight</label>
                  <select
                    value={selectedElementData.fontWeight || 'normal'}
                    onChange={(e) => updateElementStyle(selectedElement!, 'fontWeight', e.target.value)}
                    className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                  >
                    <option value="normal">Normal</option>
                    <option value="bold">Bold</option>
                    <option value="lighter">Light</option>
                  </select>
                </div>
              </>
            )}
            
            <div>
              <label className="block text-xs text-slate-600 mb-1">Rotation</label>
              <input
                type="number"
                value={selectedElementData.rotation || 0}
                onChange={(e) => updateElementStyle(selectedElement!, 'rotation', parseInt(e.target.value))}
                className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                min="0"
                max="360"
                step="15"
              />
            </div>
          </div>
        </div>
      )}

      {/* Canvas */}
      <div
        ref={containerRef}
        className="relative bg-white min-h-[800px] overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Letterhead */}
        {documentData.letterhead && documentData.letterhead.type === 'manual' && (
          <div className="absolute top-4 left-4 right-4 pb-6 border-b-2 border-slate-300">
            <div className="flex items-start gap-6">
              {documentData.letterhead.logoUrl && (
                <img
                  src={documentData.letterhead.logoUrl}
                  alt="Logo"
                  className="w-20 h-20 object-contain"
                />
              )}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                  {documentData.letterhead.companyName}
                </h2>
                {documentData.letterhead.address && (
                  <p className="text-slate-600 mb-1">{documentData.letterhead.address}</p>
                )}
                <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                  {documentData.letterhead.phone && <span>Tel: {documentData.letterhead.phone}</span>}
                  {documentData.letterhead.email && <span>Email: {documentData.letterhead.email}</span>}
                  {documentData.letterhead.website && <span>Web: {documentData.letterhead.website}</span>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Draggable Elements */}
        {elements.map((element) => (
          <div
            key={element.id}
            className={`absolute cursor-move select-none ${
              selectedElement === element.id ? 'ring-2 ring-blue-500' : ''
            }`}
            style={{
              left: element.x,
              top: element.y,
              width: element.width,
              height: element.height,
              transform: `rotate(${element.rotation || 0}deg)`,
            }}
            onMouseDown={(e) => handleMouseDown(e, element.id)}
          >
            {element.type === 'text' && (
              <div
                className="w-full h-full flex items-center justify-start p-2 bg-transparent"
                style={{
                  fontSize: element.fontSize,
                  fontWeight: element.fontWeight,
                  color: element.color,
                }}
              >
                {element.content}
              </div>
            )}
            
            {element.type === 'signature' && (
              <img
                src={element.content}
                alt="Signature"
                className="w-full h-full object-contain"
                draggable={false}
              />
            )}

            {/* Resize Handles */}
            {selectedElement === element.id && (
              <>
                {['nw', 'ne', 'sw', 'se'].map((direction) => (
                  <div
                    key={direction}
                    className={`absolute w-3 h-3 bg-blue-500 border border-white cursor-${direction}-resize ${
                      direction === 'nw' ? '-top-1 -left-1' :
                      direction === 'ne' ? '-top-1 -right-1' :
                      direction === 'sw' ? '-bottom-1 -left-1' :
                      '-bottom-1 -right-1'
                    }`}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      setIsResizing(true);
                      setDragStart({ x: e.clientX, y: e.clientY });
                    }}
                  />
                ))}
              </>
            )}
          </div>
        ))}

        {/* Document Content Background */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="p-16">
            <div className="mt-32 mb-10">
              <div className="text-right mb-8">
                <p className="text-slate-700">{new Date(documentData.date).toLocaleDateString('id-ID')}</p>
              </div>
              <div className="mb-12">
                <div className="text-slate-800 leading-relaxed whitespace-pre-wrap text-justify">
                  {documentData.content}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Text Editor Modal */}
      {showTextEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Tambah Teks</h3>
            <textarea
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="Masukkan teks..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg mb-4"
              rows={4}
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowTextEditor(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800"
              >
                Batal
              </button>
              <button
                onClick={addTextElement}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Tambah
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InteractiveDocumentPreview;