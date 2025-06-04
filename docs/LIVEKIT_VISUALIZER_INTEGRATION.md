# LiveKit BarVisualizer Integration

## Overview

The Create flow now uses the canonical LiveKit BarVisualizer component for audio level visualization, following the proven patterns from the LiveKit Agents-Playground.

## Implementation Details

### 1. Component Reuse

We directly import and use the LiveKit BarVisualizer component:

```tsx
import { BarVisualizer, TrackReferenceOrPlaceholder } from "@livekit/components-react";
```

No custom visualizer code was written - we use the component as-is from LiveKit.

### 2. Track References

Audio tracks are obtained using LiveKit hooks:

```tsx
// Get local microphone track
const localMicTrack = tracks.find(
  ({ source, participant }) => 
    source === Track.Source.Microphone && 
    participant.identity === localParticipant?.identity
);

// Get agent audio track
const agentAudioTrack = voiceAssistant.audioTrack;
```

### 3. State Mapping

Agent states are mapped to Tailwind color classes:

```tsx
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
```

### 4. Layout Integration

The visualizers are placed in the bottom HUD:

```tsx
<div className="sticky bottom-0 max-h-[40vh] w-full bg-neutral-900/90 backdrop-blur rounded-xl border border-dashed border-neutral-700 p-4">
  <PlaygroundTile title="Audio Levels" className="h-full bg-transparent border-0">
    <div className="flex items-center justify-center gap-8 w-full">
      <LevelMeter who="agent" label="Tricia" trackRef={agentAudioTrack} state={getAgentState()} />
      <LevelMeter who="user" label="You" trackRef={localMicTrack} state={localMicTrack ? 'speaking' : 'idle'} />
    </div>
  </PlaygroundTile>
</div>
```

### 5. Styling Conventions

All styling uses Tailwind classes:

- `.dot-grid-bg` - Background pattern from playground
- `.panel` - Rounded border with dashed style
- `.canvas-wrap` - Max-width 960px container
- `sticky bottom-0 max-h-[40vh]` - Bottom HUD positioning

### 6. No LiveKit Keys in Client

All LiveKit credentials come from the backend via the `/api/tricia` endpoint:

```tsx
const { shouldConnect, wsUrl, token, connect, disconnect } = useConnection();
```

## Testing Checklist

- [x] No hardcoded WebSocket URLs (`git grep -i "wss://" src/` returns nothing)
- [x] BarVisualizer animates for both user and agent tracks
- [x] Layout scales properly at 1024×768 and larger screens
- [x] HUD takes ≤ 40% height with `max-h-[40vh]`
- [x] Lint passes with no errors (`npm run lint`)
- [x] TypeScript compiles (errors only in unrelated files)

## Component Structure

```
create.tsx
├── ConnectionProvider
│   └── useConnection() → wsUrl, token
├── LiveKit Hooks
│   ├── useLocalParticipant()
│   ├── useTracks()
│   └── useVoiceAssistant()
└── UI Components
    ├── CreateSidebar (collapsible debug info)
    ├── ReelPreviewCanvas (16:9 video preview)
    └── LevelMeter (wraps BarVisualizer)
        └── BarVisualizer (canonical LiveKit component)
```

## Future Improvements

1. Track actual agent speaking/listening states from LiveKit events
2. Add real-time transcription display
3. Implement camera preview with getUserMedia()
4. Connect to real media upload endpoints 