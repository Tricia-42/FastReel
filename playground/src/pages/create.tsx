import { AnimatePresence, motion } from "framer-motion";
import { Inter } from "next/font/google";
import Head from "next/head";
import { useCallback, useState, useEffect, useRef } from "react";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import { useRouter } from "next/router";

import { PlaygroundToast } from "@/components/toast/PlaygroundToast";
import { ConfigProvider, useConfig } from "@/hooks/useConfig";
import { ConnectionProvider, useConnection } from "@/hooks/useConnection";
import { ToastProvider, useToast } from "@/components/toast/ToasterProvider";
import { PlaygroundTile } from "@/components/playground/PlaygroundTile";
import { CreateSidebar } from "@/components/create/CreateSidebar";
import { ReelPreviewCanvas } from "@/components/create/ReelPreviewCanvas";
import { LevelMeter } from "@/components/create/LevelMeter";
import { 
  LiveKitRoom,
  useLocalParticipant, 
  useTracks, 
  useVoiceAssistant,
  useConnectionState,
  AudioTrack
} from "@livekit/components-react";
import { Track, ConnectionState } from "livekit-client";

const inter = Inter({ subsets: ["latin"] });

export default function CreatePage() {
  return (
    <ToastProvider>
      <ConnectionProvider>
        <ConfigProvider>
          <CreatePageWrapper />
        </ConfigProvider>
      </ConnectionProvider>
    </ToastProvider>
  );
}

function CreatePageWrapper() {
  const { shouldConnect, wsUrl, token } = useConnection();
  
  // Only render LiveKitRoom when we have connection details
  if (shouldConnect && wsUrl && token) {
    return (
      <LiveKitRoom
        serverUrl={wsUrl}
        token={token}
        connect={true}
        audio={true}
        video={true}
      >
        <CreateInnerWithLiveKit />
      </LiveKitRoom>
    );
  }
  
  // Render without LiveKit context when not connected
  return <CreateInnerWithoutLiveKit />;
}

// Component with LiveKit hooks
function CreateInnerWithLiveKit() {
  // LiveKit hooks
  const roomState = useConnectionState();
  const { localParticipant } = useLocalParticipant();
  const voiceAssistant = useVoiceAssistant();
  const tracks = useTracks();
  
  return (
    <CreateInnerBase
      roomState={roomState}
      localParticipant={localParticipant}
      voiceAssistant={voiceAssistant}
      tracks={tracks}
    />
  );
}

// Component without LiveKit hooks
function CreateInnerWithoutLiveKit() {
  return (
    <CreateInnerBase
      roomState={ConnectionState.Disconnected}
      localParticipant={null}
      voiceAssistant={{ agent: null, audioTrack: null }}
      tracks={[]}
    />
  );
}

