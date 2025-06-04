import { ReactNode } from "react";

interface ReelPreviewCanvasProps {
  children: ReactNode;
  recordingState: 'idle' | 'recording' | 'processing' | 'ready';
  duration?: string;
}

export const ReelPreviewCanvas = ({ 
  children, 
  recordingState,
  duration 
}: ReelPreviewCanvasProps) => {
  return (
    <div className="relative w-full h-full bg-gray-900 rounded-sm overflow-hidden">
      {/* Main content */}
      {children}
      
      {/* Duration timer in lower-right corner */}
      {recordingState === 'recording' && duration && (
        <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-md">
          <span className="text-white text-sm font-mono">{duration}</span>
        </div>
      )}
    </div>
  );
}; 