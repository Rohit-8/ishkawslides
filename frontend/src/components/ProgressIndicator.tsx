import React from 'react';
import { GenerationProgress } from '../types';
import { Loader2, Brain, FileText, Sparkles, CheckCircle } from 'lucide-react';

interface ProgressIndicatorProps {
  progress: GenerationProgress;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ progress }) => {
  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'analyzing':
        return <Brain size={20} className="text-primary-600" />;
      case 'generating':
        return <Sparkles size={20} className="text-primary-600" />;
      case 'formatting':
        return <FileText size={20} className="text-primary-600" />;
      case 'creating':
        return <Loader2 size={20} className="text-primary-600 animate-spin" />;
      case 'complete':
        return <CheckCircle size={20} className="text-green-600" />;
      default:
        return <Loader2 size={20} className="text-primary-600 animate-spin" />;
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'complete':
        return 'bg-green-600';
      default:
        return 'bg-primary-600';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        {getStageIcon(progress.stage)}
        <div>
          <h3 className="font-medium text-gray-900">
            {progress.stage === 'complete' ? 'Complete!' : 'Generating Presentation...'}
          </h3>
          <p className="text-sm text-gray-600">{progress.message}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div
          className={`h-2 rounded-full transition-all duration-500 ease-out ${getStageColor(progress.stage)}`}
          style={{ width: `${progress.progress}%` }}
        />
      </div>

      {/* Progress Percentage */}
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-600">{progress.progress}% complete</span>
        {progress.stage !== 'complete' && (
          <div className="flex items-center gap-1 text-primary-600">
            <Loader2 size={14} className="animate-spin" />
            <span>Processing...</span>
          </div>
        )}
      </div>

      {/* Stage Indicators */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        {[
          { key: 'analyzing', label: 'Analyze', progress: 10 },
          { key: 'generating', label: 'Generate', progress: 30 },
          { key: 'formatting', label: 'Format', progress: 60 },
          { key: 'creating', label: 'Create', progress: 80 },
          { key: 'complete', label: 'Done', progress: 100 },
        ].map((stage, index) => (
          <div key={stage.key} className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
              progress.progress >= stage.progress
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-500'
            }`}>
              {index + 1}
            </div>
            <span className={`text-xs mt-1 ${
              progress.progress >= stage.progress ? 'text-primary-600' : 'text-gray-500'
            }`}>
              {stage.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};