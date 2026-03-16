const TOKEN_KEY = "pmo_token";
const SESSION_KEY = "pmo_token_session";

export function saveToken(token: string, remember: boolean) {
  if (remember) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    sessionStorage.setItem(SESSION_KEY, token);
  }
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(SESSION_KEY);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(SESSION_KEY);
}

export function isAuthenticated(): boolean {
  return getToken() !== null;
}