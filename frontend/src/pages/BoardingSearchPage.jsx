import { Alert, Grid2, Pagination, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

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
  const [data, setData] = useState({ items: [], pagination: { page: 1, totalPages: 1 } });
  const [error, setError] = useState("");

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
      const response = await getListings(toQueryParams(currentFilters, currentPage));
      setData(response);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to load listings");
    }
  };

  useEffect(() => {
    fetchData(filters, page);
  }, [page]);

  const handleApplyFilters = () => {
    setSearchParams({ page: "1" });
    fetchData(filters, 1);
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    setSearchParams({ page: "1" });
    fetchData(defaultFilters, 1);
  };

  return (
    <Grid2 container spacing={2.5}>
      <Grid2 size={{ xs: 12, md: 3 }}>
        <FilterPanel
          filters={filters}
          onChange={(key, value) => setFilters((prev) => ({ ...prev, [key]: value }))}
          onSubmit={handleApplyFilters}
          onReset={handleReset}
        />
      </Grid2>
      <Grid2 size={{ xs: 12, md: 9 }}>
        <Stack spacing={2}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Discover Boardings
          </Typography>
          {error ? <Alert severity="error">{error}</Alert> : null}

          <Grid2 container spacing={2}>
            {data.items.map((listing) => (
              <Grid2 key={listing._id} size={{ xs: 12, sm: 6, md: 6 }}>
                <BoardingCard listing={listing} />
              </Grid2>
            ))}
          </Grid2>

          {!data.items.length ? (
            <Alert severity="info">No boardings found for selected filters.</Alert>
          ) : null}

          <Pagination
            page={data.pagination.page || 1}
            count={data.pagination.totalPages || 1}
            onChange={(_, nextPage) => setSearchParams({ page: String(nextPage) })}
          />
        </Stack>
      </Grid2>
    </Grid2>
  );
}

export default BoardingSearchPage;
