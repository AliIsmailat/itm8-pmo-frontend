import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from "./utils/msalConfig";
import App from "./App";

import "./index.css";

msalInstance.initialize().then(() => {
  msalInstance
    .handleRedirectPromise()  // CODER REVIEW: Denna är inte nödvändig att anropa manuellt, den körs automatiskt av MSAL när appen startar. Se https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/FAQ.md#how-do-i-handle-the-redirect-flow-in-a-react-app
    .then(() => {
      ReactDOM.createRoot(document.getElementById("root")!).render(
        <React.StrictMode>
          <MsalProvider instance={msalInstance}>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </MsalProvider>
        </React.StrictMode>,
      );
    })
    .catch((error) => {
      console.error("MSAL redirect error:", error);
    });
});
