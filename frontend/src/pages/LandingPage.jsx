import { Box, Button, Container, Grid2, Paper, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

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
          "radial-gradient(circle at 10% 20%, rgba(37,99,235,0.15), transparent 45%), radial-gradient(circle at 90% 80%, rgba(220,38,38,0.12), transparent 45%), radial-gradient(circle at 50% 50%, rgba(247,250,254,1), rgba(244,247,251,1))",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden"
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid2 container spacing={6} alignItems="center">
          <Grid2 size={{ xs: 12, md: 7 }} className="animate-fade-in">
            <Stack spacing={3}>
              <Typography 
                variant="h1" 
                sx={{ 
                  fontWeight: 800, 
                  fontSize: { xs: '3rem', md: '4.5rem' },
                  lineHeight: 1.1,
                  background: 'linear-gradient(90deg, #1e40af, #2563eb, #dc2626)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Find your perfect student boarding.
              </Typography>
              <Typography variant="h5" color="text.secondary" sx={{ fontWeight: 500, maxWidth: "600px", lineHeight: 1.5 }}>
                BoardMe helps students around SLIIT Malabe discover, compare, and secure the right place with real, verified reviews.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ pt: 2 }}>
                <Button 
                  component={RouterLink} 
                  to="/boardings" 
                  size="large" 
                  variant="contained"
                  sx={{ 
                    px: 4, 
                    py: 1.5, 
                    fontSize: '1.1rem',
                    borderRadius: 50 
                  }}
                >
                  Start Searching
                </Button>
                <Button 
                  component={RouterLink} 
                  to="/home" 
                  size="large" 
                  variant="outlined"
                  sx={{ 
                    px: 4, 
                    py: 1.5, 
                    fontSize: '1.1rem',
                    borderRadius: 50,
                    borderWidth: 2,
                    "&:hover": { borderWidth: 2 }
                  }}
                >
                  Go to Home
                </Button>
              </Stack>
            </Stack>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 5 }} className="animate-pop-in">
            <Paper 
              sx={{ 
                p: { xs: 4, md: 5 }, 
                borderRadius: 6,
                background: "rgba(255, 255, 255, 0.65)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.8)",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.08)"
              }} 
              elevation={0}
            >
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 800 }}>
                Why students trust us
              </Typography>
              <Stack spacing={2.5}>
                {highlights.map((item, index) => (
                  <Stack key={index} direction="row" spacing={2} alignItems="flex-start">
                    <CheckCircleIcon sx={{ color: 'primary.main', mt: 0.2 }} />
                    <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.primary', lineHeight: 1.5 }}>
                      {item}
                    </Typography>
                  </Stack>
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
