import React, { useState, useEffect } from 'react';
import { useRoomContext, useVoiceAssistant } from '@livekit/components-react';

interface JournalContent {
  title?: string;
  text?: string;
  images?: string[];
  video?: string;
  createdAt?: string;
}

interface JournalDisplayProps {
  agentVideoTrack?: any;
}

export const JournalDisplay: React.FC<JournalDisplayProps> = ({ agentVideoTrack }) => {
  const room = useRoomContext();
  const voiceAssistant = useVoiceAssistant();
  const [journal, setJournal] = useState<JournalContent | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // RPC method to generate journal
  const generateJournal = async () => {
    if (!room?.localParticipant || !voiceAssistant.agent) return;
    
    setIsGenerating(true);
    try {
      const response = await room.localParticipant.performRpc({
        destinationIdentity: voiceAssistant.agent.identity,
        method: 'update_journal',
        payload: JSON.stringify({ action: 'generate' }),
      });
      
      const journalData = JSON.parse(response);
      setJournal(journalData);
    } catch (error) {
      console.error('Failed to generate journal:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // RPC method to save journal
  const saveJournal = async () => {
    if (!room?.localParticipant || !journal || !voiceAssistant.agent) return;
    
    try {
      await room.localParticipant.performRpc({
        destinationIdentity: voiceAssistant.agent.identity,
        method: 'save_journal',
        payload: JSON.stringify(journal),
      });
      
      // Show success notification
      console.log('Journal saved successfully');
    } catch (error) {
      console.error('Failed to save journal:', error);
    }
  };

  // Listen for journal updates from agent
  useEffect(() => {
    if (!room) return;

    const handleDataReceived = (payload: Uint8Array, participant?: any) => {
      try {
        const message = JSON.parse(new TextDecoder().decode(payload));
        if (message.type === 'journal_update') {
          setJournal(message.data);
        }
      } catch (error) {
        console.error('Error parsing data channel message:', error);
      }
    };

    room.on('dataReceived', handleDataReceived);
    return () => {
      room.off('dataReceived', handleDataReceived);
    };
  }, [room]);

  if (!voiceAssistant.agent) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <p className="text-gray-400">Waiting for Tricia to connect...</p>
      </div>
    );
  }

  if (!journal && !isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <p className="text-gray-400 mb-4">Ready to create your memory journal?</p>
        <button
          onClick={generateJournal}
          className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
        >
          Generate Journal
        </button>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <div className="animate-pulse text-gray-400">Creating your journal...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto p-6">
      {/* Journal Title */}
      {journal?.title && (
        <h2 className="text-2xl font-semibold text-white mb-4">{journal.title}</h2>
      )}

      {/* Journal Text */}
      {journal?.text && (
        <div className="prose prose-invert mb-6">
          <p className="text-gray-300 whitespace-pre-wrap">{journal.text}</p>
        </div>
      )}

      {/* Images */}
      {journal?.images && journal.images.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          {journal.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Memory ${index + 1}`}
              className="rounded-lg w-full h-auto"
            />
          ))}
        </div>
      )}

      {/* Video */}
      {journal?.video && (
        <div className="mb-6">
          <video
            src={journal.video}
            controls
            className="rounded-lg w-full"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4 mt-auto pt-6">
        <button
          onClick={saveJournal}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
        >
          Save Journal
        </button>
        <button
          onClick={generateJournal}
          className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
        >
          Regenerate
        </button>
      </div>
    </div>
  );
}; 