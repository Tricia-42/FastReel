import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Head from "next/head";

export default function HomePage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;

    // Bypass auth check in test mode
    const isTestMode = process.env.NEXT_PUBLIC_TEST_MODE === 'true';
    
    // Check if user is authenticated (unless in test mode)
    if (!isTestMode && status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    // Check onboarding status
    const isOnboarded = localStorage.getItem("onboarded") === "1";
    
    if (isOnboarded) {
      // Redirect to feed if already onboarded
      router.push("/feed");
    } else {
      // Redirect to create page for first-time users
      router.push("/create");
    }
  }, [status, router]);

  return (
    <>
      <Head>
        <title>Tricia - AI Memory Companion</title>
        <meta name="description" content="Create and share AI-powered memory reels" />
      </Head>
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="text-white">Loading...</div>
      </div>
    </>
  );
}