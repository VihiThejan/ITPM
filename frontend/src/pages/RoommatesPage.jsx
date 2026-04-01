import {
  Alert,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";

import { useAuth } from "../context/AuthContext";
import { createRoommatePost, getRoommatePosts } from "../services/roommatesService";

const initialForm = {
  title: "",
  description: "",
  preferredLocation: "",
  budgetMin: "",
  budgetMax: "",
  contactPhone: ""
};

function RoommatesPage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadPosts = async () => {
    try {
      const response = await getRoommatePosts();
      setItems(response.items || []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to load roommate posts.");
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setError("");
      setMessage("");
      await createRoommatePost({
        ...form,
        budgetMin: Number(form.budgetMin || 0),
        budgetMax: Number(form.budgetMax || 0)
      });
      setForm(initialForm);
      setMessage("Post submitted for moderation.");
      await loadPosts();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to create roommate post.");
    }
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h4" sx={{ fontWeight: 700 }}>
        Roommates
      </Typography>

      {!user?.isVerifiedStudent ? (
        <Alert severity="warning">
          Only verified students can access and post roommate requests.
        </Alert>
      ) : null}

      {error ? <Alert severity="error">{error}</Alert> : null}
      {message ? <Alert severity="success">{message}</Alert> : null}

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Create Roommate Post
          </Typography>
          <Stack spacing={2} component="form" onSubmit={handleSubmit}>
            <TextField label="Title" value={form.title} onChange={(e) => update("title", e.target.value)} required />
            <TextField label="Description" value={form.description} onChange={(e) => update("description", e.target.value)} multiline minRows={3} required />
            <TextField label="Preferred Location" value={form.preferredLocation} onChange={(e) => update("preferredLocation", e.target.value)} />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField label="Budget Min" type="number" value={form.budgetMin} onChange={(e) => update("budgetMin", e.target.value)} fullWidth />
              <TextField label="Budget Max" type="number" value={form.budgetMax} onChange={(e) => update("budgetMax", e.target.value)} fullWidth />
            </Stack>
            <TextField label="Contact Phone" value={form.contactPhone} onChange={(e) => update("contactPhone", e.target.value)} />
            <Button type="submit" variant="contained">Submit Post</Button>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Approved Roommate Posts
          </Typography>
          <Stack spacing={2}>
            {items.map((item) => (
              <Card key={item._id} variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    {item.title}
                  </Typography>
                  <Typography color="text.secondary">{item.description}</Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {item.preferredLocation ? `Location: ${item.preferredLocation}` : "Location not specified"}
                  </Typography>
                </CardContent>
              </Card>
            ))}
            {!items.length ? (
              <Typography color="text.secondary">No approved roommate posts yet.</Typography>
            ) : null}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}

export default RoommatesPage;
