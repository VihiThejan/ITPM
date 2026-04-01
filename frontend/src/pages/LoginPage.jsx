import {
  Alert,
  Button,
  Card,
  CardContent,
  Grid2,
  MenuItem,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { useState } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const roles = ["student", "owner", "admin"];

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithRole } = useAuth();
  const redirectTo = location.state?.from?.pathname || "/home";

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "student"
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setError("");
      setLoading(true);

      await loginWithRole({ email: form.email, password: form.password, role: form.role });

      navigate(redirectTo, { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid2 container justifyContent="center" sx={{ mt: 5 }}>
      <Grid2 size={{ xs: 12, sm: 10, md: 6, lg: 5 }}>
        <Card>
          <CardContent>
            <Stack spacing={2} component="form" onSubmit={handleSubmit}>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                Sign In
              </Typography>
              <Typography color="text.secondary">
                Use your role account. Student and owner accounts require OTP verification.
              </Typography>

              <TextField
                label="Email"
                type="email"
                value={form.email}
                onChange={(event) => update("email", event.target.value)}
                required
              />
              <TextField
                label="Password"
                type="password"
                value={form.password}
                onChange={(event) => update("password", event.target.value)}
                required
              />

              <TextField
                select
                label="Role"
                value={form.role}
                onChange={(event) => update("role", event.target.value)}
              >
                {roles.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </TextField>

              {error ? <Alert severity="error">{error}</Alert> : null}

              <Button variant="contained" type="submit" disabled={loading}>
                {loading ? "Please wait..." : "Sign In"}
              </Button>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                <Button component={RouterLink} to="/register-student">Register Student</Button>
                <Button component={RouterLink} to="/register-hostel-owner">Register Owner</Button>
                <Button component={RouterLink} to="/admin-login">Admin Login</Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Grid2>
    </Grid2>
  );
}

export default LoginPage;
