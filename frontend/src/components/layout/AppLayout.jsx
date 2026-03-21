import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Toolbar,
  Typography
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import { Link as RouterLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const sidebarWidth = 240;

const navItems = [
  { to: "/home", label: "Home" },
  { to: "/boardings", label: "Find Boarding" },
  { to: "/bookmarks", label: "My Bookmarks" }
];

function AppLayout() {
  const { user, logout, isAuthLoading } = useAuth();
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const closeMobileDrawer = () => setIsMobileDrawerOpen(false);

  const sidebarContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ px: 2, py: 2.5 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: "primary.main" }}>
          BoardMe
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Student Boarding Finder
        </Typography>
      </Box>

      <Divider />

      <List sx={{ px: 1.25, py: 1.25, flexGrow: 1 }}>
        {navItems.map((item) => (
          <ListItemButton
            key={item.to}
            component={RouterLink}
            to={item.to}
            onClick={closeMobileDrawer}
            sx={{ borderRadius: 1.5, mb: 0.5 }}
          >
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>

      <Divider />

      <Box sx={{ px: 2, py: 2 }}>
        {!isAuthLoading && user ? (
          <Stack spacing={1}>
            <Typography variant="body2" color="text.secondary">
              Signed in as
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {user.name}
            </Typography>
            <Button onClick={logout} variant="outlined" size="small" sx={{ alignSelf: "flex-start" }}>
              Sign Out
            </Button>
          </Stack>
        ) : null}

        {!isAuthLoading && !user ? (
          <Button
            component={RouterLink}
            to="/login"
            variant="contained"
            size="small"
            onClick={closeMobileDrawer}
          >
            Sign In
          </Button>
        ) : null}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", bgcolor: "#f8fbff" }}>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          width: sidebarWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: sidebarWidth,
            boxSizing: "border-box",
            borderRight: "1px solid #d9e2f2"
          }
        }}
        open
      >
        {sidebarContent}
      </Drawer>

      <Drawer
        variant="temporary"
        open={isMobileDrawerOpen}
        onClose={closeMobileDrawer}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { width: sidebarWidth, boxSizing: "border-box" }
        }}
      >
        {sidebarContent}
      </Drawer>

      <Box sx={{ flexGrow: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <AppBar
          position="sticky"
          color="transparent"
          elevation={0}
          sx={{
            backdropFilter: "blur(8px)",
            borderBottom: "1px solid #d9e2f2",
            bgcolor: "rgba(248, 251, 255, 0.8)"
          }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              onClick={() => setIsMobileDrawerOpen(true)}
              sx={{ mr: 1, display: { xs: "inline-flex", md: "none" } }}
            >
              <MenuIcon />
            </IconButton>

            <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main", flexGrow: 1 }}>
              BoardMe
            </Typography>

            <Stack direction="row" spacing={1} sx={{ display: { xs: "none", sm: "flex" } }}>
              {navItems.map((item) => (
                <Button key={item.to} component={RouterLink} to={item.to} color="inherit">
                  {item.label}
                </Button>
              ))}
            </Stack>

            {!isAuthLoading && !user ? (
              <Button component={RouterLink} to="/login" variant="contained" sx={{ ml: 1.5 }}>
                Sign In
              </Button>
            ) : null}

            {!isAuthLoading && user ? (
              <>
                <Typography sx={{ ml: 1.5, mr: 1 }} variant="body2" color="text.secondary">
                  {user.name}
                </Typography>
                <Button onClick={logout} sx={{ ml: 0.5 }}>
                  Sign Out
                </Button>
              </>
            ) : null}
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ py: 4, flexGrow: 1 }}>
          <Outlet />
        </Container>

        <Box
          component="footer"
          sx={{
            borderTop: "1px solid #d9e2f2",
            bgcolor: "#ffffff",
            px: { xs: 2, md: 3 },
            py: 2
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            alignItems={{ xs: "flex-start", sm: "center" }}
            justifyContent="space-between"
          >
            <Typography variant="body2" color="text.secondary">
              Copyright {new Date().getFullYear()} BoardMe. All rights reserved.
            </Typography>
            <Stack direction="row" spacing={1.5}>
              <Button component={RouterLink} to="/home" size="small">
                Home
              </Button>
              <Button component={RouterLink} to="/boardings" size="small">
                Discover
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}

export default AppLayout;
