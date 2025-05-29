"use client"

import { useCloud } from "@/cloud/useCloud";
import React, { createContext, useState } from "react";
import { useCallback } from "react";
import { useConfig } from "./useConfig";
import { useToast } from "@/components/toast/ToasterProvider";
import { useSession } from "next-auth/react";

export type ConnectionMode = "cloud" | "manual" | "env" | "tricia"

type TokenGeneratorData = {
  shouldConnect: boolean;
  wsUrl: string;
  token: string;
  mode: ConnectionMode;
  disconnect: () => Promise<void>;
  connect: (mode: ConnectionMode) => Promise<void>;
};

const ConnectionContext = createContext<TokenGeneratorData | undefined>(undefined);

export const ConnectionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { generateToken, wsUrl: cloudWSUrl } = useCloud();
  const { setToastMessage } = useToast();
  const { config } = useConfig();
  const { data: session } = useSession();
  const [connectionDetails, setConnectionDetails] = useState<{
    wsUrl: string;
    token: string;
    mode: ConnectionMode;
    shouldConnect: boolean;
  }>({ wsUrl: "", token: "", shouldConnect: false, mode: "manual" });

  const connect = useCallback(
    async (mode: ConnectionMode) => {
      let token = "";
      let url = "";
      
      try {
        if (mode === "cloud") {
          try {
            token = await generateToken();
          } catch (error) {
            setToastMessage({
              type: "error",
              message:
                "Failed to generate token, you may need to increase your role in this LiveKit Cloud project.",
            });
            return; // Exit early if token generation fails
          }
          url = cloudWSUrl;
        } else if (mode === "env") {
          if (!process.env.NEXT_PUBLIC_LIVEKIT_URL) {
            throw new Error("NEXT_PUBLIC_LIVEKIT_URL is not set");
          }
          url = process.env.NEXT_PUBLIC_LIVEKIT_URL;
          const params = new URLSearchParams();
          if (config.settings.room_name) {
            params.append('roomName', config.settings.room_name);
          }
          if (config.settings.participant_name) {
            params.append('participantName', config.settings.participant_name);
          }
          const { accessToken } = await fetch(`/api/token?${params}`).then((res) =>
            res.json()
          );
          token = accessToken;
        } else if (mode === "tricia") {
          console.log('[Connection] Connecting in tricia mode...');
          // Call Tricia API to create chat and get LiveKit details
          try {
            // Try using the proxy first to avoid CORS issues
            const useProxy = true; // Set to false to use direct API call
            const apiUrl = useProxy ? '/api/tricia-proxy' : `${process.env.NEXT_PUBLIC_TRICIA_BASE_URL || 'https://api.heytricia.ai/api/v1'}/chats`;
            
            // Use authenticated user ID if available, otherwise use environment variable or fallback
            let userId = process.env.NEXT_PUBLIC_TRICIA_USER_ID || 'Xe9nkrHVetU1lHiK8wt7Ujf6SrH3';
            
            // If user is authenticated, use their ID
            if (session?.user) {
              // Use NextAuth user ID which matches Firebase UID
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
                // Include authenticated user info in metadata
                user_email: session?.user?.email,
                user_name: session?.user?.name,
                auth_provider: session ? 'google' : 'anonymous'
              }
            };
            
            console.log('Calling Tricia API:', apiUrl);
            console.log('Using proxy:', useProxy);
            // console.log('Request payload:', JSON.stringify(payload, null, 2));
            
            if (!useProxy) {
              // console.log('Request headers:', {
              //   'Content-Type': 'application/json',
              //   'Authorization': 'Bearer admin'
              // });
            }
            
            const headers: HeadersInit = {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            };
            
            // Only add Authorization header for direct API calls
            if (!useProxy) {
              headers['Authorization'] = 'Bearer admin';
            }
            
            const response = await fetch(apiUrl, {
              method: 'POST',
              headers,
              mode: useProxy ? 'same-origin' : 'cors',
              body: JSON.stringify(payload)
            });

            console.log('Response status:', response.status);
            // console.log('Response headers:', response.headers);
            // console.log('Response ok:', response.ok);

            const responseText = await response.text();
            // console.log('Raw response:', responseText);

            if (!response.ok) {
              console.error('API Error - Status:', response.status);
              console.error('API Error - Response:', responseText);
              
              // Try to parse error details
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
                // If response is not JSON, include the raw text
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
            // console.log('Response structure keys:', Object.keys(data));
            
            // Check if response is wrapped in a 'data' object or directly contains the fields
            const chatData = data.data || data;
            // console.log('Chat data keys:', Object.keys(chatData));
            
            // Expected response fields: id, participant_name, participant_token, room_name, server_url
            if (chatData.participant_token && chatData.server_url) {
              token = chatData.participant_token;
              url = chatData.server_url;
              console.log('Successfully got LiveKit credentials');
              console.log('Chat ID:', chatData.id);
              console.log('Participant Name:', chatData.participant_name);
              console.log('Participant Token:', token.substring(0, 20) + '...');
              console.log('Room Name:', chatData.room_name);
              console.log('Server URL:', url);
              
              // Decode JWT to check agent configuration
              try {
                const tokenParts = token.split('.');
                if (tokenParts.length === 3) {
                  const payload = JSON.parse(atob(tokenParts[1]));
                  // console.log('JWT payload:', payload);
                  // console.log('JWT room config:', payload.roomConfig);
                  // console.log('JWT agent dispatch:', payload.roomConfig?.agents);
                  console.log('JWT issuer (API Key):', payload.iss);
                  // console.log('JWT video grant:', payload.video);
                  console.log('JWT room name from grant:', payload.video?.room);
                  console.log('JWT participant identity:', payload.sub);
                  
                  // Check video grant and agent config
                  if (payload.video) {
                    // console.log('=== JWT Token Video Grant ===');
                    // console.log('Room:', payload.video.room);
                    // console.log('Room Join:', payload.video.roomJoin);
                    // console.log('Can Publish:', payload.video.canPublish);
                    // console.log('Can Subscribe:', payload.video.canSubscribe);
                  }
                  
                  // Check room config for agent dispatch
                  if (payload.roomConfig) {
                    // console.log('=== JWT Token Room Config ===');
                    // console.log('Full roomConfig:', JSON.stringify(payload.roomConfig, null, 2));
                    
                    if (payload.roomConfig.agents && Array.isArray(payload.roomConfig.agents)) {
                      console.log(`Found ${payload.roomConfig.agents.length} agent(s) configured:`);
                      payload.roomConfig.agents.forEach((agent: any, index: number) => {
                        console.log(`Agent ${index + 1}:`, {
                          agentName: agent.agentName,
                          // metadata: agent.metadata
                        });
                        
                        // Try to parse agent metadata if it's a string
                        // if (agent.metadata && typeof agent.metadata === 'string') {
                        //   try {
                        //     const agentMeta = JSON.parse(agent.metadata);
                        //     console.log(`Agent ${index + 1} parsed metadata:`, agentMeta);
                        //   } catch (e) {
                        //     console.log(`Agent ${index + 1} metadata is not valid JSON`);
                        //   }
                        // }
                      });
                      console.log('✅ Agent dispatch is configured in token');
                    } else {
                      console.warn('⚠️ No agents configured in roomConfig');
                    }
                  } else {
                    console.warn('⚠️ No roomConfig in JWT token - agent dispatch may not work');
                  }
                  
                  // Extract LiveKit server from URL
                  const serverMatch = url.match(/wss:\/\/([^\/]+)/);
                  if (serverMatch) {
                    console.log('LiveKit Server:', serverMatch[1]);
                  }
                }
              } catch (e) {
                console.log('Could not decode JWT for debugging:', e);
              }
            } else {
              console.error('Invalid response structure:', data);
              throw new Error('Invalid response from Tricia API - missing LiveKit credentials');
            }
            
          } catch (error) {
            console.error('Tricia connection error:', error);
            
            // Check if it's a network error
            if (error instanceof TypeError && error.message.includes('fetch')) {
              setToastMessage({
                type: "error",
                message: `Network error: Unable to reach Tricia API. This might be a CORS issue. ${error.message}`,
              });
            } else {
              setToastMessage({
                type: "error",
                message: `Failed to connect to Tricia: ${error instanceof Error ? error.message : 'Unknown error'}`,
              });
            }
            return; // Exit early on error
          }
        } else {
          token = config.settings.token;
          url = config.settings.ws_url;
        }
        
        // Only set connection details if we have both token and URL
        if (token && url) {
          console.log('Setting connection details - URL:', url, 'Mode:', mode);
          console.log(`[${new Date().toISOString()}] Token acquired, preparing to connect...`);
          
          // Optional: Add a small delay to allow agent dispatch to initialize
          // This is a test to see if it's a race condition
          const AGENT_DISPATCH_DELAY = 0; // Set to 1000-2000ms to test
          if (AGENT_DISPATCH_DELAY > 0) {
            console.log(`Waiting ${AGENT_DISPATCH_DELAY}ms before connecting to allow agent dispatch...`);
            await new Promise(resolve => setTimeout(resolve, AGENT_DISPATCH_DELAY));
          }
          
          console.log(`[${new Date().toISOString()}] Connecting to LiveKit room...`);
          setConnectionDetails({ wsUrl: url, token, shouldConnect: true, mode });
          console.log('Connection details SET - LiveKit should now connect');
        } else {
          console.error('Missing token or URL, not connecting');
          console.error('Token:', token ? 'present' : 'missing');
          console.error('URL:', url ? url : 'missing');
          setToastMessage({
            type: "error",
            message: "Failed to get connection credentials",
          });
        }
      } catch (error) {
        console.error('Connection error:', error);
        setToastMessage({
          type: "error",
          message: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        });
      }
    },
    [
      cloudWSUrl,
      config.settings.token,
      config.settings.ws_url,
      config.settings.room_name,
      config.settings.participant_name,
      generateToken,
      setToastMessage,
      session,
    ]
  );

  const disconnect = useCallback(async () => {
    console.log('=== Disconnecting from LiveKit ===');
    console.log('Clearing connection details and state');
    setConnectionDetails({ 
      wsUrl: "", 
      token: "", 
      shouldConnect: false, 
      mode: "manual" 
    });
    console.log('Disconnection complete');
  }, []);

  return (
    <ConnectionContext.Provider
      value={{
        wsUrl: connectionDetails.wsUrl,
        token: connectionDetails.token,
        shouldConnect: connectionDetails.shouldConnect,
        mode: connectionDetails.mode,
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