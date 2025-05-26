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

  // Get agent transcriptions
  const agentTranscriptions = useTrackTranscription(voiceAssistant.audioTrack);
  
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
      const timer = setTimeout(() => {
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

  const onDataReceived = useCallback(
    (msg: any) => {
      if (msg.topic === "transcription") {
        const decoded = JSON.parse(
          new TextDecoder("utf-8").decode(msg.payload)
        );
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
        
        // Also add to transcript history
        setTranscripts([
          ...transcripts,
          {
            name: "You",
            message: decoded.text,
            timestamp: timestamp,
            isSelf: true,
          },
        ]);
      }
    },
    [transcripts]
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
          {journalContent?.images && journalContent.images.length > 0 ? (
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
          title="Tricia's Words"
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
                  setRpcMethod('add_memory');
                  setRpcPayload('{}');
                }}
                className="text-xs px-2 py-1.5 bg-gray-800 hover:bg-gray-700 rounded text-gray-300"
              >
                Add Memory
              </button>
              <button
                onClick={() => {
                  setRpcMethod('update_journal');
                  setRpcPayload('{}');
                }}
                className="text-xs px-2 py-1.5 bg-gray-800 hover:bg-gray-700 rounded text-gray-300"
              >
                Update Journal
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
          className="h-24"
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
                Your words will appear here as you speak
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
        className="h-full w-full basis-1/4 items-start overflow-y-auto flex"
        childrenClassName="h-full grow items-start"
      >
        {settingsTileContent}
      </PlaygroundTile>
    ),
  });

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
            {/* Settings - at the top */}
            <PlaygroundTile
              title="Settings"
              padding={false}
              backgroundColor="gray-950"
              className="h-80 overflow-y-auto"
              childrenClassName="h-full"
            >
              {settingsTileContent}
            </PlaygroundTile>

            {/* Tricia Audio Visualizer */}
            <PlaygroundTile
              title="Tricia Speaking"
              className="h-28"
            >
              <AudioInputTile trackRef={voiceAssistant.audioTrack} />
            </PlaygroundTile>

            {/* Tricia Transcription */}
            <PlaygroundTile
              title="Tricia's Words"
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
          </div>

          {/* Middle Column - Journal */}
          <div className="flex flex-col grow basis-1/2 gap-4">
            {/* Journal Images - 16:9 aspect ratio */}
            <PlaygroundTile
              title="Memory Images"
              className="w-full h-auto"
              childrenClassName="p-4 bg-gray-900"
            >
              {journalContent?.images && journalContent.images.length > 0 ? (
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}> {/* 16:9 aspect ratio */}
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
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
                        >
                          ←
                        </button>
                        <button
                          onClick={() => setCurrentImageIndex((prev) => 
                            prev < journalContent.images!.length - 1 ? prev + 1 : 0
                          )}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
                        >
                          →
                        </button>
                      </>
                    )}
                  </div>
                  {journalContent.images.length > 1 && (
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                      {journalContent.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentImageIndex ? 'bg-white' : 'bg-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative w-full bg-gray-800 rounded-lg flex items-center justify-center text-gray-500" style={{ paddingBottom: '56.25%' }}>
                  <div className="absolute inset-0 flex items-center justify-center">
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
                      setRpcMethod('add_memory');
                      setRpcPayload('{}');
                    }}
                    className="text-xs px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded text-gray-300"
                  >
                    Add Memory
                  </button>
                  <button
                    onClick={() => {
                      setRpcMethod('update_journal');
                      setRpcPayload('{}');
                    }}
                    className="text-xs px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded text-gray-300"
                  >
                    Update
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
                <div className="flex gap-1">
                  <input
                    type="text"
                    value={rpcMethod}
                    onChange={(e) => setRpcMethod(e.target.value)}
                    className="flex-1 text-white text-xs bg-transparent border border-gray-800 rounded-sm px-2 py-1"
                    placeholder="Method"
                  />
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
                <textarea
                  value={rpcPayload}
                  onChange={(e) => setRpcPayload(e.target.value)}
                  className="w-full text-white text-xs bg-transparent border border-gray-800 rounded-sm px-2 py-1"
                  placeholder="Payload (JSON)"
                  rows={2}
                />
              </div>
            </PlaygroundTile>

            {/* User Audio Visualizer */}
            <PlaygroundTile
              title="Your Voice"
              className="h-28"
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
              className="h-24"
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
