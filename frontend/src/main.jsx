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
  typography: {
    fontFamily: '"Gilroy Regular", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontFamily: '"Gilroy Heavy", "Roboto", sans-serif', letterSpacing: "-0.02em" },
    h2: { fontFamily: '"Gilroy Bold", "Roboto", sans-serif', letterSpacing: "-0.01em" },
    h3: { fontFamily: '"Gilroy Bold", "Roboto", sans-serif', letterSpacing: "-0.01em" },
    h4: { fontFamily: '"Gilroy Bold", "Roboto", sans-serif' },
    h5: { fontFamily: '"Gilroy Medium", "Roboto", sans-serif' },
    h6: { fontFamily: '"Gilroy Medium", "Roboto", sans-serif' },
    button: { fontFamily: '"Gilroy Bold", "Roboto", sans-serif', textTransform: "none", letterSpacing: "0.02em" }
  },
  shape: {
    borderRadius: 12
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          boxShadow: "none",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            boxShadow: "0 6px 16px rgba(37, 99, 235, 0.25)",
            transform: "translateY(-1px)"
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 6px 24px rgba(0, 0, 0, 0.04)",
          border: "1px solid rgba(0, 0, 0, 0.04)",
          transition: "all 0.3s ease-in-out",
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16
        }
      }
    }
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
