import { AppBar, Box, Button, Container, Toolbar, Typography } from "@mui/material";
import { Link as RouterLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { to: "/home", label: "Home" },
  { to: "/boardings", label: "Find Boarding" },
  { to: "/bookmarks", label: "My Bookmarks" }
];

function AppLayout() {
  const { user, logout, isAuthLoading } = useAuth();

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <AppBar position="sticky" color="transparent" elevation={0}>
        <Toolbar sx={{ backdropFilter: "blur(8px)", borderBottom: "1px solid #d9e2f2" }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main", flexGrow: 1 }}>
            BoardMe
          </Typography>
          {navItems.map((item) => (
            <Button key={item.to} component={RouterLink} to={item.to} color="inherit" sx={{ ml: 1 }}>
              {item.label}
            </Button>
          ))}

          {!isAuthLoading && !user ? (
            <Button component={RouterLink} to="/login" variant="contained" sx={{ ml: 2 }}>
              Sign In
            </Button>
          ) : null}

          {!isAuthLoading && user ? (
            <>
              <Typography sx={{ ml: 2, mr: 1 }} variant="body2" color="text.secondary">
                {user.name}
              </Typography>
              <Button onClick={logout} sx={{ ml: 1 }}>
                Sign Out
              </Button>
            </>
          ) : null}
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
}

export default AppLayout;
