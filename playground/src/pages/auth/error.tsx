import { useRouter } from "next/router";
import { Button } from "@/components/button/Button";

export default function AuthError() {
  const router = useRouter();
  const { error } = router.query;

  const getErrorMessage = () => {
    switch (error) {
      case "Configuration":
        return "There is a problem with the server configuration.";
      case "AccessDenied":
        return "You do not have permission to sign in.";
      case "Verification":
        return "The verification token has expired or has already been used.";
      case "OAuthSignin":
        return "Error occurred while constructing an authorization URL.";
      case "OAuthCallback":
        return "Error occurred while handling the response from the OAuth provider.";
      case "OAuthCreateAccount":
        return "Could not create OAuth provider user in the database.";
      case "EmailCreateAccount":
        return "Could not create email provider user in the database.";
      case "Callback":
        return "Error occurred in the OAuth callback handler route.";
      case "OAuthAccountNotLinked":
        return "Email on the account is already linked with another account.";
      default:
        return "An unexpected error occurred during authentication.";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      <div className="w-full max-w-md px-4 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">
          Authentication Error
        </h1>
        <p className="text-gray-400 mb-8">
          {getErrorMessage()}
        </p>
        <div className="space-y-4">
          <Button
            accentColor="blue"
            className="w-full"
            onClick={() => router.push("/auth/signin")}
          >
            Try Again
          </Button>
          <Button
            accentColor="gray"
            className="w-full"
            onClick={() => router.push("/")}
          >
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
} 