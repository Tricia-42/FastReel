// Fix for LiveKit WebRTC proxy error in Next.js
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.global = window;
}

import "@livekit/components-styles/components/participant";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { logger } from "@/lib/logger";
import { useState } from "react";
import { ToastProvider } from "@/components/toast/ToasterProvider";
import "@livekit/components-styles";
import "@livekit/components-styles/prefabs";
import Head from "next/head";
import { Public_Sans } from "next/font/google";
import { ConfigProvider } from "@/hooks/useConfig";
import AppLayout from "@/layouts/AppLayout";
import { useRouter } from "next/router";

const publicSans = Public_Sans({ subsets: ["latin"] });

// Configure logger based on environment
if (typeof window !== 'undefined') {
  // In development, reduce noise but keep important logs
  if (process.env.NODE_ENV === 'development') {
    logger.setLevel('info');
    logger.setEnabledCategories(['connection', 'journal', 'error']);
  } else {
    // In production, only log errors
    logger.setLevel('error');
  }
  
  // Override console to filter out noisy warnings
  logger.overrideConsole();
}

export default function App({ 
  Component, 
  pageProps: { session, ...pageProps } 
}: AppProps) {
  const router = useRouter();
  
  // Pages that should not have the layout wrapper
  const noLayoutPages = ['/auth/signin', '/auth/signup'];
  const shouldUseLayout = !noLayoutPages.includes(router.pathname);

  return (
    <>
      <Head>
        <title>Tricia - AI Memory Companion</title>
        <meta
          name="description"
          content="Transform your memories into beautiful AI-powered reels"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <meta name="theme-color" content="#070919" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
      </Head>
      <SessionProvider session={session}>
        <ToastProvider>
          <ConfigProvider>
            <div className={publicSans.className}>
              {shouldUseLayout ? (
                <AppLayout>
                  <Component {...pageProps} />
                </AppLayout>
              ) : (
                <Component {...pageProps} />
              )}
            </div>
          </ConfigProvider>
        </ToastProvider>
      </SessionProvider>
    </>
  );
}
