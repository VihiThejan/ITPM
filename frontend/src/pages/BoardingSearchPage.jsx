import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid2,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Skeleton,
  Stack,
  Typography,
  Chip
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import FilterListIcon from "@mui/icons-material/FilterList";
import TuneIcon from "@mui/icons-material/Tune";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";

import BoardingCard from "../components/boarding/BoardingCard";
import FilterPanel from "../components/search/FilterPanel";
import { useAuth } from "../context/AuthContext";
import { clearRecentlyViewed, getRecentlyViewed } from "../services/historyService";
import { getListings } from "../services/listingsService";
import { formatLkr } from "../utils/formatters";
import {
  clearLocalRecentlyViewed,
  getLocalRecentlyViewed
} from "../utils/recentlyViewed";

const defaultFilters = {
  location: "",
  minPrice: 10000,
  maxPrice: 50000,
  roomType: "",
  facilities: []
};

function BoardingSearchPage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(defaultFilters);
  const [data, setData] = useState({ listings: [], pagination: { page: 1, totalPages: 1, total: 0 } });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [compareListings, setCompareListings] = useState([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [isRecentLoading, setIsRecentLoading] = useState(false);

  const page = Number(searchParams.get("page") || 1);

  const toQueryParams = (currentFilters, currentPage) => {
    const params = {
      page: currentPage,
      minPrice: currentFilters.minPrice,
      maxPrice: currentFilters.maxPrice
    };

    if (currentFilters.location?.trim()) {
      params.location = currentFilters.location.trim();
    }

    if (currentFilters.roomType) {
      params.roomType = currentFilters.roomType;
    }

    if (currentFilters.facilities.length) {
      params.facilities = currentFilters.facilities.join(",");
    }

    return params;
  };

  const fetchData = async (currentFilters, currentPage) => {
    try {
      setError("");
      setLoading(true);
      const response = await getListings(toQueryParams(currentFilters, currentPage));

      const listings = response.items || response.listings || [];
      
      // Apply sorting
      let sorted = [...listings];
      if (sortBy === "price-low") {
        sorted.sort((a, b) => a.rent - b.rent);
      } else if (sortBy === "price-high") {
        sorted.sort((a, b) => b.rent - a.rent);
      } else if (sortBy === "rating") {
        sorted.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
      }
      
      setData({
        listings: sorted,
        pagination: response.pagination || { page: currentPage, totalPages: 1, total: sorted.length }
      });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to load boardings. Please try again.");
      setData({ listings: [], pagination: { page: 1, totalPages: 1, total: 0 } });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(filters, page);
  }, [page, sortBy]);

  const loadRecentlyViewed = async () => {
    setIsRecentLoading(true);

    const localItems = getLocalRecentlyViewed();
    let serverItems = [];

    if (user?.role === "student") {
      try {
        const response = await getRecentlyViewed(5);
        serverItems = response.items || [];
      } catch (error) {
        serverItems = [];
      }
    }

    const merged = [...serverItems, ...localItems].reduce((acc, item) => {
      const key = item?._id;
      if (!key || acc.some((existing) => existing._id === key)) {
        return acc;
      }
      return [...acc, item];
    }, []);

    setRecentlyViewed(merged.slice(0, 5));
    setIsRecentLoading(false);
  };

  useEffect(() => {
    loadRecentlyViewed();
  }, [user?.token, user?.role]);

  const handleClearRecentlyViewed = async () => {
    clearLocalRecentlyViewed();

    if (user?.role === "student") {
      try {
        await clearRecentlyViewed();
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Failed to clear recently viewed history.");
      }
    }

    setRecentlyViewed([]);
  };

  const handleApplyFilters = () => {
    setSearchParams({ page: "1" });
    fetchData(filters, 1);
    setMobileFilterOpen(false);
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    setSortBy("newest");
    setSearchParams({ page: "1" });
    fetchData(defaultFilters, 1);
  };

  const handleToggleCompare = (listing) => {
    const exists = compareListings.some((item) => item._id === listing._id);
    if (exists) {
      setCompareListings((prev) => prev.filter((item) => item._id !== listing._id));
      return;
    }

    if (compareListings.length >= 3) {
      setError("You can compare up to 3 boardings at a time.");
      return;
    }

    setError("");
    setCompareListings((prev) => [...prev, listing]);
  };

  const isInCompare = (listingId) => compareListings.some((item) => item._id === listingId);

  const hasActiveFilters = 
    filters.location.trim() !== "" || 
    filters.roomType !== "" || 
    filters.facilities.length > 0 ||
    filters.minPrice !== defaultFilters.minPrice ||
    filters.maxPrice !== defaultFilters.maxPrice;

  // Skeleton loader
  const SkeletonCard = () => (
    <Card sx={{ height: "100%" }}>
      <Skeleton variant="rectangular" height={180} />
      <CardContent>
        <Skeleton variant="text" sx={{ mb: 1 }} />
        <Skeleton variant="text" width="60%" sx={{ mb: 1.5 }} />
        <Skeleton variant="rectangular" height={24} width="40%" sx={{ mb: 1 }} />
        <Skeleton variant="text" width="50%" />
      </CardContent>
    </Card>
  );

  return (
    <Stack spacing={3}>
      {/* Header Section */}
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
          Discover Boardings
        </Typography>
        <Typography color="text.secondary">
          Find the perfect boarding near SLIIT Malabe
        </Typography>
      </Box>

      <Card variant="outlined">
        <CardContent>
          <Stack spacing={1.5}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Recently Viewed
              </Typography>
              <Button
                size="small"
                color="inherit"
                onClick={handleClearRecentlyViewed}
                disabled={!recentlyViewed.length || isRecentLoading}
                sx={{ textTransform: "none" }}
              >
                Clear
              </Button>
            </Stack>

            {isRecentLoading ? (
              <Typography color="text.secondary">Loading recently viewed boardings...</Typography>
            ) : recentlyViewed.length ? (
              <Grid2 container spacing={1.5}>
                {recentlyViewed.map((item) => (
                  <Grid2 key={item._id} size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
                    <Card variant="outlined" sx={{ height: "100%" }}>
                      <CardContent>
                        <Stack spacing={0.75}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                            {item.title || item.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {item.locationText || item.location}
                          </Typography>
                          <Typography variant="body2" color="primary.main" sx={{ fontWeight: 700 }}>
                            {formatLkr(item.rent)}
                          </Typography>
                          <Button
                            component={RouterLink}
                            to={`/boardings/${item._id}`}
                            size="small"
                            variant="text"
                            sx={{ px: 0, justifyContent: "flex-start" }}
                          >
                            View Again
                          </Button>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid2>
                ))}
              </Grid2>
            ) : (
              <Typography color="text.secondary">
                No recently viewed boardings yet. Open any listing to build your history.
              </Typography>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {/* Main Content Grid */}
      <Grid2 container spacing={3}>
        {/* Filters Sidebar - Desktop */}
        <Grid2 size={{ xs: 0, md: 3 }} sx={{ display: { xs: "none", md: "block" } }}>
          <FilterPanel
            filters={filters}
            onChange={(key, value) => setFilters((prev) => ({ ...prev, [key]: value }))}
            onSubmit={handleApplyFilters}
            onReset={handleReset}
          />
        </Grid2>

        {/* Results Section */}
        <Grid2 size={{ xs: 12, md: 9 }}>
          <Stack spacing={2.5}>
            {/* Results Toolbar */}
            <Paper elevation={0} sx={{ p: 2, backgroundColor: "action.hover", borderRadius: 1 }}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                spacing={2}
              >
                {/* Result Count */}
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {loading ? "Loading..." : `${data.pagination.total} boarding${data.pagination.total !== 1 ? "s" : ""} found`}
                  </Typography>
                  {hasActiveFilters && (
                    <Button
                      size="small"
                      onClick={handleReset}
                      sx={{ mt: 0.5, textTransform: "none" }}
                    >
                      Clear all filters
                    </Button>
                  )}
                </Box>

                {/* Sort Dropdown & Mobile Filter */}
                <Stack direction="row" spacing={1} sx={{ width: { xs: "100%", sm: "auto" } }}>
                  <Button
                    variant={compareListings.length >= 2 ? "contained" : "outlined"}
                    startIcon={<CompareArrowsIcon />}
                    disabled={compareListings.length < 2}
                    onClick={() => setIsCompareOpen(true)}
                    sx={{ whiteSpace: "nowrap" }}
                  >
                    Compare ({compareListings.length})
                  </Button>
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    size="small"
                    sx={{ flex: 1, minWidth: 150 }}
                  >
                    <MenuItem value="newest">Newest First</MenuItem>
                    <MenuItem value="price-low">Price: Low to High</MenuItem>
                    <MenuItem value="price-high">Price: High to Low</MenuItem>
                    <MenuItem value="rating">Highest Rated</MenuItem>
                  </Select>
                  <Button
                    variant={mobileFilterOpen ? "contained" : "outlined"}
                    startIcon={<TuneIcon />}
                    onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                    sx={{ display: { xs: "flex", md: "none" } }}
                  >
                    Filters
                  </Button>
                </Stack>
              </Stack>
            </Paper>

            {/* Mobile Filter Panel */}
            {mobileFilterOpen && (
              <Box sx={{ display: { xs: "block", md: "none" } }}>
                <Card>
                  <CardContent>
                    <FilterPanel
                      filters={filters}
                      onChange={(key, value) => setFilters((prev) => ({ ...prev, [key]: value }))}
                      onSubmit={handleApplyFilters}
                      onReset={handleReset}
                    />
                  </CardContent>
                </Card>
              </Box>
            )}

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {filters.location && (
                  <Chip
                    label={`Location: ${filters.location}`}
                    onDelete={() => setFilters((prev) => ({ ...prev, location: "" }))}
                    size="small"
                  />
                )}
                {filters.roomType && (
                  <Chip
                    label={`Room: ${filters.roomType}`}
                    onDelete={() => setFilters((prev) => ({ ...prev, roomType: "" }))}
                    size="small"
                  />
                )}
                {filters.facilities.map((facility) => (
                  <Chip
                    key={facility}
                    label={facility}
                    onDelete={() =>
                      setFilters((prev) => ({
                        ...prev,
                        facilities: prev.facilities.filter((f) => f !== facility)
                      }))
                    }
                    size="small"
                  />
                ))}
              </Stack>
            )}

            {/* Listings Grid */}
            {loading ? (
              <Grid2 container spacing={2}>
                {[...Array(6)].map((_, i) => (
                  <Grid2 key={i} size={{ xs: 12, sm: 6, md: 6 }}>
                    <SkeletonCard />
                  </Grid2>
                ))}
              </Grid2>
            ) : data.listings.length > 0 ? (
              <Grid2 container spacing={2}>
                {data.listings.map((listing) => (
                  <Grid2 key={listing._id} size={{ xs: 12, sm: 6, md: 6 }}>
                    <Stack spacing={1}>
                      <BoardingCard listing={listing} />
                      <Button
                        variant={isInCompare(listing._id) ? "contained" : "outlined"}
                        onClick={() => handleToggleCompare(listing)}
                        size="small"
                      >
                        {isInCompare(listing._id) ? "Remove from Compare" : "Add to Compare"}
                      </Button>
                    </Stack>
                  </Grid2>
                ))}
              </Grid2>
            ) : (
              <Card sx={{ p: 4 }}>
                <Stack alignItems="center" spacing={2} textAlign="center">
                  <FilterListIcon sx={{ fontSize: 48, color: "text.secondary" }} />
                  <Stack spacing={1}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      No boardings found
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                      Try adjusting your filters or search criteria
                    </Typography>
                  </Stack>
                  <Button
                    variant="contained"
                    onClick={handleReset}
                    sx={{ mt: 1 }}
                  >
                    Clear Filters
                  </Button>
                </Stack>
              </Card>
            )}

            {/* Pagination */}
            {!loading && data.listings.length > 0 && data.pagination.totalPages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", pt: 2 }}>
                <Pagination
                  page={data.pagination.page || 1}
                  count={data.pagination.totalPages || 1}
                  onChange={(_, nextPage) => setSearchParams({ page: String(nextPage) })}
                  color="primary"
                />
              </Box>
            )}
          </Stack>
        </Grid2>
      </Grid2>

      <Dialog
        open={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle>Compare Boardings</DialogTitle>
        <DialogContent dividers>
          <Grid2 container spacing={2}>
            {compareListings.map((listing) => (
              <Grid2 key={listing._id} size={{ xs: 12, md: 4 }}>
                <Card variant="outlined" sx={{ height: "100%" }}>
                  <CardContent>
                    <Stack spacing={1}>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {listing.title || listing.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {listing.locationText || listing.location}
                      </Typography>
                      <Typography variant="h6" color="primary.main">
                        LKR {Number(listing.rent || 0).toLocaleString()} / month
                      </Typography>
                      <Typography variant="body2">
                        Room Type: {listing.roomType || "N/A"}
                      </Typography>
                      <Typography variant="body2">
                        Rating: {(listing.averageRating || 0).toFixed(1)} ({listing.reviewCount || 0} reviews)
                      </Typography>
                      <Typography variant="body2">
                        Distance: {listing.distanceFromSliitKm ?? "N/A"} km from SLIIT
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Facilities
                      </Typography>
                      <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                        {(listing.facilities || []).length ? (
                          listing.facilities.map((facility) => (
                            <Chip key={facility} label={facility} size="small" />
                          ))
                        ) : (
                          <Typography variant="caption" color="text.secondary">
                            No facilities listed
                          </Typography>
                        )}
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid2>
            ))}
          </Grid2>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCompareListings([])} color="inherit">
            Clear
          </Button>
          <Button onClick={() => setIsCompareOpen(false)} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}

export default BoardingSearchPage;
