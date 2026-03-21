import { lazy, Suspense } from "react";
import { CircularProgress, Stack, Typography } from "@mui/material";
import { Route, Routes } from "react-router-dom";

import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PublicOnlyRoute from "./components/auth/PublicOnlyRoute";

const LandingPage = lazy(() => import("./pages/LandingPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const HomePage = lazy(() => import("./pages/HomePage"));
const BoardingSearchPage = lazy(() => import("./pages/BoardingSearchPage"));
const BoardingDetailsPage = lazy(() => import("./pages/BoardingDetailsPage"));
const BookmarksPage = lazy(() => import("./pages/BookmarksPage"));

function RouteFallback() {
  return (
    <Stack alignItems="center" justifyContent="center" spacing={1.5} sx={{ minHeight: "45vh" }}>
      <CircularProgress size={30} />
      <Typography color="text.secondary">Loading page...</Typography>
    </Stack>
  );
}

function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        <Route element={<AppLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/boardings" element={<BoardingSearchPage />} />
          <Route path="/boardings/:listingId" element={<BoardingDetailsPage />} />
          <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
            <Route path="/bookmarks" element={<BookmarksPage />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
