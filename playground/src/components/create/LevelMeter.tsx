import { BarVisualizer, TrackReferenceOrPlaceholder } from "@livekit/components-react";

interface LevelMeterProps {
  who: 'user' | 'agent';
  trackRef?: TrackReferenceOrPlaceholder;
  label?: string;
  state?: 'listening' | 'speaking' | 'thinking' | 'idle';
}

export const LevelMeter = ({ who, trackRef, label, state = 'idle' }: LevelMeterProps) => {
  const isAgent = who === 'agent';
  
  // Map state to Tailwind color classes
  const getBarColor = () => {
    if (isAgent) {
      switch (state) {
        case 'speaking': return 'text-cyan-400';
        case 'thinking': return 'text-cyan-600';
        case 'listening': return 'text-cyan-500';
        default: return 'text-cyan-500';
      }
    } else {
      switch (state) {
        case 'speaking': return 'text-green-400';
        case 'listening': return 'text-green-500';
        default: return 'text-green-500';
      }
    }
  };
  
  const icon = isAgent ? (
    // Agent icon (eye)
    <svg className="w-6 h-6 text-cyan-500" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
    </svg>
  ) : (
    // User icon (person)
    <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
  );

  return (
    <div className="flex items-center gap-3">
      {/* Icon */}
      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
        isAgent ? 'bg-cyan-500/20' : 'bg-green-500/20'
      }`}>
        {icon}
      </div>
      
      {/* Label */}
      {label && (
        <span className="text-sm text-gray-400 min-w-[60px]">{label}</span>
      )}
      
      {/* Visualizer - using canonical BarVisualizer */}
      <div className="w-32 h-8 overflow-hidden">
        {trackRef ? (
          <BarVisualizer
            trackRef={trackRef}
            className={`h-full w-full ${getBarColor()}`}
            barCount={15}
            options={{ minHeight: 0 }}
          />
        ) : (
          // Fallback when no track available
          <div className="h-full w-full bg-gray-800 rounded-sm" />
        )}
      </div>
    </div>
  );
}; 