import { msalInstance, loginRequest } from "./msalConfig";

// ─── Entra ID (MSAL) ────────────────────────────────────────────────

export function isEntraAuthenticated(): boolean {
  return msalInstance.getAllAccounts().length > 0;
}

/**
 * Acquire an Entra ID ID token silently.
 * Used in X-ZUMO-AUTH header to pass EasyAuth gate.
 */
export async function getEntraAccessToken(): Promise<string | null> {
  const accounts = msalInstance.getAllAccounts();
  if (accounts.length === 0) return null;

  try {
    const response = await msalInstance.acquireTokenSilent({
      ...loginRequest,
      account: accounts[0],
    });
    return response.idToken ?? null;
  } catch {
    try {
      const response = await msalInstance.acquireTokenPopup(loginRequest);
      return response.idToken ?? null;
    } catch (err) {
      console.error("Failed to acquire Entra ID token:", err);
      return null;
    }
  }
}

export function getCurrentAccount() {
  const accounts = msalInstance.getAllAccounts();
  return accounts.length > 0 ? accounts[0] : null;
}

export async function logout() {
  clearToken();
  await msalInstance.logoutRedirect({
    postLogoutRedirectUri: window.location.origin,
  });
}

// ─── App-level JWT (from /api/Auth/login) ────────────────────────────

export function isAuthenticated(): boolean {
  return getToken() !== null;
}

export function saveToken(token: string, remember: boolean) {
  if (remember) {
    localStorage.setItem("token", token);
  } else {
    sessionStorage.setItem("token", token);
  }
}

export function getToken(): string | null {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
}

export function clearToken() {
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");
}