import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Typography,
  Box,
  Rating
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import { Link as RouterLink } from "react-router-dom";

import { formatLkr } from "../../utils/formatters";

function BoardingCard({ listing }) {
  const listingTitle = listing.name || listing.title || "Boarding Listing";
  const listingLocation = listing.locationText || listing.location || "Location not specified";
  const imageUrl = listing.photos?.[0] || "https://placehold.co/600x400?text=Boarding";
  const hasRating = listing.averageRating > 0;
  const reviewCount = listing.reviewCount || 0;

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "pointer",
        "&:hover": {
          boxShadow: 4,
          transform: "translateY(-4px)"
        }
      }}
    >
      {/* Image Section */}
      <Box sx={{ position: "relative", overflow: "hidden" }}>
        <CardMedia
          component="img"
          height="200"
          image={imageUrl}
          alt={listingTitle}
          sx={{
            transition: "transform 0.3s ease",
            "&:hover": {
              transform: "scale(1.05)"
            }
          }}
          onError={(e) => {
            e.target.src = "https://placehold.co/600x400?text=Boarding";
          }}
        />
        {/* Room Type Badge */}
        {listing.roomType && (
          <Chip
            label={listing.roomType.charAt(0).toUpperCase() + listing.roomType.slice(1)}
            size="small"
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              fontWeight: 600,
              textTransform: "capitalize"
            }}
          />
        )}
      </Box>

      {/* Content Section */}
      <CardContent sx={{ flex: 1 }}>
        <Stack spacing={1.5}>
          {/* Title */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              lineHeight: 1.3,
              color: "text.primary",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box"
            }}
          >
            {listingTitle}
          </Typography>

          {/* Location */}
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.5, color: "text.secondary" }}>
            <LocationOnIcon
              sx={{
                fontSize: 18,
                mt: -0.25,
                flexShrink: 0,
                color: "primary.main"
              }}
            />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {listingLocation}
            </Typography>
          </Box>

          {/* Rating Section */}
          {hasRating && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Rating
                  value={listing.averageRating}
                  readOnly
                  precision={0.1}
                  size="small"
                />
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  {listing.averageRating.toFixed(1)}
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">
                ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
              </Typography>
            </Box>
          )}

          {/* Contact Info */}
          {listing.whatsappContact && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "text.secondary" }}>
              <PhoneIcon sx={{ fontSize: 16 }} />
              <Typography variant="caption">WhatsApp Contact Available</Typography>
            </Box>
          )}

          {/* Spacer */}
          <Box sx={{ flex: 1 }} />

          {/* Price Section */}
          <Box
            sx={{
              pt: 1.5,
              borderTop: "1px solid",
              borderColor: "divider"
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Starting from
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: "primary.main"
              }}
            >
              {formatLkr(listing.rent)}
              <Typography
                component="span"
                variant="body2"
                sx={{ color: "text.secondary", fontWeight: 500, ml: 0.5 }}
              >
                /month
              </Typography>
            </Typography>
          </Box>
        </Stack>
      </CardContent>

      {/* Actions */}
      <CardActions sx={{ pt: 0 }}>
        <Button
          component={RouterLink}
          to={`/boardings/${listing._id}`}
          variant="contained"
          fullWidth
          sx={{
            fontWeight: 600,
            py: 1,
            textTransform: "none"
          }}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
}

export default BoardingCard;
