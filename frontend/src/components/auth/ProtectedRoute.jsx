import { CircularProgress, Stack, Typography } from "@mui/material";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

function ProtectedRoute({ allowedRoles }) {
  const { user, isAuthLoading } = useAuth();
  const location = useLocation();

  if (isAuthLoading) {
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        spacing={1.5}
        sx={{ minHeight: "45vh" }}
      >
        <CircularProgress size={28} />
        <Typography color="text.secondary">Restoring your session...</Typography>
      </Stack>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles?.length && !allowedRoles.includes(user.role)) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
