import {
  Alert,
  Button,
  Card,
  CardContent,
  Chip,
  Grid2,
  Link,
  Rating,
  Stack,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";

import ReviewForm from "../components/reviews/ReviewForm";
import ReviewList from "../components/reviews/ReviewList";
import { useAuth } from "../context/AuthContext";
import { addBookmark } from "../services/bookmarksService";
import { getListingById } from "../services/listingsService";
import { createReview, getReviewsByListingId } from "../services/reviewsService";
import { formatLkr, toWhatsAppUrl } from "../utils/formatters";

function BoardingDetailsPage() {
  const { listingId } = useParams();
  const { user } = useAuth();

  const [listing, setListing] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setError("");
        const [listingData, reviewsData] = await Promise.all([
          getListingById(listingId),
          getReviewsByListingId(listingId)
        ]);
        setListing(listingData);
        setReviews(reviewsData.items || []);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Failed to load listing details");
      }
    };

    load();
  }, [listingId]);

  const handleBookmark = async () => {
    if (!user) {
      setError("Please sign in to bookmark listings.");
      return;
    }

    try {
      await addBookmark(listingId);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to bookmark listing");
    }
  };

  const handleCreateReview = async ({ rating, comment }) => {
    try {
      await createReview({
        listingId,
        rating,
        comment
      });
      const updatedReviews = await getReviewsByListingId(listingId);
      setReviews(updatedReviews.items || []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to submit review");
    }
  };

  if (!listing) {
    return error ? <Alert severity="error">{error}</Alert> : <Typography>Loading...</Typography>;
  }

  const mapQuery = encodeURIComponent(`${listing.locationText}, Malabe, Sri Lanka`);

  return (
    <Grid2 container spacing={2.5}>
      <Grid2 size={{ xs: 12, md: 8 }}>
        <Stack spacing={2}>
          <img
            src={listing.photos?.[0] || "https://placehold.co/900x420?text=Boarding"}
            alt={listing.title}
            style={{ width: "100%", borderRadius: 12, maxHeight: 420, objectFit: "cover" }}
          />
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {listing.title}
          </Typography>
          <Typography color="text.secondary">{listing.locationText}</Typography>
          <Typography variant="h5" color="secondary.main">
            {formatLkr(listing.rent)} / month
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {(listing.facilities || []).map((facility) => (
              <Chip key={facility} label={facility} />
            ))}
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Rating readOnly value={listing.averageRating || 0} precision={0.5} />
            <Typography color="text.secondary">({listing.reviewCount || 0} reviews)</Typography>
          </Stack>

          <Stack direction="row" spacing={1.5}>
            <Button variant="contained" onClick={handleBookmark}>
              Save to Bookmarks
            </Button>
            <Button
              component={Link}
              href={toWhatsAppUrl(
                listing.whatsappNumber,
                `Hi, I found your boarding listing on BoardMe (${listing.title}). Is it available?`
              )}
              target="_blank"
              rel="noopener noreferrer"
              variant="outlined"
            >
              Contact on WhatsApp
            </Button>
          </Stack>

          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1.5 }}>
                Map
              </Typography>
              <iframe
                title="Boarding location map"
                src={`https://www.openstreetmap.org/export/embed.html?search=${mapQuery}`}
                style={{ width: "100%", height: 320, border: 0, borderRadius: 8 }}
              />
            </CardContent>
          </Card>
        </Stack>
      </Grid2>

      <Grid2 size={{ xs: 12, md: 4 }}>
        <Stack spacing={2}>
          <Card variant="outlined">
            <CardContent>
              <ReviewList reviews={reviews} />
            </CardContent>
          </Card>

          {user?.role === "student" && user?.isVerifiedStudent ? (
            <Card variant="outlined">
              <CardContent>
                <ReviewForm onSubmit={handleCreateReview} />
              </CardContent>
            </Card>
          ) : (
            <Alert
              severity="info"
              action={
                !user ? (
                  <Button component={RouterLink} to="/login" size="small" color="inherit">
                    Sign In
                  </Button>
                ) : null
              }
            >
              {user
                ? "Only verified students can submit ratings and comments."
                : "Sign in as a verified student to submit ratings and comments."}
            </Alert>
          )}

          {error ? <Alert severity="error">{error}</Alert> : null}
        </Stack>
      </Grid2>
    </Grid2>
  );
}

export default BoardingDetailsPage;
