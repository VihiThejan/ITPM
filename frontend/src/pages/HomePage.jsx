import { Card, CardContent, Grid2, Stack, Typography, Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const cards = [
  {
    title: "Search Boardings",
    description: "Apply smart filters to discover places that match your budget and preferences.",
    action: "Find Now",
    to: "/boardings"
  },
  {
    title: "My Bookmarks",
    description: "Keep your shortlist organized and revisit listing details with one click.",
    action: "Open Bookmarks",
    to: "/bookmarks"
  }
];

function HomePage() {
  return (
    <Stack spacing={2.5}>
      <Typography variant="h4" sx={{ fontWeight: 700 }}>
        Student Home
      </Typography>
      <Typography color="text.secondary">
        Jump back into your boarding discovery workflow.
      </Typography>
      <Grid2 container spacing={2}>
        {cards.map((card) => (
          <Grid2 size={{ xs: 12, md: 6 }} key={card.title}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Stack spacing={1.5}>
                  <Typography variant="h6">{card.title}</Typography>
                  <Typography color="text.secondary">{card.description}</Typography>
                  <Button component={RouterLink} to={card.to} variant="contained" sx={{ alignSelf: "flex-start" }}>
                    {card.action}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid2>
        ))}
      </Grid2>
    </Stack>
  );
}

export default HomePage;
