import { PublicClientApplication } from "@azure/msal-browser";
import type { Configuration } from "@azure/msal-browser";

const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_MSAL_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_MSAL_TENANT_ID}`,
    redirectUri: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: "sessionStorage",
  },
};

// Used for login and acquiring tokens.
// We only request openid/profile/email since the SPA and API
// share the same app registration — requesting api:// scope for itself
// is not supported by Entra ID.
export const loginRequest = {
  scopes: ["openid", "profile", "email"],
};

// Re-export as apiTokenRequest for use in auth.ts
export const apiTokenRequest = loginRequest;

export const msalInstance = new PublicClientApplication(msalConfig);