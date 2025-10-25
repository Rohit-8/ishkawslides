import React, { useState } from 'react';
import { PresentationData, SlideContent } from '../types';
import { ChevronLeft, ChevronRight, Download, Edit3, Eye, EyeOff, Presentation } from 'lucide-react';
import { downloadFile } from '../utils/helpers';

interface PresentationPreviewProps {
  presentation: PresentationData;
  filename: string;
  downloadUrl: string;
  onEdit?: (prompt: string) => void;
}

export const PresentationPreview: React.FC<PresentationPreviewProps> = ({
  presentation,
  filename,
  downloadUrl,
  onEdit
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showNotes, setShowNotes] = useState(false);
  const [editPrompt, setEditPrompt] = useState('');
  const [showEditInput, setShowEditInput] = useState(false);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % presentation.slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + presentation.slides.length) % presentation.slides.length);
  };

  const handleDownload = () => {
    downloadFile(downloadUrl, filename);
  };

  const handleEdit = () => {
    if (editPrompt.trim() && onEdit) {
      onEdit(editPrompt.trim());
      setEditPrompt('');
      setShowEditInput(false);
    }
  };

  const currentSlideData = presentation.slides[currentSlide];

  const renderSlideContent = (slide: SlideContent) => {
    const theme = presentation.theme || {};
    
    switch (slide.layout) {
      case 'title':
        return (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <h1 className="text-4xl font-bold mb-4" style={{ color: theme.primaryColor || '#1f2937' }}>
              {slide.title}
            </h1>
            {slide.content[0] && (
              <p className="text-xl" style={{ color: theme.secondaryColor || '#6b7280' }}>
                {slide.content[0]}
              </p>
            )}
          </div>
        );
      
      case 'twoColumn':
        const midpoint = Math.ceil(slide.content.length / 2);
        const leftContent = slide.content.slice(0, midpoint);
        const rightContent = slide.content.slice(midpoint);
        
        return (
          <div className="h-full p-8">
            <h2 className="text-2xl font-bold mb-6" style={{ color: theme.primaryColor || '#1f2937' }}>
              {slide.title}
            </h2>
            <div className="grid grid-cols-2 gap-8 h-full">
              <div>
                {leftContent.map((item, index) => (
                  <div key={index} className="flex items-start gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" 
                         style={{ backgroundColor: theme.secondaryColor || '#3b82f6' }} />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
              <div>
                {rightContent.map((item, index) => (
                  <div key={index} className="flex items-start gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" 
                         style={{ backgroundColor: theme.secondaryColor || '#3b82f6' }} />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="h-full p-8">
            <h2 className="text-2xl font-bold mb-6" style={{ color: theme.primaryColor || '#1f2937' }}>
              {slide.title}
            </h2>
            <div className="space-y-3">
              {slide.content.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" 
                       style={{ backgroundColor: theme.secondaryColor || '#3b82f6' }} />
                  <span className="text-gray-700 leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm animate-fade-in">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">{presentation.title}</h3>
            {presentation.subtitle && (
              <p className="text-sm text-gray-600">{presentation.subtitle}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowNotes(!showNotes)}
              className={`p-2 rounded-lg transition-colors ${
                showNotes ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={showNotes ? 'Hide notes' : 'Show notes'}
            >
              {showNotes ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            <button
              onClick={() => setShowEditInput(!showEditInput)}
              className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              title="Edit presentation"
            >
              <Edit3 size={18} />
            </button>
            <button
              onClick={handleDownload}
              className="btn-primary flex items-center gap-2"
            >
              <Download size={18} />
              Download
            </button>
          </div>
        </div>

        {/* Edit Input */}
        {showEditInput && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <textarea
              value={editPrompt}
              onChange={(e) => setEditPrompt(e.target.value)}
              placeholder="Describe what you'd like to change..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              rows={2}
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => setShowEditInput(false)}
                className="btn-secondary text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleEdit}
                disabled={!editPrompt.trim()}
                className="btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Apply Changes
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Slide Preview */}
      <div className="relative">
        {/* Slide Content */}
        <div 
          className="aspect-video bg-white border-l border-r border-gray-200"
          style={{ backgroundColor: presentation.theme?.backgroundColor || '#ffffff' }}
        >
          {renderSlideContent(currentSlideData)}
        </div>

        {/* Navigation */}
        <button
          onClick={prevSlide}
          disabled={presentation.slides.length <= 1}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={20} />
        </button>
        
        <button
          onClick={nextSlide}
          disabled={presentation.slides.length <= 1}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight size={20} />
        </button>

        {/* Slide Counter */}
        <div className="absolute bottom-4 right-4 bg-black/75 text-white px-3 py-1 rounded-full text-sm">
          {currentSlide + 1} / {presentation.slides.length}
        </div>
      </div>

      {/* Speaker Notes */}
      {showNotes && currentSlideData.notes && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <h4 className="font-medium text-gray-900 mb-2">Speaker Notes</h4>
          <p className="text-sm text-gray-600 leading-relaxed">{currentSlideData.notes}</p>
        </div>
      )}

      {/* Slide Thumbnails */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {presentation.slides.map((slide, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`flex-shrink-0 w-24 h-16 border-2 rounded transition-all ${
                index === currentSlide
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 bg-gray-50 hover:border-gray-300'
              }`}
            >
              <div className="w-full h-full flex items-center justify-center p-2">
                <div className="text-xs text-center">
                  <div className="font-medium truncate">{slide.title}</div>
                  <div className="text-gray-500">{index + 1}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};