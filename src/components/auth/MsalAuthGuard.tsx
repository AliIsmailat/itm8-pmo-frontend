import React, { useEffect } from "react";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { InteractionStatus } from "@azure/msal-browser";
import { loginRequest } from "../../utils/msalConfig";
import LoadingSpinner from "../ui/LoadingSpinner";

interface MsalAuthGuardProps {
  children: React.ReactNode;
}

const MsalAuthGuard: React.FC<MsalAuthGuardProps> = ({ children }) => {
  const { instance, inProgress } = useMsal();
  const isEntraAuthenticated = useIsAuthenticated();

  useEffect(() => {
    if (!isEntraAuthenticated && inProgress === InteractionStatus.None) {
      instance.loginRedirect(loginRequest);
    }
  }, [isEntraAuthenticated, inProgress, instance]);

  // CODE REVIEW: Nedan if-satser renderar i princip samma ui. Gör en liten komponent för det.

  if (inProgress !== InteractionStatus.None) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner />
          <p className="text-sm text-gray-500">Verifierar företagsinloggning...</p>
        </div>
      </div>
    );
  }

  if (!isEntraAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner />
          <p className="text-sm text-gray-500">Omdirigerar till företagsportalen...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default MsalAuthGuard;