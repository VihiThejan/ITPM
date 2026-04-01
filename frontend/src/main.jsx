import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";

import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./styles.css";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2563eb"
    },
    secondary: {
      main: "#ffedd5"
    },
    error: {
      main: "#dc2626"
    },
    accent: {
      main: "#dc2626"
    },
    background: {
      default: "#f4f7fb"
    }
  },
  shape: {
    borderRadius: 12
  }
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