// Base component that receives LiveKit data as props
function CreateInnerBase({
  roomState,
  localParticipant,
  voiceAssistant,
  tracks
}: {
  roomState: ConnectionState;
  localParticipant: any;
  voiceAssistant: any;
  tracks: any[];
}) {
  const { shouldConnect, wsUrl, token, connect, disconnect } = useConnection();
  const { toastMessage, setToastMessage } = useToast();
  const [hasInitialized, setHasInitialized] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const router = useRouter();
  
  // Recording states
  const [recordingState, setRecordingState] = useState<'idle' | 'recording' | 'processing' | 'ready'>('idle');
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [reelPreview, setReelPreview] = useState<string | null>(null);
  const recordingInterval = useRef<NodeJS.Timeout>();
  
  // Draft form states
  const [draftTitle, setDraftTitle] = useState('');
  const [draftCaption, setDraftCaption] = useState('');
  const [showDraftOverlay, setShowDraftOverlay] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Get local microphone track
  const localMicTrack = tracks.find(
    ({ source, participant }) => 
      source === Track.Source.Microphone && 
      participant.identity === localParticipant?.identity
  );

  // Get agent audio track
  const agentAudioTrack = voiceAssistant.audioTrack;

  // Determine agent state based on voice assistant
  const getAgentState = () => {
    if (!voiceAssistant.agent) return 'idle';
    // For now, show as 'listening' when agent is connected
    // In a real implementation, you'd track this from agent events
    return 'listening';
  };

  // Auto-connect when component mounts
  useEffect(() => {
    if (!hasInitialized && !shouldConnect) {
      console.log('[Create] Auto-connecting to Tricia...');
      console.log('[Create] Current state:', { shouldConnect, wsUrl, token });
      setHasInitialized(true);
      connect().catch((error) => {
        console.error('[Create] Connection failed:', error);
        setConnectionError(error.message || 'Failed to connect to Tricia');
        setToastMessage({
          type: "error",
          message: `Connection failed: ${error.message || 'Unknown error'}`,
        });
      });
    }
  }, [connect, shouldConnect, hasInitialized, setToastMessage]);

  // Auto-start recording when connected
  useEffect(() => {
    if (roomState === ConnectionState.Connected && recordingState === 'idle') {
      console.log('[Create] Starting recording...');
      setRecordingState('recording');
      
      // Start duration timer
      recordingInterval.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    }
  }, [roomState, recordingState]);

  // Format duration as MM:SS
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCancel = () => {
    if (recordingInterval.current) {
      clearInterval(recordingInterval.current);
    }
    disconnect();
    router.push('/feed');
  };

  const handleGenerateReel = async () => {
    // TODO: Check if transcript length > 20
    setIsGenerating(true);
    
    if (recordingInterval.current) {
      clearInterval(recordingInterval.current);
    }
    
    // Simulate processing
    setTimeout(() => {
      // Mock data - in real app, this would come from the agent
      setDraftTitle('My Garden Memory');
      setDraftCaption('Just shared a beautiful memory about my garden with Tricia! 🌻');
      setReelPreview('https://picsum.photos/seed/reel/400/600');
      setRecordingState('ready');
      setShowDraftOverlay(true);
      setIsGenerating(false);
    }, 3000);
  };

  const handlePost = async () => {
    if (reelPreview) {
      // TODO: Call /api/reels/commit with visibility:'public'
      console.log('Publishing reel:', {
        title: draftTitle,
        caption: draftCaption,
        videoUrl: reelPreview,
        duration: recordingDuration,
        visibility: 'public'
      });
      
      // Optimistic update - add to feed immediately
      setToastMessage({ message: "Reel posted!", type: "success" });
      router.push('/feed');
    }
  };

  const handleEditDraft = () => {
    // Re-open the draft overlay for editing
    setShowDraftOverlay(true);
  };

  // Determine connection status for sidebar
  const connectionStatus = connectionError ? 'error' : 
                          roomState === ConnectionState.Connected ? 'connected' : 
                          'connecting';

  return (
    <>
      <Head>
        <title>Create Memory Reel - Tricia</title>
      </Head>

      <div className="min-h-screen bg-black text-white dot-grid-bg">
        {/* Sidebar */}
        <CreateSidebar 
          connectionStatus={connectionStatus as 'connecting' | 'connected' | 'error'}
          errorMessage={connectionError || undefined}
          onRetry={() => {
            setConnectionError(null);
            connect();
          }}
          onCancel={handleCancel}
        />

        {/* Main content area with grid layout */}
        <div className="ml-0 md:ml-[256px] min-h-screen p-4 md:p-6">
          <div className="canvas-wrap">
            {/* Header */}
            <div className="mb-4">
              <h1 className="text-2xl font-bold text-white">Create Memory Reel</h1>
              <p className="text-gray-400 text-sm mt-1">
                {recordingState === 'recording' ? 'Tell Tricia about a memory you\'d like to preserve' :
                 isGenerating ? 'Building your reel...' :
                 recordingState === 'ready' ? 'Your reel is ready to share!' :
                 'Share a memory with Tricia'}
              </p>
            </div>

            {/* Main content area */}
            <div className="flex flex-col gap-4 h-[calc(100vh-200px)]">
              {/* Reel Preview Container */}
              <div className="flex-1 max-h-[70vh]">
                <PlaygroundTile 
                  title={recordingState === 'ready' ? "Reel Preview" : "Your Memory Reel"} 
                  className="h-full"
                  padding={false}
                >
                  <div className="relative w-full h-full bg-black rounded-lg overflow-hidden flex items-center justify-center">
                    {/* Aspect ratio container for 9:16 reel */}
                    <div className="relative h-full aspect-[9/16] max-w-full bg-gray-900">
                      {recordingState === 'ready' && reelPreview ? (
                        <>
                          <img 
                            src={reelPreview} 
                            alt="Reel preview" 
                            className="w-full h-full object-cover"
                          />
                          
                          {/* Draft overlay */}
                          <AnimatePresence>
                            {showDraftOverlay && (
                              <motion.div
                                initial={{ y: '100%' }}
                                animate={{ y: 0 }}
                                exit={{ y: '100%' }}
                                transition={{ type: 'spring', damping: 25 }}
                                className="absolute inset-x-0 bottom-0 bg-neutral-800/80 backdrop-blur-sm rounded-t-xl p-6"
                              >
                                <div className="space-y-4">
                                  <div>
                                    <label className="text-sm text-gray-400 mb-1 block">Title</label>
                                    <input
                                      type="text"
                                      value={draftTitle}
                                      onChange={(e) => setDraftTitle(e.target.value.slice(0, 60))}
                                      className="w-full bg-neutral-700 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                      placeholder="Add a title..."
                                      maxLength={60}
                                      autoFocus
                                    />
                                    <span className="text-xs text-gray-500 mt-1">{draftTitle.length}/60</span>
                                  </div>
                                  
                                  <div>
                                    <label className="text-sm text-gray-400 mb-1 block">Caption</label>
                                    <textarea
                                      value={draftCaption}
                                      onChange={(e) => setDraftCaption(e.target.value.slice(0, 150))}
                                      className="w-full bg-neutral-700 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                                      placeholder="Write a caption..."
                                      rows={3}
                                      maxLength={150}
                                    />
                                    <span className="text-xs text-gray-500 mt-1">{draftCaption.length}/150</span>
                                  </div>
                                  
                                  <button
                                    onClick={() => setShowDraftOverlay(false)}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                                  >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      ) : recordingState === 'processing' || isGenerating ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                        <p className="text-gray-400">Building your reel...</p>
                      </div>
                    </div>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-24 h-24 bg-gray-800/50 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                              <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                            </div>
                            <p className="text-gray-400 text-sm">Start sharing your memory with Tricia</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Permission overlay */}
                      {roomState !== ConnectionState.Connected && (
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center rounded-lg">
                          <div className="text-center p-6">
                            <div className="w-16 h-16 mx-auto mb-4 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                            <h2 className="text-xl font-bold text-white mb-2">Preparing your session...</h2>
                            <p className="text-gray-400">Setting up connection to Tricia</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Live caption */}
                      {recordingState === 'recording' && roomState === ConnectionState.Connected && (
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3">
                            <p className="text-xs text-gray-400 mb-1">Live Caption</p>
                            <p className="text-white text-sm">Transcription will appear here...</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </PlaygroundTile>
              </div>

              {/* Bottom HUD with audio meters */}
              {roomState === ConnectionState.Connected && (
                <div className="sticky bottom-0 max-h-[40vh] w-full bg-neutral-900/90 backdrop-blur rounded-xl border border-dashed border-neutral-700 p-4">
                  <PlaygroundTile 
                    title="Audio Levels" 
                    className="h-full bg-transparent border-0"
                  >
                    <div className="space-y-4">
                      {/* Audio level meters */}
                      <div className="flex items-center justify-center gap-8 w-full">
                        <LevelMeter 
                          who="agent" 
                          label="Tricia" 
                          trackRef={agentAudioTrack}
                          state={getAgentState()}
                        />
                        <LevelMeter 
                          who="user" 
                          label="You" 
                          trackRef={localMicTrack}
                          state={localMicTrack ? 'speaking' : 'idle'}
                        />
                      </div>
                      
                      {/* Control buttons */}
                      <div className="flex items-center justify-between">
                        {/* Cancel button - bottom left */}
                        <button
                          onClick={handleCancel}
                          className="px-6 py-3 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
                          aria-label="Cancel recording and return to feed"
                        >
                          Cancel
                        </button>
                        
                        {/* Center buttons */}
                        <div className="flex gap-3">
                          {recordingState === 'recording' && (
                            <button
                              onClick={handleGenerateReel}
                              disabled={isGenerating}
                              className="px-8 py-3 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                              aria-label="Generate memory reel from conversation"
                            >
                              Generate Reel
                            </button>
                          )}
                          
                          {recordingState === 'ready' && (
                            <>
                              <button
                                onClick={handleEditDraft}
                                className="px-6 py-3 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
                                aria-label="Edit draft title and caption"
                              >
                                Edit Draft
                              </button>
                              <button
                                onClick={handlePost}
                                disabled={draftTitle.length === 0}
                                className="px-8 py-3 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Post reel to public feed"
                              >
                                Post
                              </button>
                            </>
                          )}
                        </div>
                        
                        {/* Status text - bottom right */}
                        <div className="text-sm text-gray-400">
                          {recordingState === 'recording' && !isGenerating && (
                            <span>Live: capturing story...</span>
                          )}
                          {isGenerating && (
                            <span>Building your reel...</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </PlaygroundTile>
                </div>
              )}

              {/* Hidden audio element to play agent audio */}
              {agentAudioTrack && (
                <div className="hidden">
                  <AudioTrack trackRef={agentAudioTrack} />
                </div>
              )}
            </div>
          </div>
        </div>

        <PlaygroundToast />
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  
  // Check if test mode is enabled
  const isTestMode = process.env.NEXT_PUBLIC_TEST_MODE === 'true';
  
  if (!isTestMode && !session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}; 