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
      main: "#0d47a1"
    },
    secondary: {
      main: "#00897b"
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
