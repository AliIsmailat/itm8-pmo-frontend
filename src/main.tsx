import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { MsalProvider } from "@azure/msal-react";
import App from "./App";
import { msalInstance } from "./utils/msalConfig";

import "./index.css";

msalInstance.initialize().then(() => {
  msalInstance
    .handleRedirectPromise()
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
