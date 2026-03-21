import {
  Box,
  Button,
  Card,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Stack,
  TextField,
  Typography,
  Paper,
  ToggleButton,
  ToggleButtonGroup
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import DomainIcon from "@mui/icons-material/Domain";
import BuildIcon from "@mui/icons-material/Build";
import { formatLkr } from "../../utils/formatters";

const facilityOptions = [
  { id: "wifi", label: "WiFi", icon: "📡" },
  { id: "meals", label: "Meals", icon: "🍽️" },
  { id: "security", label: "Security", icon: "🔒" },
  { id: "parking", label: "Parking", icon: "🅿️" },
  { id: "laundry", label: "Laundry", icon: "🧺" }
];

function FilterPanel({ filters, onChange, onSubmit, onReset }) {
  const toggleFacility = (facility) => {
    const next = filters.facilities.includes(facility)
      ? filters.facilities.filter((item) => item !== facility)
      : [...filters.facilities, facility];

    onChange("facilities", next);
  };

  return (
    <Card
      sx={{
        position: { md: "sticky" },
        top: { md: 88 },
        boxShadow: 1,
        transition: "box-shadow 0.3s ease"
      }}
    >
      <Box sx={{ p: 3 }}>
        <Stack spacing={3}>
          {/* Header */}
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 0.5
              }}
            >
              <BuildIcon fontSize="small" />
              Filters
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Refine your search
            </Typography>
          </Box>

          <Divider />

          {/* Location Filter */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                mb: 1,
                display: "flex",
                alignItems: "center",
                gap: 0.5
              }}
            >
              <LocationOnIcon fontSize="small" />
              Location
            </Typography>
            <TextField
              placeholder="Enter area name"
              value={filters.location}
              onChange={(event) => onChange("location", event.target.value)}
              size="small"
              fullWidth
              variant="outlined"
              slotProps={{
                input: {
                  sx: { fontSize: "0.875rem" }
                }
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
              Near SLIIT Malabe campus
            </Typography>
          </Box>

          <Divider />

          {/* Budget Filter */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                mb: 1.5,
                display: "flex",
                alignItems: "center",
                gap: 0.5
              }}
            >
              <AttachMoneyIcon fontSize="small" />
              Budget (LKR)
            </Typography>
            <Box sx={{ px: 1 }}>
              <Slider
                value={[filters.minPrice, filters.maxPrice]}
                min={5000}
                max={100000}
                step={1000}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value / 1000}K`}
                onChange={(_, values) => {
                  onChange("minPrice", values[0]);
                  onChange("maxPrice", values[1]);
                }}
                sx={{
                  "& .MuiSlider-markLabel": {
                    fontSize: "0.75rem"
                  }
                }}
              />
              <Box
                sx={{
                  mt: 1.5,
                  p: 1.5,
                  backgroundColor: "action.hover",
                  borderRadius: 1,
                  textAlign: "center"
                }}
              >
                <Typography variant="caption" color="text.secondary" display="block">
                  Your Range
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {formatLkr(filters.minPrice)} - {formatLkr(filters.maxPrice)}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Divider />

          {/* Room Type Filter */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                mb: 1,
                display: "flex",
                alignItems: "center",
                gap: 0.5
              }}
            >
              <DomainIcon fontSize="small" />
              Room Type
            </Typography>
            <ToggleButtonGroup
              value={filters.roomType}
              exclusive
              onChange={(event) => onChange("roomType", event.target.value)}
              fullWidth
              size="small"
            >
              <ToggleButton value="">
                <Typography variant="caption">Any</Typography>
              </ToggleButton>
              <ToggleButton value="single">
                <Typography variant="caption">Single</Typography>
              </ToggleButton>
              <ToggleButton value="shared">
                <Typography variant="caption">Shared</Typography>
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Divider />

          {/* Amenities Filter */}
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>
              Amenities
            </Typography>
            <Stack spacing={1}>
              {facilityOptions.map((facility) => (
                <Paper
                  key={facility.id}
                  onClick={() => toggleFacility(facility.id)}
                  sx={{
                    p: 1.5,
                    cursor: "pointer",
                    border: "2px solid",
                    borderColor: filters.facilities.includes(facility.id)
                      ? "primary.main"
                      : "divider",
                    backgroundColor: filters.facilities.includes(facility.id)
                      ? "primary.lighter"
                      : "transparent",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      borderColor: "primary.main",
                      backgroundColor: "action.hover"
                    }
                  }}
                  elevation={0}
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Box sx={{ fontSize: "1.25rem" }}>{facility.icon}</Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {facility.label}
                    </Typography>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Box>

          <Divider />

          {/* Action Buttons */}
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              onClick={onSubmit}
              fullWidth
              sx={{
                fontWeight: 600,
                py: 1,
                transition: "all 0.3s ease"
              }}
            >
              Apply Filters
            </Button>
            <Button
              variant="outlined"
              onClick={onReset}
              fullWidth
              sx={{
                fontWeight: 600,
                py: 1,
                transition: "all 0.3s ease"
              }}
            >
              Reset
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Card>
  );
}

export default FilterPanel;
