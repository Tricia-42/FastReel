import React, { useState } from "react";
import { Button } from "./button/Button";
import { LoadingSVG } from "./button/LoadingSVG";
import { ConnectionMode } from "@/hooks/useConnection";

interface PlaygroundConnectProps {
  accentColor: string;
  onConnectClicked: (mode: ConnectionMode) => void;
}

export const PlaygroundConnect: React.FC<PlaygroundConnectProps> = ({
  accentColor,
  onConnectClicked,
}) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  // Check if we're in test mode - only use environment variable
  const isTestMode = process.env.NEXT_PUBLIC_TEST_MODE === 'true';

  const handleConnectToPilot = async () => {
    // Skip password check in test mode
    if (!isTestMode && password.toLowerCase() !== "tricia") {
      setError("Incorrect password. Please try again.");
      return;
    }

    setError("");
    setIsConnecting(true);
    
    try {
      // Password is correct or in test mode, initiate Tricia connection
      await onConnectClicked("tricia");
    } catch (error) {
      setError("Connection failed. Please try again.");
      setIsConnecting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleConnectToPilot();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full max-w-md mx-auto px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">
          Ready to meet Tricia?
        </h1>
        <p className="text-gray-400 text-lg">
          Start your guided memory journey
        </p>
      </div>

      <div className="w-full space-y-4 mb-8">
        {!isTestMode && (
          <>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(""); // Clear error on input change
              }}
              onKeyPress={handleKeyPress}
              placeholder="Enter access code"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isConnecting}
            />
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}
          </>
        )}
        {isTestMode && (
          <p className="text-gray-400 text-sm text-center">
            Test mode enabled - no password required
          </p>
        )}
      </div>

      <Button
        accentColor={accentColor}
        className="w-full"
        onClick={handleConnectToPilot}
        disabled={isConnecting || (!isTestMode && !password)}
      >
        {isConnecting ? (
          <div className="flex items-center justify-center gap-2">
            <LoadingSVG />
            <span>Connecting...</span>
          </div>
        ) : (
          "Connect to Tricia"
        )}
      </Button>
    </div>
  );
};
