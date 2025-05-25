import {
  LiveKitRoom,
  RoomAudioRenderer,
  StartAudio,
  useConnectionState,
} from "@livekit/components-react";
import { ConnectionState } from "livekit-client";
import { AnimatePresence, motion } from "framer-motion";
import { Inter } from "next/font/google";
import Head from "next/head";
import { useCallback, useState } from "react";

import Playground from "@/components/playground/Playground";
import { PlaygroundToast } from "@/components/toast/PlaygroundToast";
import { ConfigProvider, useConfig } from "@/hooks/useConfig";
import { ConnectionMode, ConnectionProvider, useConnection } from "@/hooks/useConnection";
import { PlaygroundConnect } from "@/components/PlaygroundConnect";
import { ToastProvider, useToast } from "@/components/toast/ToasterProvider";

const themeColors = [
  "cyan",
  "green",
  "amber",
  "blue",
  "violet",
  "rose",
  "pink",
  "teal",
];

const inter = Inter({ subsets: ["latin"] });

// Component to conditionally render audio based on connection state
function ConditionalAudio() {
  const connectionState = useConnectionState();
  
  return (
    <>
      {connectionState === ConnectionState.Connected && <RoomAudioRenderer />}
      <StartAudio label="Click to enable audio playback" />
    </>
  );
}

export default function Home() {
  return (
    <ToastProvider>
      <ConfigProvider>
        <ConnectionProvider>
          <HomeInner />
        </ConnectionProvider>
      </ConfigProvider>
    </ToastProvider>
  );
}

export function HomeInner() {
  const { shouldConnect, wsUrl, token, mode, connect, disconnect } = useConnection();
  const { config } = useConfig();
  const { toastMessage, setToastMessage } = useToast();
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  const handleConnect = useCallback(
    async (mode: ConnectionMode) => {
      // If already connected, disconnect first
      if (shouldConnect && !isDisconnecting) {
        setIsDisconnecting(true);
        await disconnect();
        // Wait for disconnect to complete
        await new Promise(resolve => setTimeout(resolve, 500));
        setIsDisconnecting(false);
      }
      connect(mode);
    },
    [connect, disconnect, shouldConnect, isDisconnecting]
  );

  const handleDisconnect = useCallback(
    (shouldStayConnected: boolean) => {
      if (!shouldStayConnected) {
        disconnect();
      }
    },
    [disconnect]
  );

  return (
    <>
      <Head>
        <title>{config.title}</title>
        <meta name="description" content={config.description} />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta
          property="og:title"
          content="Tricia - Memory Guide"
        />
        <meta
          property="og:description"
          content="Capture your stories with guided conversations"
        />
        <meta
          property="og:image"
          content="https://heytricia.ai/og-image.png"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <main className="relative flex flex-col justify-center px-4 items-center h-full w-full bg-black repeating-square-background">
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              className="left-0 right-0 top-0 absolute z-10"
              initial={{ opacity: 0, translateY: -50 }}
              animate={{ opacity: 1, translateY: 0 }}
              exit={{ opacity: 0, translateY: -50 }}
            >
              <PlaygroundToast />
            </motion.div>
          )}
        </AnimatePresence>
        
        {!shouldConnect ? (
          <PlaygroundConnect
            accentColor={config.settings.theme_color}
            onConnectClicked={handleConnect}
          />
        ) : (
          <LiveKitRoom
            className="flex flex-col h-full w-full"
            serverUrl={wsUrl}
            token={token}
            connect={shouldConnect}
            onError={(e) => {
              setToastMessage({ message: e.message, type: "error" });
              console.error(e);
            }}
          >
            <Playground
              themeColors={themeColors}
              onConnect={handleDisconnect}
            />
            <ConditionalAudio />
          </LiveKitRoom>
        )}
      </main>
    </>
  );
}