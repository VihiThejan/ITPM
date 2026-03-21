import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Grid2,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Skeleton,
  Stack,
  Typography,
  Chip,
  TextField
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import FilterListIcon from "@mui/icons-material/FilterList";
import TuneIcon from "@mui/icons-material/Tune";

import BoardingCard from "../components/boarding/BoardingCard";
import FilterPanel from "../components/search/FilterPanel";
import { getListings } from "../services/listingsService";

const defaultFilters = {
  location: "",
  minPrice: 10000,
  maxPrice: 50000,
  roomType: "",
  facilities: []
};

function BoardingSearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(defaultFilters);
  const [data, setData] = useState({ listings: [], pagination: { page: 1, totalPages: 1, total: 0 } });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

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
                    <BoardingCard listing={listing} />
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
    </Stack>
  );
}

export default BoardingSearchPage;
