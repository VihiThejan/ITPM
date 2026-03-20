import { Alert, Button, Grid2, IconButton, Stack, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import BoardingCard from "../components/boarding/BoardingCard";
import { removeBookmark, getBookmarks } from "../services/bookmarksService";
import { setAuthToken } from "../services/apiClient";

function BookmarksPage() {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState([]);
  const [error, setError] = useState("");

  const fetchBookmarks = async () => {
    if (!user) {
      setBookmarks([]);
      return;
    }

    try {
      setError("");
      const response = await getBookmarks();
      setBookmarks(response.items || []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to fetch bookmarks");
    }
  };

  useEffect(() => {
    setAuthToken(user?.token);
    fetchBookmarks();
  }, [user?.token]);

  const handleRemove = async (listingId) => {
    try {
      await removeBookmark(listingId);
      setBookmarks((prev) => prev.filter((item) => item.listing._id !== listingId));
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to remove bookmark");
    }
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h4" sx={{ fontWeight: 700 }}>
        My Bookmarks
      </Typography>

      {!user ? (
        <Alert
          severity="info"
          action={
            <Button color="inherit" size="small" component={RouterLink} to="/login">
              Sign In
            </Button>
          }
        >
          Sign in as a student to access bookmarks.
        </Alert>
      ) : null}

      {error ? <Alert severity="error">{error}</Alert> : null}

      {user && !bookmarks.length ? (
        <Alert severity="info">No saved boardings yet.</Alert>
      ) : (
        user ? <Grid2 container spacing={2}>
          {bookmarks.map((bookmark) => (
            <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={bookmark._id}>
              <Stack spacing={0.5}>
                <BoardingCard listing={bookmark.listing} />
                <IconButton
                  color="error"
                  onClick={() => handleRemove(bookmark.listing._id)}
                  sx={{ alignSelf: "flex-end" }}
                >
                  <DeleteIcon />
                </IconButton>
              </Stack>
            </Grid2>
          ))}
        </Grid2> : null
      )}
    </Stack>
  );
}

export default BookmarksPage;
