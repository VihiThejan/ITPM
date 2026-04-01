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
const StudentRegistrationPage = lazy(() => import("./pages/StudentRegistrationPage"));
const HostelOwnerRegistrationPage = lazy(() => import("./pages/HostelOwnerRegistrationPage"));
const OtpVerificationPage = lazy(() => import("./pages/OtpVerificationPage"));
const StudentProfilePage = lazy(() => import("./pages/StudentProfilePage"));
const HostelOwnerProfilePage = lazy(() => import("./pages/HostelOwnerProfilePage"));
const AdminLoginPage = lazy(() => import("./pages/AdminLoginPage"));
const AdminDashboardPage = lazy(() => import("./pages/AdminDashboardPage"));
const RoommatesPage = lazy(() => import("./pages/RoommatesPage"));

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
          <Route path="/register-student" element={<StudentRegistrationPage />} />
          <Route path="/register-hostel-owner" element={<HostelOwnerRegistrationPage />} />
          <Route path="/verify-otp" element={<OtpVerificationPage />} />
          <Route path="/admin-login" element={<AdminLoginPage />} />
        </Route>

        <Route element={<AppLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/boardings" element={<BoardingSearchPage />} />
          <Route path="/boardings/:listingId" element={<BoardingDetailsPage />} />
          <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
            <Route path="/bookmarks" element={<BookmarksPage />} />
            <Route path="/student-profile" element={<StudentProfilePage />} />
            <Route path="/roommates" element={<RoommatesPage />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={["owner"]} />}>
            <Route path="/owner-dashboard" element={<HostelOwnerProfilePage />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
