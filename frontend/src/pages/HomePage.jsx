import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Grid2,
  Stack,
  Typography,
  Button,
  Box,
  CircularProgress,
  Rating,
  Chip,
  Paper
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { getListings } from "../services/listingsService";
import { formatLkr } from "../utils/formatters";

const actionCards = [
  {
    title: "Search Boardings",
    description: "Apply smart filters to discover places that match your budget and preferences.",
    action: "Find Now",
    to: "/boardings",
    icon: SearchIcon,
    color: "primary"
  },
  {
    title: "My Bookmarks",
    description: "Keep your shortlist organized and revisit listing details with one click.",
    action: "Open Bookmarks",
    to: "/bookmarks",
    icon: BookmarkIcon,
    color: "secondary"
  }
];

function HomePage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalListings: 0,
    avgRating: 0,
    priceRange: { min: 0, max: 0 }
  });

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const data = await getListings({ limit: 6 });
        const allListingsData = data.listings || [];
        
        setListings(allListingsData.slice(0, 6));

        if (allListingsData.length > 0) {
          const avgRating =
            allListingsData.reduce((sum, l) => sum + (l.averageRating || 0), 0) / allListingsData.length;
          const prices = allListingsData.map((l) => l.rent).filter((p) => p > 0);

          setStats({
            totalListings: allListingsData.length,
            avgRating: Math.round(avgRating * 10) / 10,
            priceRange: {
              min: Math.min(...prices) || 0,
              max: Math.max(...prices) || 0
            }
          });
        }
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  return (
    <Stack spacing={4}>
      {/* Hero Section */}
      <Paper
        elevation={0}
        sx={{
          background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
          borderRadius: 4,
          p: { xs: 4, md: 6 },
          color: "white",
          position: "relative",
          overflow: "hidden"
        }}
        className="animate-fade-in"
      >
        <Box sx={{ position: "absolute", top: -100, right: -50, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)" }} />
        <Stack spacing={2} sx={{ position: "relative", zIndex: 1 }}>
          <Typography variant="h3" sx={{ fontWeight: 800 }}>
            Welcome to BoardMe
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.95, fontWeight: 500 }}>
            Find your perfect student boarding in minutes
          </Typography>
          <Typography sx={{ opacity: 0.85, maxWidth: 500, lineHeight: 1.6 }}>
            Browse verified boarding listings, compare prices, read reviews from fellow students, and secure your spot near campus.
          </Typography>
          <Button
            component={RouterLink}
            to="/boardings"
            variant="contained"
            size="large"
            sx={{
              alignSelf: "flex-start",
              backgroundColor: "white",
              color: "#2563eb",
              fontWeight: 700,
              borderRadius: 50,
              px: 4,
              py: 1.5,
              mt: 1,
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                transform: "translateY(-2px)",
                boxShadow: "0 8px 16px rgba(0,0,0,0.1)"
              }
            }}
          >
            Start Searching Now
          </Button>
        </Stack>
      </Paper>

      {/* Statistics Section */}
      <Grid2 container spacing={2} className="animate-pop-in">
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ textAlign: "center", py: 1 }}>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 800, color: "primary.main" }}>
                {stats.totalListings}+
              </Typography>
              <Typography color="text.secondary" sx={{ fontWeight: 500, mt: 0.5 }}>Available Boardings</Typography>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ textAlign: "center", py: 1 }}>
            <CardContent>
              <Stack alignItems="center" spacing={0.5}>
                <Rating value={stats.avgRating} readOnly precision={0.1} size="small" />
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  {stats.avgRating}
                </Typography>
              </Stack>
              <Typography color="text.secondary" variant="small" sx={{ fontWeight: 500 }}>
                Average Rating
              </Typography>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ textAlign: "center", py: 1 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "success.main" }}>
                {formatLkr(stats.priceRange.min)}
              </Typography>
              <Typography color="text.secondary" variant="small" sx={{ fontWeight: 500, mt: 0.5 }}>
                Starting Price
              </Typography>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ textAlign: "center", py: 1 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "warning.main" }}>
                {formatLkr(stats.priceRange.max)}
              </Typography>
              <Typography color="text.secondary" variant="small" sx={{ fontWeight: 500, mt: 0.5 }}>
                Max Price
              </Typography>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>

      {/* Quick Action Cards */}
      <Stack spacing={1.5}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Quick Actions
        </Typography>
        <Grid2 container spacing={2}>
          {actionCards.map((card) => {
            const IconComponent = card.icon;
            return (
              <Grid2 size={{ xs: 12, md: 6 }} key={card.title}>
                <Card
                  sx={{
                    height: "100%",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: 3,
                      transform: "translateY(-4px)"
                    }
                  }}
                >
                  <CardContent>
                    <Stack spacing={1.5}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <IconComponent sx={{ color: `${card.color}.main`, fontSize: 28 }} />
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          {card.title}
                        </Typography>
                      </Box>
                      <Typography color="text.secondary">{card.description}</Typography>
                      <Button
                        component={RouterLink}
                        to={card.to}
                        variant="contained"
                        sx={{ alignSelf: "flex-start" }}
                      >
                        {card.action}
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid2>
            );
          })}
        </Grid2>
      </Stack>

      {/* Featured Listings Section */}
      <Stack spacing={1.5}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Featured Boardings
        </Typography>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : listings.length > 0 ? (
          <Grid2 container spacing={2}>
            {listings.map((listing) => (
              <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={listing._id}>
                <Card
                  component={RouterLink}
                  to={`/boardings/${listing._id}`}
                  sx={{
                    height: "100%",
                    textDecoration: "none",
                    cursor: "pointer",
                    overflow: "hidden",
                    "&:hover": {
                      boxShadow: "0 12px 28px rgba(0,0,0,0.1)",
                      "& .listing-img": { transform: "scale(1.05)" }
                    }
                  }}
                >
                  {listing.photos && listing.photos[0] && (
                    <Box sx={{ overflow: "hidden" }}>
                      <Box
                        component="img"
                        src={listing.photos[0]}
                        alt={listing.name}
                        className="listing-img"
                        sx={{
                          width: "100%",
                          height: 200,
                          objectFit: "cover",
                          backgroundColor: "action.hover",
                          transition: "transform 0.5s ease"
                        }}
                      />
                    </Box>
                  )}
                  <CardContent>
                    <Stack spacing={1}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, flex: 1 }}>
                          {listing.name}
                        </Typography>
                        {listing.averageRating > 0 && (
                          <Rating
                            value={listing.averageRating}
                            readOnly
                            precision={0.1}
                            size="small"
                            sx={{ ml: 1 }}
                          />
                        )}
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "text.secondary" }}>
                        <LocationOnIcon sx={{ fontSize: 18 }} />
                        <Typography variant="body2">{listing.location}</Typography>
                      </Box>

                      <Stack direction="row" spacing={0.5}>
                        {listing.roomType && (
                          <Chip label={listing.roomType} size="small" variant="outlined" />
                        )}
                      </Stack>

                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pt: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main" }}>
                          {formatLkr(listing.rent)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          per month
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid2>
            ))}
          </Grid2>
        ) : (
          <Card>
            <CardContent>
              <Typography color="text.secondary" align="center">
                No boardings available. Check back soon!
              </Typography>
            </CardContent>
          </Card>
        )}
        {listings.length > 0 && (
          <Button component={RouterLink} to="/boardings" variant="outlined" sx={{ alignSelf: "center", mt: 2 }}>
            View All Boardings
          </Button>
        )}
      </Stack>

      {/* CTA Section */}
      <Paper
        elevation={0}
        sx={{
          background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
          borderRadius: 2,
          p: 4,
          color: "white",
          textAlign: "center"
        }}
      >
        <Stack spacing={1.5}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Ready to Find Your Home?
          </Typography>
          <Typography sx={{ opacity: 0.95 }}>
            Browse our full listing and find the perfect boarding that fits your needs and budget.
          </Typography>
          <Button
            component={RouterLink}
            to="/boardings"
            variant="contained"
            size="large"
            sx={{
              alignSelf: "center",
              backgroundColor: "white",
              color: "#dc2626",
              fontWeight: 600,
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.9)"
              }
            }}
          >
            Explore Boardings Now
          </Button>
        </Stack>
      </Paper>
    </Stack>
  );
}

export default HomePage;
