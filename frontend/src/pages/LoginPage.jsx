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
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const roles = ["student", "owner"];

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();
  const redirectTo = location.state?.from?.pathname || "/home";

  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    phone: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setError("");
      setLoading(true);

      if (mode === "login") {
        await login({ email: form.email, password: form.password });
      } else {
        await register({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
          phone: form.phone
        });
      }

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
                {mode === "login" ? "Sign In" : "Create Account"}
              </Typography>
              <Typography color="text.secondary">
                {mode === "login"
                  ? "Access bookmarks and verified student review actions."
                  : "Students must use @my.sliit.lk email for verified access."}
              </Typography>

              {mode === "register" ? (
                <TextField
                  label="Full Name"
                  value={form.name}
                  onChange={(event) => update("name", event.target.value)}
                  required
                />
              ) : null}

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

              {mode === "register" ? (
                <>
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
                  <TextField
                    label="Phone (optional)"
                    value={form.phone}
                    onChange={(event) => update("phone", event.target.value)}
                  />
                </>
              ) : null}

              {error ? <Alert severity="error">{error}</Alert> : null}

              <Button variant="contained" type="submit" disabled={loading}>
                {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Register"}
              </Button>
              <Button
                variant="text"
                onClick={() => setMode((prev) => (prev === "login" ? "register" : "login"))}
              >
                {mode === "login"
                  ? "Need an account? Register"
                  : "Already have an account? Sign In"}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Grid2>
    </Grid2>
  );
}

export default LoginPage;
