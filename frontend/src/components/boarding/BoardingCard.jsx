import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Typography
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { Link as RouterLink } from "react-router-dom";

import { formatLkr } from "../../utils/formatters";

function BoardingCard({ listing }) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardMedia
        component="img"
        height="180"
        image={listing.photos?.[0] || "https://placehold.co/600x400?text=Boarding"}
        alt={listing.title}
      />
      <CardContent>
        <Typography variant="h6" sx={{ mb: 0.5 }}>
          {listing.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          {listing.locationText}
        </Typography>

        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
          <Chip label={listing.roomType} size="small" color="primary" variant="outlined" />
          <Chip
            icon={<StarIcon fontSize="small" />}
            label={`${listing.averageRating || 0} (${listing.reviewCount || 0})`}
            size="small"
          />
        </Stack>

        <Typography variant="h6" color="secondary.main">
          {formatLkr(listing.rent)} / month
        </Typography>
      </CardContent>
      <CardActions>
        <Button component={RouterLink} to={`/boardings/${listing._id}`} variant="contained" fullWidth>
          View Details
        </Button>
      </CardActions>
    </Card>
  );
}

export default BoardingCard;
