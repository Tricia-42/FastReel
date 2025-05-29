"use client";

import { LoadingSVG } from "@/components/button/LoadingSVG";
import { ChatMessageType } from "@/components/chat/ChatTile";
import { ColorPicker } from "@/components/colorPicker/ColorPicker";
import { AudioInputTile } from "@/components/config/AudioInputTile";
import { ConfigurationPanelItem } from "@/components/config/ConfigurationPanelItem";
import { NameValueRow } from "@/components/config/NameValueRow";
import { PlaygroundHeader } from "@/components/playground/PlaygroundHeader";
import {
  PlaygroundTab,
  PlaygroundTabbedTile,
  PlaygroundTile,
} from "@/components/playground/PlaygroundTile";
import { useConfig } from "@/hooks/useConfig";
import { TranscriptionTile } from "@/transcriptions/TranscriptionTile";
import {
  BarVisualizer,
  VideoTrack,
  useConnectionState,
  useDataChannel,
  useLocalParticipant,
  useRoomInfo,
  useTracks,
  useVoiceAssistant,
  useRoomContext,
  useTrackTranscription,
} from "@livekit/components-react";
import { ConnectionState, LocalParticipant, Track } from "livekit-client";
import { QRCodeSVG } from "qrcode.react";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import tailwindTheme from "../../lib/tailwindTheme.preval";
import { EditableNameValueRow } from "@/components/config/NameValueRow";
import Image from 'next/image'

export interface PlaygroundMeta {
  name: string;
  value: string;
}

export interface PlaygroundProps {
  logo?: ReactNode;
  themeColors: string[];
  onConnect: (connect: boolean) => void;
}

// Journal content interface
interface JournalContent {
  title?: string;
  text?: string;
  images?: string[];
  video?: string;
  createdAt?: string;
}

const headerHeight = 56;

