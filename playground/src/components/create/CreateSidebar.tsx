import { useState } from "react";
import { PlaygroundTile } from "@/components/playground/PlaygroundTile";

interface CreateSidebarProps {
  connectionStatus: 'connecting' | 'connected' | 'error';
  errorMessage?: string;
  onRetry?: () => void;
  onCancel?: () => void;
}

export const CreateSidebar = ({ 
  connectionStatus, 
  errorMessage,
  onRetry,
  onCancel 
}: CreateSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-gray-950 border-r border-gray-800 transition-transform z-20 ${
        isCollapsed ? '-translate-x-full' : 'translate-x-0'
      }`} style={{ width: '256px' }}>
        <div className="p-4 h-full overflow-y-auto">
          <PlaygroundTile title="Connection / Status" className="h-auto">
            <div className="w-full space-y-4">
              {/* Connection status */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Status</span>
                  <span className={`font-medium ${
                    connectionStatus === 'connected' ? 'text-green-500' : 
                    connectionStatus === 'error' ? 'text-red-500' : 
                    'text-yellow-500'
                  }`}>
                    {connectionStatus === 'connected' ? '● Connected' :
                     connectionStatus === 'error' ? '● Error' :
                     '● Connecting...'}
                  </span>
                </div>
                
                {connectionStatus === 'connecting' && (
                  <div className="text-xs text-gray-500">
                    Setting up connection to Tricia...
                  </div>
                )}
                
                {connectionStatus === 'error' && errorMessage && (
                  <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded">
                    <p className="text-red-400 text-xs mb-3">{errorMessage}</p>
                    <div className="flex gap-2">
                      {onRetry && (
                        <button
                          onClick={onRetry}
                          className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
                        >
                          Retry
                        </button>
                      )}
                      {onCancel && (
                        <button
                          onClick={onCancel}
                          className="px-3 py-1 bg-gray-700 text-white text-xs rounded hover:bg-gray-600 transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Debug info */}
              <div className="pt-4 border-t border-gray-800 space-y-2 text-xs text-gray-500">
                <div>Room: create-session</div>
                <div>Participant: user</div>
                <div>Mode: Recording</div>
              </div>
            </div>
          </PlaygroundTile>
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`fixed top-1/2 -translate-y-1/2 bg-gray-900 border border-gray-800 rounded-r-md p-2 transition-all z-20 ${
          isCollapsed ? 'left-0' : 'left-[256px]'
        }`}
      >
        <svg 
          className={`w-4 h-4 text-gray-400 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
    </>
  );
}; 