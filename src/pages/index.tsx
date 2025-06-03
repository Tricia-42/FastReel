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
import { useCallback, useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";

import Playground from "@/components/playground/Playground";
import { PlaygroundToast } from "@/components/toast/PlaygroundToast";
import { ConfigProvider, useConfig } from "@/hooks/useConfig";
import { ConnectionMode, ConnectionProvider, useConnection } from "@/hooks/useConnection";
import { PlaygroundConnect } from "@/components/PlaygroundConnect";
import { ToastProvider, useToast } from "@/components/toast/ToasterProvider";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";

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
  const { shouldConnect, wsUrl, token, connect, disconnect } = useConnection();
  const { config } = useConfig();
  const { toastMessage, setToastMessage } = useToast();
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  
  // Sync Firebase Auth with NextAuth session
  const { firebaseUser, isLoading: isFirebaseLoading, error: firebaseError } = useFirebaseAuth();
  
  // Show Firebase auth errors
  useEffect(() => {
    if (firebaseError) {
      console.error('Firebase auth error:', firebaseError);
      // You can show a toast here if needed
      // setToastMessage({ message: 'Firebase auth sync failed', type: 'error' });
    }
  }, [firebaseError]);
  
  // Log Firebase auth state
  useEffect(() => {
    if (firebaseUser) {
      // console.log('Firebase authenticated as:', firebaseUser.uid);
    }
  }, [firebaseUser]);

  // Auto-connect when component mounts (user is already authenticated)
  useEffect(() => {
    if (!hasInitialized && !shouldConnect && !isDisconnecting) {
      console.log('[Connection] Auto-connecting authenticated user...');
      setHasInitialized(true);
      connect();
    }
  }, [connect, shouldConnect, isDisconnecting, hasInitialized]);

  // Clean up on unmount to prevent connection issues with HMR
  useEffect(() => {
    return () => {
      if (shouldConnect) {
        // console.log('[HMR] Component unmounting, cleaning up LiveKit connection');
        disconnect();
      }
    };
  }, [shouldConnect, disconnect]);

  // Add a small delay after getting connection details to ensure clean connection
  useEffect(() => {
    if (shouldConnect && wsUrl && token) {
      // console.log('[Connection] Delaying LiveKitRoom render for clean connection...');
      setIsReady(false);
      const timer = setTimeout(() => {
        // console.log('[Connection] Ready to render LiveKitRoom');
        setIsReady(true);
      }, 100); // Small delay to ensure state is settled
      
      return () => clearTimeout(timer);
    } else {
      setIsReady(false);
    }
  }, [shouldConnect, wsUrl, token]);

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
        
        {!shouldConnect || !isReady ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-white">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Connecting to Tricia...</h2>
                <p className="text-gray-400">Please wait while we set up your session</p>
              </div>
            </div>
          </div>
        ) : (
          <LiveKitRoom
            key={`${wsUrl}-${token?.substring(0, 10)}`}
            className="flex flex-col h-full w-full"
            serverUrl={wsUrl}
            token={token}
            connect={true}
            onConnected={() => {
              console.log(`[${new Date().toISOString()}] ✅ LiveKitRoom connected successfully`);
            }}
            onDisconnected={(reason) => {
              console.log(`[${new Date().toISOString()}] ❌ LiveKitRoom disconnected`);
            }}
            onError={(e) => {
              console.error(`[${new Date().toISOString()}] ❌ LiveKitRoom error:`, e);
              setToastMessage({ message: e.message, type: "error" });
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  
  // Check if we're in test mode
  const isTestMode = process.env.NEXT_PUBLIC_TEST_MODE === 'true';
  
  // If not authenticated and not in test mode, redirect to sign-in page
  if (!session && !isTestMode) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }
  
  // 确保 session 对象中不包含 undefined 值
  const serializedSession = session ? {
    ...session,
    user: session.user ? {
      ...session.user,
      id: session.user.id || null,
      name: session.user.name || null,
      email: session.user.email || null,
      image: session.user.image || null,
      first_name: session.user.first_name || null,
      last_name: session.user.last_name || null,
      locale: session.user.locale || null
    } : null
  } : null;
  
  // Pass session to page
  return {
    props: {
      session: serializedSession,
    },
  };
};