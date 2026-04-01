import {
  Alert,
  Button,
  Card,
  CardContent,
  MenuItem,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const defaultForm = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  emergencyContact: "",
  address: "",
  gender: "Male",
  age: "",
  password: ""
};

function StudentRegistrationPage() {
  const [form, setForm] = useState(defaultForm);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { registerStudent } = useAuth();
  const navigate = useNavigate();

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setError("");
      setMessage("");
      setLoading(true);

      const response = await registerStudent({
        ...form,
        age: Number(form.age)
      });

      setMessage(response.message || "Registration successful. Verify your email OTP.");
      setTimeout(() => {
        navigate(`/verify-otp?email=${encodeURIComponent(form.email)}`);
      }, 900);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ maxWidth: 760, mx: "auto", mt: 4 }}>
      <CardContent>
        <Stack spacing={2} component="form" onSubmit={handleSubmit}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Student Registration
          </Typography>
          <Typography color="text.secondary">
            Use your @my.sliit.lk email address. OTP verification is mandatory.
          </Typography>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField label="First Name" value={form.firstName} onChange={(e) => update("firstName", e.target.value)} required fullWidth />
            <TextField label="Last Name" value={form.lastName} onChange={(e) => update("lastName", e.target.value)} required fullWidth />
          </Stack>

          <TextField label="SLIIT Email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} required />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField label="Phone Number" value={form.phoneNumber} onChange={(e) => update("phoneNumber", e.target.value)} required fullWidth />
            <TextField label="Emergency Contact" value={form.emergencyContact} onChange={(e) => update("emergencyContact", e.target.value)} required fullWidth />
          </Stack>

          <TextField label="Address" value={form.address} onChange={(e) => update("address", e.target.value)} required multiline minRows={2} />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField select label="Gender" value={form.gender} onChange={(e) => update("gender", e.target.value)} fullWidth>
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
            <TextField label="Age" type="number" value={form.age} onChange={(e) => update("age", e.target.value)} required fullWidth />
          </Stack>

          <TextField label="Password" type="password" value={form.password} onChange={(e) => update("password", e.target.value)} required />

          {error ? <Alert severity="error">{error}</Alert> : null}
          {message ? <Alert severity="success">{message}</Alert> : null}

          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? "Submitting..." : "Register"}
          </Button>

          <Button component={RouterLink} to="/login">Already have an account? Sign In</Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default StudentRegistrationPage;