export default function Playground({
  logo,
  themeColors,
  onConnect,
}: PlaygroundProps) {
  const { config, setUserSettings } = useConfig();
  const { name } = useRoomInfo();
  const [transcripts, setTranscripts] = useState<ChatMessageType[]>([]);
  const { localParticipant } = useLocalParticipant();

  const voiceAssistant = useVoiceAssistant();

  const roomState = useConnectionState();
  const tracks = useTracks();
  const room = useRoomContext();
  
  // Log room and agent state changes
  useEffect(() => {
    // console.log('=== Room State Changed ===');
    // console.log('Room State:', roomState);
    // console.log('Room:', room);
    // console.log('Room Name:', room?.name);
    // console.log('Local Participant:', room?.localParticipant?.identity);
    // console.log('Participants Count:', room?.remoteParticipants?.size);
    if (room?.remoteParticipants) {
      room.remoteParticipants.forEach((participant) => {
        // Only log agent connections
        if (participant.isAgent) {
          console.log(`Agent connected:`, {
            identity: participant.identity,
            name: participant.name,
          });
        }
      });
    }
  }, [roomState, room]);
  
  // Log voice assistant state changes
  useEffect(() => {
    // console.log('=== Voice Assistant State Changed ===');
    // console.log('Voice Assistant Agent:', voiceAssistant.agent);
    // console.log('Voice Assistant State:', voiceAssistant.state);
    // console.log('Voice Assistant Audio Track:', voiceAssistant.audioTrack);
    if (voiceAssistant.agent) {
      console.log('Voice Assistant connected:', voiceAssistant.agent.identity);
    }
  }, [voiceAssistant.agent, voiceAssistant.state, voiceAssistant.audioTrack]);

  const [rpcMethod, setRpcMethod] = useState("");
  const [rpcPayload, setRpcPayload] = useState("");
  
  // State for journal content
  const [journalContent, setJournalContent] = useState<JournalContent | null>(null);
  
  // State for subtitle-style transcription
  const [currentTranscript, setCurrentTranscript] = useState<{
    text: string;
    speaker: string;
    timestamp: number;
  } | null>(null);
  
  // State for settings drawer
  const [showSettings, setShowSettings] = useState(false);
  
  // State for current image index in carousel
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Register RPC handlers for receiving calls from the agent
  useEffect(() => {
    if (!room || roomState !== ConnectionState.Connected) return;

    // Handler for journal generated event
    const handleJournalGenerated = async (data: any) => {
      console.log('Received journal generated RPC');
      try {
        // The payload should be in data.payload
        const payload = typeof data.payload === 'string' ? data.payload : JSON.stringify(data.payload);
        const journalData = JSON.parse(payload);
        // console.log('Parsed journal data:', journalData);
        
        // Update journal content with the received data
        setJournalContent({
          title: journalData.title,
          text: journalData.narrative,
          images: journalData.images || [],
          createdAt: journalData.createdAt
        });
        
        // Return success response
        return JSON.stringify({ status: 'success', message: 'Journal received' });
      } catch (error: any) {
        console.error('Error handling journal generated:', error);
        return JSON.stringify({ status: 'error', message: error?.message || 'Unknown error' });
      }
    };

    // Handler for journal saved event
    const handleJournalSaved = async (data: any) => {
      console.log('Received journal saved RPC');
      try {
        // The payload should be in data.payload
        const payload = typeof data.payload === 'string' ? data.payload : JSON.stringify(data.payload);
        const savedData = JSON.parse(payload);
        // console.log('Journal saved successfully:', savedData);
        
        // You can show a success notification here
        // For now, just log it
        
        return JSON.stringify({ status: 'success', message: 'Journal save acknowledged' });
      } catch (error: any) {
        console.error('Error handling journal saved:', error);
        return JSON.stringify({ status: 'error', message: error?.message || 'Unknown error' });
      }
    };

    // Register the RPC handlers
    room.localParticipant.registerRpcMethod('agent.journal_generated', handleJournalGenerated);
    room.localParticipant.registerRpcMethod('agent.journal_saved', handleJournalSaved);

    // Cleanup function to unregister handlers
    return () => {
      room.localParticipant.unregisterRpcMethod('agent.journal_generated');
      room.localParticipant.unregisterRpcMethod('agent.journal_saved');
    };
  }, [room, roomState]);

  // Get agent transcriptions
  const agentTranscriptions = useTrackTranscription(voiceAssistant.audioTrack);
  
  // Debug: Check agent audio track
  useEffect(() => {
    console.log('Voice Assistant agent:', voiceAssistant.agent);
    console.log('Voice Assistant audioTrack:', voiceAssistant.audioTrack);
  }, [voiceAssistant.agent, voiceAssistant.audioTrack]);
  
  // Update subtitle when agent speaks
  useEffect(() => {
    if (agentTranscriptions && agentTranscriptions.segments && agentTranscriptions.segments.length > 0) {
      const latestSegment = agentTranscriptions.segments[agentTranscriptions.segments.length - 1];
      if (latestSegment && latestSegment.final) {
        setCurrentTranscript({
          text: latestSegment.text,
          speaker: "Tricia",
          timestamp: Date.now()
        });
      }
    }
  }, [agentTranscriptions]);

  useEffect(() => {
    if (roomState === ConnectionState.Connected) {
      localParticipant.setCameraEnabled(config.settings.inputs.camera);
      localParticipant.setMicrophoneEnabled(config.settings.inputs.mic);
    }
  }, [config, localParticipant, roomState]);

  // Clear transcript after 5 seconds (increased from 3)
  useEffect(() => {
    if (currentTranscript) {
      // console.log('Setting timer to clear transcript for:', currentTranscript.speaker);
      const timer = setTimeout(() => {
        // console.log('Clearing transcript for:', currentTranscript.speaker);
        setCurrentTranscript(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentTranscript]);

  // Reset image index when journal content changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [journalContent]);

  const agentVideoTrack = tracks.find(
    (trackRef) =>
      trackRef.publication.kind === Track.Kind.Video &&
      trackRef.participant.isAgent
  );

  const localTracks = tracks.filter(
    ({ participant }) => participant instanceof LocalParticipant
  );
  const localCameraTrack = localTracks.find(
    ({ source }) => source === Track.Source.Camera
  );
  const localScreenTrack = localTracks.find(
    ({ source }) => source === Track.Source.ScreenShare
  );
  const localMicTrack = localTracks.find(
    ({ source }) => source === Track.Source.Microphone
  );
  
  // Get user transcriptions using the microphone track
  const userTranscriptions = useTrackTranscription(localMicTrack);
  
  // Update subtitle when user speaks (using LiveKit transcription)
  useEffect(() => {
    if (userTranscriptions && userTranscriptions.segments && userTranscriptions.segments.length > 0) {
      const latestSegment = userTranscriptions.segments[userTranscriptions.segments.length - 1];
      if (latestSegment && latestSegment.final) {
        setCurrentTranscript({
          text: latestSegment.text,
          speaker: "You",
          timestamp: Date.now()
        });
        
        // Also add to transcript history
        setTranscripts((prevTranscripts) => [
          ...prevTranscripts,
          {
            name: "You",
            message: latestSegment.text,
            timestamp: Date.now(),
            isSelf: true,
          },
        ]);
      }
    }
  }, [userTranscriptions]);

  const onDataReceived = useCallback(
    (msg: any) => {
      // console.log('Data received:', msg); // Debug log
      if (msg.topic === "transcription") {
        const decoded = JSON.parse(
          new TextDecoder("utf-8").decode(msg.payload)
        );
        // console.log('Transcription decoded:', decoded); // Debug log
        let timestamp = new Date().getTime();
        if ("timestamp" in decoded && decoded.timestamp > 0) {
          timestamp = decoded.timestamp;
        }
        
        // Update subtitle-style transcription
        setCurrentTranscript({
          text: decoded.text,
          speaker: "You",
          timestamp: timestamp
        });
        
        // Also add to transcript history - Use functional update
        setTranscripts((prevTranscripts) => [
          ...prevTranscripts,
          {
            name: "You",
            message: decoded.text,
            timestamp: timestamp,
            isSelf: true,
          },
        ]);
      }
    },
    [] // Remove transcripts from dependencies
  );

  useDataChannel(onDataReceived);

  useEffect(() => {
    document.body.style.setProperty(
      "--lk-theme-color",
      // @ts-ignore
      tailwindTheme.colors[config.settings.theme_color]["500"]
    );
    document.body.style.setProperty(
      "--lk-drop-shadow",
      `var(--lk-theme-color) 0px 0px 18px`
    );
  }, [config.settings.theme_color]);

  const handleRpcCall = useCallback(async () => {
    if (!voiceAssistant.agent || !room) return;
    
    try {
      const response = await room.localParticipant.performRpc({
        destinationIdentity: voiceAssistant.agent.identity,
        method: rpcMethod,
        payload: rpcPayload,
      });
      console.log('RPC response:', response);
      
      // Handle journal responses
      if (rpcMethod === 'update_journal' || rpcMethod === 'save_journal') {
        try {
          const data = typeof response === 'string' ? JSON.parse(response) : response;
          if (data.journal || data.content) {
            setJournalContent(data.journal || data.content);
          }
        } catch (e) {
          console.error('Failed to parse journal response:', e);
        }
      }
    } catch (e) {
      console.error('RPC call failed:', e);
    }
  }, [room, rpcMethod, rpcPayload, voiceAssistant.agent]);

  const settingsTileContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4 h-full w-full items-start overflow-y-auto">
        {config.description && (
          <ConfigurationPanelItem title="Description">
            {config.description}
          </ConfigurationPanelItem>
        )}

        <ConfigurationPanelItem title="Connection">
          <div className="flex flex-col gap-4">
            <EditableNameValueRow
              name="Room"
              value={roomState === ConnectionState.Connected ? name : config.settings.room_name}
              valueColor={`${config.settings.theme_color}-500`}
              onValueChange={(value) => {
                const newSettings = { ...config.settings };
                newSettings.room_name = value;
                setUserSettings(newSettings);
              }}
              placeholder="Enter room name"
              editable={roomState !== ConnectionState.Connected}
            />
            <EditableNameValueRow
              name="Participant"
              value={roomState === ConnectionState.Connected ? 
                (localParticipant?.identity || '') : 
                (config.settings.participant_name || '')}
              valueColor={`${config.settings.theme_color}-500`}
              onValueChange={(value) => {
                const newSettings = { ...config.settings };
                newSettings.participant_name = value;
                setUserSettings(newSettings);
              }}
              placeholder="Enter participant id"
              editable={roomState !== ConnectionState.Connected}
            />
          </div>
        </ConfigurationPanelItem>
        
        <ConfigurationPanelItem title="Status">
          <div className="flex flex-col gap-2">
            <NameValueRow
              name="Room connected"
              value={
                roomState === ConnectionState.Connecting ? (
                  <LoadingSVG diameter={16} strokeWidth={2} />
                ) : (
                  roomState.toUpperCase()
                )
              }
              valueColor={
                roomState === ConnectionState.Connected
                  ? `${config.settings.theme_color}-500`
                  : "gray-500"
              }
            />
            <NameValueRow
              name="Agent connected"
              value={
                voiceAssistant.agent ? (
                  "TRUE"
                ) : roomState === ConnectionState.Connected ? (
                  <LoadingSVG diameter={12} strokeWidth={2} />
                ) : (
                  "FALSE"
                )
              }
              valueColor={
                voiceAssistant.agent
                  ? `${config.settings.theme_color}-500`
                  : "gray-500"
              }
            />
          </div>
        </ConfigurationPanelItem>
        
        <div className="w-full">
          <ConfigurationPanelItem title="Theme Color">
            <ColorPicker
              colors={themeColors}
              selectedColor={config.settings.theme_color}
              onSelect={(color) => {
                const userSettings = { ...config.settings };
                userSettings.theme_color = color;
                setUserSettings(userSettings);
              }}
            />
          </ConfigurationPanelItem>
        </div>
      </div>
    );
  }, [
    config.description,
    config.settings,
    localParticipant,
    name,
    roomState,
    themeColors,
    setUserSettings,
    voiceAssistant.agent,
  ]);

  let mobileTabs: PlaygroundTab[] = [];
  
  // Journal tab - main focus
  mobileTabs.push({
    title: "Journal",
    content: (
      <div className="flex flex-col gap-4 h-full overflow-y-auto">
        {/* Journal Images - 16:9 */}
        <PlaygroundTile
          title="Memory Images"
          className="w-full h-auto"
          childrenClassName="p-4 bg-gray-900"
        >
          {agentVideoTrack ? (
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <div className="absolute inset-0">
                <VideoTrack
                  trackRef={agentVideoTrack}
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
            </div>
          ) : journalContent?.images && journalContent.images.length > 0 ? (
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src={journalContent.images[currentImageIndex]}
                  alt={`Memory ${currentImageIndex + 1}`}
                  className="w-full h-full object-contain rounded-lg"
                  width={1000}
                  height={1000}
                />
                {journalContent.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => 
                        prev > 0 ? prev - 1 : journalContent.images!.length - 1
                      )}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full text-sm"
                    >
                      ←
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => 
                        prev < journalContent.images!.length - 1 ? prev + 1 : 0
                      )}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full text-sm"
                    >
                      →
                    </button>
                  </>
                )}
              </div>
              {journalContent.images.length > 1 && (
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
                  {journalContent.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${
                        index === currentImageIndex ? 'bg-white' : 'bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="relative w-full bg-gray-800 rounded-lg" style={{ paddingBottom: '56.25%' }}>
              <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <div className="text-sm">No images yet</div>
                  <div className="text-xs mt-1">Images will appear as you share memories</div>
                </div>
              </div>
            </div>
          )}
        </PlaygroundTile>
        
        {/* Journal Text */}
        <PlaygroundTile
          title="Memory Story"
          className="min-h-[200px]"
        >
          {journalContent ? (
            <div className="p-4">
              {journalContent.title && (
                <h3 className="text-lg font-bold mb-3 text-white">{journalContent.title}</h3>
              )}
              {journalContent.text ? (
                <p className="text-gray-200 whitespace-pre-wrap text-sm leading-relaxed">{journalContent.text}</p>
              ) : (
                <div className="text-gray-500 text-center mt-4">
                  <div className="text-sm">Your story will appear here</div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 p-4">
              <div className="text-center">
                <LoadingSVG />
                <div className="text-sm mt-4">Ready to capture memories</div>
                <div className="text-xs mt-2">Tell Tricia about a special moment</div>
              </div>
            </div>
          )}
        </PlaygroundTile>
      </div>
    ),
  });

  // Conversation tab - combined agent and user
  mobileTabs.push({
    title: "Conversation", 
    content: (
      <div className="flex flex-col gap-4 h-full overflow-y-auto">
        {/* Tricia Section */}
        <div className="text-xs text-gray-400 px-4 pt-2">Tricia</div>
        
        {/* Tricia Audio */}
        <PlaygroundTile
          title="Tricia Speaking"
          className="h-24"
        >
          <AudioInputTile trackRef={voiceAssistant.audioTrack} />
        </PlaygroundTile>
        
        {/* Tricia Transcription */}
        <PlaygroundTile
          title="Tricia&apos;s Words"
          className="h-24"
        >
          <div className="flex items-center justify-center h-full p-3">
            {currentTranscript && currentTranscript.speaker === "Tricia" ? (
              <div className="animate-fade-in text-center w-full">
                <div className="text-sm font-medium text-white leading-tight">
                  {currentTranscript.text}
                </div>
              </div>
            ) : (
              <div className="text-xs text-gray-500 text-center">
                Tricia&apos;s responses will appear here
              </div>
            )}
          </div>
        </PlaygroundTile>
        
        {/* User Section */}
        <div className="text-xs text-gray-400 px-4 pt-2">You</div>
        
        {/* User Video */}
        <PlaygroundTile
          title="Your Video"
          className="h-48"
        >
          <div className="relative h-full bg-gray-900 rounded-lg overflow-hidden">
            {localCameraTrack ? (
              <VideoTrack
                trackRef={localCameraTrack}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 text-xs">
                Camera off
              </div>
            )}
          </div>
        </PlaygroundTile>
        
        {/* Journal Tools - Mobile version */}
        <PlaygroundTile
          title="Journal Tools"
          className="h-auto"
        >
          <div className="flex flex-col gap-2 p-3">
            <div className="text-xs text-gray-500">Quick Actions:</div>
            <div className="grid grid-cols-2 gap-1">
              <button
                onClick={() => {
                  setRpcMethod('update_journal');
                  setRpcPayload('{"action": "generate"}');
                }}
                className="text-xs px-2 py-1.5 bg-gray-800 hover:bg-gray-700 rounded text-gray-300"
              >
                Generate Journal
              </button>
              <button
                onClick={() => {
                  setRpcMethod('update_journal');
                  setRpcPayload('{"action": "preview"}');
                }}
                className="text-xs px-2 py-1.5 bg-gray-800 hover:bg-gray-700 rounded text-gray-300"
              >
                Preview Journal
              </button>
            </div>
            <button
              onClick={handleRpcCall}
              disabled={!voiceAssistant.agent || !rpcMethod}
              className={`w-full px-2 py-1.5 rounded-sm text-xs font-medium transition-colors
                ${voiceAssistant.agent && rpcMethod 
                  ? `bg-${config.settings.theme_color}-500 hover:bg-${config.settings.theme_color}-600 text-white` 
                  : 'bg-gray-800 cursor-not-allowed text-gray-500'
                }`}
            >
              {rpcMethod ? `Execute ${rpcMethod}` : 'Select a method'}
            </button>
          </div>
        </PlaygroundTile>
        
        {/* User Audio */}
        <PlaygroundTile
          title="Your Voice"
          className="h-24"
        >
          {localMicTrack ? (
            <AudioInputTile trackRef={localMicTrack} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 text-xs">
              Microphone off
            </div>
          )}
        </PlaygroundTile>
        
        {/* User Transcription */}
        <PlaygroundTile
          title="Your Words"
          className="h-20"
        >
          <div className="flex items-center justify-center h-full p-3">
            {currentTranscript && currentTranscript.speaker === "You" ? (
              <div className="animate-fade-in text-center w-full">
                <div className="text-sm font-medium text-white leading-tight">
                  {currentTranscript.text}
                </div>
              </div>
            ) : (
              <div className="text-xs text-gray-500 text-center">
                Your words will appear here
              </div>
            )}
          </div>
        </PlaygroundTile>
      </div>
    ),
  });

  mobileTabs.push({
    title: "Settings",
    content: (
      <PlaygroundTile
        padding={false}
        backgroundColor="gray-950"
        className="h-96 overflow-y-auto"
        childrenClassName="h-full"
      >
        {settingsTileContent}
      </PlaygroundTile>
    ),
  });

  // Monitor room events for participant connections
  useEffect(() => {
    if (!room) return;
    
    const roomId = room.name;
    const startTime = Date.now();
    console.log('=== Setting up room event listeners ===');
    console.log(`[${new Date().toISOString()}] Room connected, waiting for agent...`);
    // console.log('Room details:', {
    //   name: room.name,
    //   state: room.state,
    //   localParticipant: room.localParticipant?.identity,
    //   participantCount: room.remoteParticipants.size
    // });
    
    // Monitor room state changes
    const handleRoomStateChanged = (state: any) => {
      // console.log(`[${new Date().toISOString()}] Room state changed to: ${state}`);
    };
    
    // Set up a timeout to warn if agent doesn't join
    const agentTimeout = setTimeout(() => {
      if (room.remoteParticipants.size === 0) {
        console.error('⚠️ WARNING: Agent has not joined after 5 seconds!');
        console.error('This usually means:');
        console.error('1. The agent worker is not running on the backend');
        console.error('2. The agent worker is not registered with LiveKit Cloud');
        console.error('3. The agent name "tricia-agent" doesn\'t match the registered worker');
        console.error('4. The LiveKit Cloud project might have agent dispatch disabled');
        console.error('');
        console.error('Debug info:');
        console.error('- Room name:', room.name);
        console.error('- Local participant:', room.localParticipant?.identity);
        console.error('- Remote participants:', room.remoteParticipants.size);
        console.error('');
        console.error('Check the Tricia backend logs for agent worker errors');
      }
    }, 5000);
    
    const handleParticipantConnected = (participant: any) => {
      const elapsed = Date.now() - startTime;
      // console.log(`[${new Date().toISOString()}] Participant Connected after ${elapsed}ms:`, {
      //   identity: participant.identity,
      //   sid: participant.sid,
      //   isAgent: participant.isAgent,
      //   name: participant.name,
      //   metadata: participant.metadata
      // });
      
      if (participant.isAgent) {
        console.log(`!!! AGENT CONNECTED after ${elapsed}ms !!!`);
        // console.log('Agent dispatch successful');
        clearTimeout(agentTimeout);
      }
    };
    
    const handleParticipantDisconnected = (participant: any) => {
      // console.log('=== Participant Disconnected ===', {
      //   identity: participant.identity,
      //   sid: participant.sid,
      //   isAgent: participant.isAgent
      // });
    };
    
    const handleRoomDisconnected = () => {
      console.log('=== Room Disconnected - Will create new room on next connection ===');
    };
    
    // Subscribe to room events
    room.on('participantConnected', handleParticipantConnected);
    room.on('participantDisconnected', handleParticipantDisconnected);
    room.on('disconnected', handleRoomDisconnected);
    
    // Check if agent is already in room
    // console.log('=== Checking existing participants ===');
    // console.log('Local participant:', room.localParticipant?.identity);
    room.remoteParticipants.forEach((participant) => {
      handleParticipantConnected(participant);
    });
    
    return () => {
      clearTimeout(agentTimeout);
      room.off('participantConnected', handleParticipantConnected);
      room.off('participantDisconnected', handleParticipantDisconnected);  
      room.off('disconnected', handleRoomDisconnected);
    };
  }, [room]);

  return (
    <>
      <PlaygroundHeader
        title={config.title}
        logo={logo}
        githubLink={config.github_link}
        height={headerHeight}
        accentColor={config.settings.theme_color}
        connectionState={roomState}
        onConnectClicked={() =>
          onConnect(roomState === ConnectionState.Disconnected)
        }
      />
      <div
        className={`flex gap-4 p-4 grow w-full selection:bg-${config.settings.theme_color}-900`}
        style={{ height: `calc(100% - ${headerHeight}px)` }}
      >
        {/* Mobile Layout */}
        <div className="flex flex-col grow gap-4 h-full lg:hidden">
          <PlaygroundTabbedTile
            className="h-full"
            tabs={mobileTabs}
            initialTab={0}
          />
        </div>

        {/* Desktop Layout - Clean Tile Grid */}
        <div className="hidden lg:flex w-full h-full gap-4">
          {/* Left Column - Agent (Tricia) & Settings */}
          <div className="flex flex-col basis-1/4 gap-4">
            {/* Settings - Extended height */}
            <PlaygroundTile
              title="Settings"
              padding={false}
              backgroundColor="gray-950"
              className="h-[32rem] overflow-y-auto"
              childrenClassName="h-full"
            >
              {settingsTileContent}
            </PlaygroundTile>

            {/* Tricia Audio Visualizer - Moved lower */}
            <PlaygroundTile
              title="Tricia Speaking"
              className="h-24"
            >
              <AudioInputTile trackRef={voiceAssistant.audioTrack} />
            </PlaygroundTile>

            {/* Tricia Transcription - Moved lower */}
            <PlaygroundTile
              title="Tricia&apos;s Words"
              className="h-20"
            >
              <div className="flex items-center justify-center h-full p-3">
                {currentTranscript && currentTranscript.speaker === "Tricia" ? (
                  <div className="animate-fade-in text-center w-full">
                    <div className="text-sm font-medium text-white leading-tight">
                      {currentTranscript.text}
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-gray-500 text-center">
                    Tricia&apos;s responses will appear here
                  </div>
                )}
              </div>
            </PlaygroundTile>
          </div>

          {/* Middle Column - Journal */}
          <div className="flex flex-col grow basis-1/2 gap-4">
            {/* Journal Images - 16:9 aspect ratio */}
            <PlaygroundTile
              title="Memory Images"
              className="w-full h-auto"
              childrenClassName="p-4 bg-gray-900"
            >
              {agentVideoTrack ? (
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <div className="absolute inset-0">
                    <VideoTrack
                      trackRef={agentVideoTrack}
                      className="w-full h-full object-contain rounded-lg"
                    />
                  </div>
                </div>
              ) : journalContent?.images && journalContent.images.length > 0 ? (
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img
                      src={journalContent.images[currentImageIndex]}
                      alt={`Memory ${currentImageIndex + 1}`}
                      className="w-full h-full object-contain rounded-lg"
                    />
                    {journalContent.images.length > 1 && (
                      <>
                        <button
                          onClick={() => setCurrentImageIndex((prev) => 
                            prev > 0 ? prev - 1 : journalContent.images!.length - 1
                          )}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full text-sm"
                        >
                          ←
                        </button>
                        <button
                          onClick={() => setCurrentImageIndex((prev) => 
                            prev < journalContent.images!.length - 1 ? prev + 1 : 0
                          )}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full text-sm"
                        >
                          →
                        </button>
                      </>
                    )}
                  </div>
                  {journalContent.images.length > 1 && (
                    <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
                      {journalContent.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-1.5 h-1.5 rounded-full transition-colors ${
                            index === currentImageIndex ? 'bg-white' : 'bg-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative w-full bg-gray-800 rounded-lg" style={{ paddingBottom: '56.25%' }}>
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <div className="text-sm">No images yet</div>
                      <div className="text-xs mt-1">Images will appear as you share memories</div>
                    </div>
                  </div>
                </div>
              )}
            </PlaygroundTile>

            {/* Journal Text Content */}
            <PlaygroundTile
              title="Memory Story"
              className="flex-1 overflow-hidden"
              childrenClassName="overflow-y-auto"
            >
              {journalContent ? (
                <div className="p-4">
                  {journalContent.title && (
                    <h2 className="text-xl font-bold mb-3 text-white">{journalContent.title}</h2>
                  )}
                  {journalContent.text ? (
                    <p className="text-gray-200 whitespace-pre-wrap text-sm leading-relaxed">{journalContent.text}</p>
                  ) : (
                    <div className="text-gray-500 text-center mt-4">
                      <div className="text-sm">Your story will appear here</div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <LoadingSVG />
                    <div className="text-sm mt-4">Ready to capture your memories</div>
                    <div className="text-xs mt-2">Tell Tricia about a special moment</div>
                  </div>
                </div>
              )}
            </PlaygroundTile>
          </div>

          {/* Right Column - User */}
          <div className="flex flex-col basis-1/4 gap-4">
            {/* User Video - Made larger */}
            <PlaygroundTile
              title="You"
              className="h-64"
            >
              <div className="relative h-full bg-gray-900 rounded-lg overflow-hidden">
                {localCameraTrack ? (
                  <VideoTrack
                    trackRef={localCameraTrack}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500 text-xs">
                    Camera off
                  </div>
                )}
              </div>
            </PlaygroundTile>

            {/* Journal Tools - Moved here */}
            <PlaygroundTile
              title="Journal Tools"
              className="h-auto"
              padding={false}
            >
              <div className="flex flex-col gap-1.5 p-3">
                <div className="text-xs text-gray-500 mb-1">Quick Actions:</div>
                <div className="flex flex-wrap gap-1">
                  <button
                    onClick={() => {
                      setRpcMethod('update_journal');
                      setRpcPayload('{"action": "generate"}');
                    }}
                    className="text-xs px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded text-gray-300"
                  >
                    Generate Journal
                  </button>
                  <button
                    onClick={() => {
                      setRpcMethod('update_journal');
                      setRpcPayload('{"action": "preview"}');
                    }}
                    className="text-xs px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded text-gray-300"
                  >
                    Preview Journal
                  </button>
                  <button
                    onClick={() => {
                      setRpcMethod('save_journal');
                      setRpcPayload('{}');
                    }}
                    className="text-xs px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded text-gray-300"
                  >
                    Save
                  </button>
                </div>
                <button
                  onClick={handleRpcCall}
                  disabled={!voiceAssistant.agent || !rpcMethod}
                  className={`px-3 py-1 rounded-sm text-xs font-medium transition-colors
                    ${voiceAssistant.agent && rpcMethod 
                      ? `bg-${config.settings.theme_color}-500 hover:bg-${config.settings.theme_color}-600 text-white` 
                      : 'bg-gray-800 cursor-not-allowed text-gray-500'
                    }`}
                >
                  Run
                </button>
              </div>
            </PlaygroundTile>

            {/* User Audio Visualizer */}
            <PlaygroundTile
              title="Your Voice"
              className="h-24"
            >
              {localMicTrack ? (
                <AudioInputTile trackRef={localMicTrack} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 text-xs">
                  Microphone off
                </div>
              )}
            </PlaygroundTile>

            {/* User Transcription */}
            <PlaygroundTile
              title="Your Words"
              className="h-20"
            >
              <div className="flex items-center justify-center h-full p-3">
                {currentTranscript && currentTranscript.speaker === "You" ? (
                  <div className="animate-fade-in text-center w-full">
                    <div className="text-sm font-medium text-white leading-tight">
                      {currentTranscript.text}
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-gray-500 text-center">
                    Your words will appear here
                  </div>
                )}
              </div>
            </PlaygroundTile>
          </div>
        </div>
      </div>
    </>
  );
}
