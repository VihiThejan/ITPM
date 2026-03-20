import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Stack,
  TextField,
  Typography
} from "@mui/material";

const facilityOptions = ["wifi", "meals", "security", "parking", "laundry"];

function FilterPanel({ filters, onChange, onSubmit, onReset }) {
  const toggleFacility = (facility) => {
    const next = filters.facilities.includes(facility)
      ? filters.facilities.filter((item) => item !== facility)
      : [...filters.facilities, facility];

    onChange("facilities", next);
  };

  return (
    <Card sx={{ position: { md: "sticky" }, top: { md: 88 } }}>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6">Advanced Filters</Typography>
          <TextField
            label="Location near SLIIT Malabe"
            value={filters.location}
            onChange={(event) => onChange("location", event.target.value)}
          />

          <Box>
            <Typography gutterBottom>Budget Range (LKR)</Typography>
            <Slider
              value={[filters.minPrice, filters.maxPrice]}
              min={5000}
              max={100000}
              step={1000}
              valueLabelDisplay="auto"
              onChange={(_, values) => {
                onChange("minPrice", values[0]);
                onChange("maxPrice", values[1]);
              }}
            />
          </Box>

          <FormControl fullWidth>
            <InputLabel id="room-type-label">Room Type</InputLabel>
            <Select
              labelId="room-type-label"
              value={filters.roomType}
              label="Room Type"
              onChange={(event) => onChange("roomType", event.target.value)}
            >
              <MenuItem value="">Any</MenuItem>
              <MenuItem value="single">Single</MenuItem>
              <MenuItem value="shared">Shared</MenuItem>
            </Select>
          </FormControl>

          <Stack direction="row" flexWrap="wrap" gap={1}>
            {facilityOptions.map((facility) => (
              <Button
                key={facility}
                variant={filters.facilities.includes(facility) ? "contained" : "outlined"}
                size="small"
                onClick={() => toggleFacility(facility)}
              >
                {facility}
              </Button>
            ))}
          </Stack>

          <Stack direction="row" spacing={1}>
            <Button variant="contained" onClick={onSubmit} fullWidth>
              Apply
            </Button>
            <Button variant="text" onClick={onReset} fullWidth>
              Reset
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default FilterPanel;
