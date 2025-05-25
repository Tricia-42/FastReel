import { useConfig } from "@/hooks/useConfig";
import { Button } from "./button/Button";
import { useState } from "react";
import { ConnectionMode } from "@/hooks/useConnection";
import { LoadingSVG } from "./button/LoadingSVG";

type PlaygroundConnectProps = {
  accentColor: string;
  onConnectClicked: (mode: ConnectionMode) => void;
};

export const PlaygroundConnect = ({
  accentColor,
  onConnectClicked,
}: PlaygroundConnectProps) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    if (password.toLowerCase() !== "tricia") {
      setError("Invalid access code");
      return;
    }
    
    setError("");
    setIsConnecting(true);
    
    try {
      // Password is correct, initiate Tricia connection
      onConnectClicked("tricia");
    } catch (err) {
      setError("Failed to connect. Please try again.");
      setIsConnecting(false);
    }
  };

  return (
    <div className="flex left-0 top-0 w-full h-full bg-black items-center justify-center">
      <div className="flex flex-col items-center gap-8 p-8 w-full max-w-md">
        <div className="flex flex-col items-center gap-3">
          {/* Title */}
          <h1 className="text-3xl font-semibold text-white">Ready to meet Tricia?</h1>
          <p className="text-gray-400 text-center">Start your guided memory journey</p>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4 w-full">
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isConnecting) {
                  handleConnect();
                }
              }}
              className={`w-full text-white text-sm bg-gray-900/50 border ${
                error ? 'border-red-500' : 'border-gray-800'
              } rounded-lg px-4 py-3 placeholder-gray-500 focus:outline-none focus:border-${accentColor}-500 transition-colors`}
              placeholder="Enter access code"
              disabled={isConnecting}
              autoFocus
            />
            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
          </div>
          
          <Button
            accentColor={accentColor}
            className="w-full py-3 rounded-lg font-medium"
            onClick={handleConnect}
            disabled={isConnecting || !password}
          >
            {isConnecting ? <LoadingSVG /> : "Connect"}
          </Button>
        </div>

        {/* Access code link */}
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>Get access code from</span>
          <a 
            href="mailto:i@heytricia.ai?subject=Access%20Code%20Request&body=Hi%2C%0A%0AI%20would%20like%20to%20request%20an%20access%20code%20for%20Tricia.%0A%0AThank%20you!"
            className={`text-${accentColor}-400 hover:text-${accentColor}-300 underline transition-colors`}
          >
            i@heytricia.ai
          </a>
        </div>
      </div>
    </div>
  );
};
