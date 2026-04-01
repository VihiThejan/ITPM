import { Alert, Button, Card, CardContent, Chip, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import { useAuth } from "../context/AuthContext";
import { getHostelOwnerById, updateHostelOwnerById } from "../services/authService";

function HostelOwnerProfilePage() {
  const { user } = useAuth();
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) return;
      try {
        const response = await getHostelOwnerById(user.id);
        setForm(response.data);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Failed to load profile.");
      }
    };

    loadProfile();
  }, [user?.id]);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setError("");
      const response = await updateHostelOwnerById(user.id, {
        firstName: form.firstName,
        lastName: form.lastName,
        phoneNumber: form.phoneNumber,
        address: form.address,
        gender: form.gender
      });
      setForm(response.data);
      setMessage("Profile updated successfully.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Update failed.");
    }
  };

  if (!form) {
    return <Typography color="text.secondary">Loading profile...</Typography>;
  }

  return (
    <Card>
      <CardContent>
        <Stack spacing={2} component="form" onSubmit={handleSubmit}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Hostel Owner Profile
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Verification Status:
            </Typography>
            <Chip
              size="small"
              color={form.isVerified ? "success" : "warning"}
              label={form.isVerified ? "Verified" : "Pending verification"}
            />
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField label="First Name" value={form.firstName || ""} onChange={(e) => update("firstName", e.target.value)} fullWidth />
            <TextField label="Last Name" value={form.lastName || ""} onChange={(e) => update("lastName", e.target.value)} fullWidth />
          </Stack>

          <TextField label="Email" value={form.email || ""} disabled />
          <TextField label="Phone Number" value={form.phoneNumber || ""} onChange={(e) => update("phoneNumber", e.target.value)} />
          <TextField label="Address" value={form.address || ""} onChange={(e) => update("address", e.target.value)} multiline minRows={2} />

          {error ? <Alert severity="error">{error}</Alert> : null}
          {message ? <Alert severity="success">{message}</Alert> : null}

          <Button type="submit" variant="contained">Save Changes</Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default HostelOwnerProfilePage;
