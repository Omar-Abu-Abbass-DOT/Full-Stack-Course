import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider }      from "./context/AuthContext";
import { ThemeProvider }     from "./context/ThemeContext";
import { LanguageProvider }  from "./context/LanguageContext";
import { ToastProvider }     from "./context/ToastContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <ToastProvider>
            <FavoritesProvider>
              <AuthProvider>
                <App />
              </AuthProvider>
            </FavoritesProvider>
          </ToastProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
