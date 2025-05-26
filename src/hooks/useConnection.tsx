"use client"

import { useCloud } from "@/cloud/useCloud";
import React, { createContext, useState } from "react";
import { useCallback } from "react";
import { useConfig } from "./useConfig";
import { useToast } from "@/components/toast/ToasterProvider";

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
          // Call Tricia API to create chat and get LiveKit details
          try {
            // Try using the proxy first to avoid CORS issues
            const useProxy = true; // Set to false to use direct API call
            const apiUrl = useProxy ? '/api/tricia-proxy' : `${process.env.NEXT_PUBLIC_TRICIA_BASE_URL || 'https://api.heytricia.ai/api/v1'}/chats`;
            
            // Use environment variables with fallback values
            const agentId = process.env.NEXT_PUBLIC_TRICIA_AGENT_ID || 'aa0b0d4e-bc28-4e4e-88c1-40b829b6fb9d';
            const userId = process.env.NEXT_PUBLIC_TRICIA_USER_ID || 'Xe9nkrHVetU1lHiK8wt7Ujf6SrH3';
            
            const payload = {
              agent_id: agentId,
              user_id: userId,  // Send both user_id and user_ids
              user_ids: [userId],  // API seems to require both fields
              metadata: {
                title: 'Tricia Pilot App Session'
              }
            };
            
            console.log('Calling Tricia API:', apiUrl);
            console.log('Using proxy:', useProxy);
            console.log('Request payload:', JSON.stringify(payload, null, 2));
            
            if (!useProxy) {
              console.log('Request headers:', {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer admin'
              });
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
            console.log('Response headers:', response.headers);
            console.log('Response ok:', response.ok);

            const responseText = await response.text();
            console.log('Raw response:', responseText);

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
            
            // Check if response is wrapped in a 'data' object or directly contains the fields
            const chatData = data.data || data;
            
            if (chatData.participant_token && chatData.server_url) {
              token = chatData.participant_token;
              url = chatData.server_url;
              console.log('Successfully got LiveKit credentials');
              console.log('Token:', token);
              console.log('Server URL:', url);
              console.log('Room Name:', chatData.room_name || 'Not provided');
              console.log('Chat ID:', chatData.id || 'Not provided');
              
              // Add a longer delay to ensure agent has time to fully initialize
              // This is especially important for first-time connections where the agent needs to cold start
              console.log('Waiting for agent to initialize...');
              await new Promise(resolve => setTimeout(resolve, 5000));
              
              // Decode JWT to check agent configuration
              try {
                const tokenParts = token.split('.');
                if (tokenParts.length === 3) {
                  const payload = JSON.parse(atob(tokenParts[1]));
                  console.log('JWT room config:', payload.roomConfig);
                  console.log('JWT issuer (API Key):', payload.iss);
                  console.log('JWT video grant:', payload.video);
                  
                  // Extract LiveKit server from URL
                  const serverMatch = url.match(/wss:\/\/([^\/]+)/);
                  if (serverMatch) {
                    console.log('LiveKit Server:', serverMatch[1]);
                  }
                }
              } catch (e) {
                console.log('Could not decode JWT for debugging');
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
          setConnectionDetails({ wsUrl: url, token, shouldConnect: true, mode });
        } else {
          console.error('Missing token or URL, not connecting');
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
    ]
  );

  const disconnect = useCallback(async () => {
    console.log('Disconnecting from LiveKit room...');
    setConnectionDetails((prev) => ({ ...prev, shouldConnect: false, wsUrl: "", token: "" }));
    // Give time for LiveKit to properly disconnect
    await new Promise(resolve => setTimeout(resolve, 100));
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