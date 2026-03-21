import { Box, Button, Container, Grid2, Paper, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const highlights = [
  "Search boardings near SLIIT Malabe with precise filters",
  "Read trusted peer reviews from verified students only",
  "Bookmark your top choices and decide faster"
];

function LandingPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 20% 20%, rgba(13,71,161,0.12), transparent 35%), radial-gradient(circle at 90% 70%, rgba(0,137,123,0.1), transparent 35%), #f7fafe",
        display: "flex",
        alignItems: "center"
      }}
    >
      <Container maxWidth="lg">
        <Grid2 container spacing={3} alignItems="center">
          <Grid2 size={{ xs: 12, md: 7 }}>
            <Stack spacing={2}>
              <Typography variant="h2" sx={{ fontWeight: 800 }}>
                Find trusted boarding places around SLIIT Malabe.
              </Typography>
              <Typography variant="h6" color="text.secondary">
                BoardMe helps students discover, compare, and save the right place with real verified reviews.
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button component={RouterLink} to="/boardings" size="large" variant="contained">
                  Start Searching
                </Button>
                <Button component={RouterLink} to="/home" size="large" variant="outlined">
                  Go to Home
                </Button>
              </Stack>
            </Stack>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 5 }}>
            <Paper sx={{ p: 3, borderRadius: 4 }} elevation={0}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Why students trust it
              </Typography>
              <Stack spacing={1.5}>
                {highlights.map((item) => (
                  <Typography key={item}>• {item}</Typography>
                ))}
              </Stack>
            </Paper>
          </Grid2>
        </Grid2>
      </Container>
    </Box>
  );
}

export default LandingPage;
