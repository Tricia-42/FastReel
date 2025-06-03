"use client"

import React, { createContext, useState } from "react";
import { useCallback } from "react";
import { useToast } from "@/components/toast/ToasterProvider";
import { useSession } from "next-auth/react";

// Since we only use "tricia" mode, we can simplify this
export type ConnectionMode = "tricia";

type TokenGeneratorData = {
  shouldConnect: boolean;
  wsUrl: string;
  token: string;
  disconnect: () => Promise<void>;
  connect: () => Promise<void>; // Removed mode parameter since it's always "tricia"
};

const ConnectionContext = createContext<TokenGeneratorData | undefined>(undefined);

export const ConnectionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { setToastMessage } = useToast();
  const { data: session } = useSession();
  const [connectionDetails, setConnectionDetails] = useState<{
    wsUrl: string;
    token: string;
    shouldConnect: boolean;
  }>({ wsUrl: "", token: "", shouldConnect: false });

  const connect = useCallback(
    async () => {
      let token = "";
      let url = "";
      
      try {
        console.log('[Connection] Connecting to Tricia...');
        
        // Always use the proxy to avoid CORS issues
        const apiUrl = '/api/tricia';
        
        // Use authenticated user ID if available
        let userId = process.env.NEXT_PUBLIC_TRICIA_USER_ID || 'Xe9nkrHVetU1lHiK8wt7Ujf6SrH3';
        
        if (session?.user) {
          userId = session.user.id || userId;
          console.log('Using authenticated user ID:', session.user.id);
          console.log('User email:', session.user.email);
        } else {
          console.log('No authenticated user, using default user ID');
        }
        
        const payload = {
          user_id: userId,
          metadata: {
            title: 'Tricia Pilot App Session',
            user_email: session?.user?.email,
            user_name: session?.user?.name,
            auth_provider: session ? 'google' : 'anonymous'
          }
        };
        
        console.log('Calling Tricia API:', apiUrl);
        
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        console.log('Response status:', response.status);

        const responseText = await response.text();

        if (!response.ok) {
          console.error('API Error - Status:', response.status);
          console.error('API Error - Response:', responseText);
          
          let errorMessage = `Failed to create chat: ${response.status} ${response.statusText}`;
          try {
            const errorData = JSON.parse(responseText);
            if (errorData.detail) {
              errorMessage += `. ${errorData.detail}`;
            }
            if (errorData.message) {
              errorMessage += `. ${errorData.message}`;
            }
            if (errorData.error) {
              errorMessage = errorData.error;
              if (errorData.message) {
                errorMessage += `: ${errorData.message}`;
              }
            }
          } catch (e) {
            errorMessage += `. ${responseText}`;
          }
          
          throw new Error(errorMessage);
        }

        let data;
        try {
          data = JSON.parse(responseText);
        } catch (e) {
          console.error('Failed to parse response as JSON:', e);
          throw new Error('Invalid JSON response from server');
        }
        
        console.log('Parsed API Response data:', data);
        
        // Check if response is wrapped in a 'data' object or directly contains the fields
        const chatData = data.data || data;
        
        // Expected response fields: id, participant_name, participant_token, room_name, server_url
        if (chatData.participant_token && chatData.server_url) {
          token = chatData.participant_token;
          url = chatData.server_url;
          console.log('Successfully got LiveKit credentials');
          console.log('Chat ID:', chatData.id);
          console.log('Participant Name:', chatData.participant_name);
          console.log('Room Name:', chatData.room_name);
          console.log('Server URL:', url);
          
          // Decode JWT to check agent configuration
          try {
            const tokenParts = token.split('.');
            if (tokenParts.length === 3) {
              const payload = JSON.parse(atob(tokenParts[1]));
              console.log('JWT issuer (API Key):', payload.iss);
              console.log('JWT room name from grant:', payload.video?.room);
              console.log('JWT participant identity:', payload.sub);
              
              if (payload.roomConfig?.agents && Array.isArray(payload.roomConfig.agents)) {
                console.log(`Found ${payload.roomConfig.agents.length} agent(s) configured:`);
                payload.roomConfig.agents.forEach((agent: any, index: number) => {
                  console.log(`Agent ${index + 1}:`, {
                    agentName: agent.agentName,
                  });
                });
                console.log('✅ Agent dispatch is configured in token');
              } else {
                console.warn('⚠️ No agents configured in roomConfig');
              }
            }
          } catch (e) {
            console.log('Could not decode JWT for debugging:', e);
          }
        } else {
          console.error('Invalid response structure:', data);
          throw new Error('Invalid response from Tricia API - missing LiveKit credentials');
        }
        
        // Set connection details if we have both token and URL
        if (token && url) {
          console.log('Setting connection details - URL:', url);
          console.log(`[${new Date().toISOString()}] Token acquired, preparing to connect...`);
          console.log(`[${new Date().toISOString()}] Connecting to LiveKit room...`);
          setConnectionDetails({ wsUrl: url, token, shouldConnect: true });
          console.log('Connection details SET - LiveKit should now connect');
        } else {
          throw new Error('Failed to get connection credentials');
        }
      } catch (error) {
        console.error('Tricia connection error:', error);
        
        if (error instanceof TypeError && error.message.includes('fetch')) {
          setToastMessage({
            type: "error",
            message: `Network error: Unable to reach Tricia API. ${error.message}`,
          });
        } else {
          setToastMessage({
            type: "error",
            message: `Failed to connect to Tricia: ${error instanceof Error ? error.message : 'Unknown error'}`,
          });
        }
      }
    },
    [setToastMessage, session]
  );

  const disconnect = useCallback(async () => {
    console.log('=== Disconnecting from LiveKit ===');
    console.log('Clearing connection details and state');
    setConnectionDetails({ 
      wsUrl: "", 
      token: "", 
      shouldConnect: false
    });
    console.log('Disconnection complete');
  }, []);

  return (
    <ConnectionContext.Provider
      value={{
        wsUrl: connectionDetails.wsUrl,
        token: connectionDetails.token,
        shouldConnect: connectionDetails.shouldConnect,
        connect,
        disconnect,
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
};

export const useConnection = () => {
  const context = React.useContext(ConnectionContext);
  if (context === undefined) {
    throw new Error("useConnection must be used within a ConnectionProvider");
  }
  return context;
}