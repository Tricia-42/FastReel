import { useState } from 'react';
import Head from 'next/head';

export default function DebugPage() {
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [triciaResponse, setTriciaResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testApi = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/test-tricia');
      const data = await res.json();
      setApiResponse(data);
    } catch (error) {
      setApiResponse({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
    setLoading(false);
  };

  const testTriciaConnection = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/tricia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: 'test-user-123',
          metadata: {
            title: 'Debug Test Session'
          }
        })
      });
      const data = await res.json();
      setTriciaResponse(data);
    } catch (error) {
      setTriciaResponse({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Debug - Tricia API</title>
      </Head>
      <main className="min-h-screen bg-gray-900 text-white p-8">
        <h1 className="text-3xl font-bold mb-8">Tricia API Debug</h1>
        
        <div className="space-y-4">
          <div>
            <button
              onClick={testApi}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              Test API Configuration
            </button>
          </div>

          <div>
            <button
              onClick={testTriciaConnection}
              disabled={loading}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            >
              Test Tricia Connection
            </button>
          </div>
        </div>

        {apiResponse && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-2">API Configuration Response:</h2>
            <pre className="bg-gray-800 p-4 rounded overflow-auto">
              {JSON.stringify(apiResponse, null, 2)}
            </pre>
          </div>
        )}

        {triciaResponse && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-2">Tricia Connection Response:</h2>
            <pre className="bg-gray-800 p-4 rounded overflow-auto">
              {JSON.stringify(triciaResponse, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-xl font-bold mb-2">Environment Info:</h2>
          <pre className="bg-gray-800 p-4 rounded">
            Test Mode: {process.env.NEXT_PUBLIC_TEST_MODE || 'not set'}
            Default User ID: {process.env.NEXT_PUBLIC_TRICIA_USER_ID || 'not set'}
          </pre>
        </div>
      </main>
    </>
  );
} 