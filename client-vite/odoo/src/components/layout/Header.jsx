import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  Dashboard,
  Person,
  SwapHoriz,
  Star,
  Logout,
  People,
  School,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../store/slices/authSlice";

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { pendingSwaps } = useSelector((state) => state.swaps);

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    handleClose();
    setMobileMenuOpen(false);
    navigate("/");
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleClose();
    setMobileMenuOpen(false);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const pendingSwapsCount = pendingSwaps?.length || 0;

  return (
    <AppBar position="sticky" elevation={1}>
      <Toolbar>
        {/* Logo/Brand */}
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            cursor: "pointer",
            fontWeight: 700,
            color: "white",
            textDecoration: "none",
          }}
          onClick={() => navigate("/")}
        >
          SkillSwap
        </Typography>

        {/* Navigation Links - Desktop */}
        {!isMobile && (
          <Box sx={{ display: "flex", gap: 1, mr: 2 }}>
            <Button
              color="inherit"
              onClick={() => navigate("/users")}
              sx={{
                backgroundColor:
                  location.pathname === "/users"
                    ? "rgba(255,255,255,0.1)"
                    : "transparent",
              }}
            >
              Users
            </Button>
            <Button
              color="inherit"
              onClick={() => navigate("/skills")}
              sx={{
                backgroundColor:
                  location.pathname === "/skills"
                    ? "rgba(255,255,255,0.1)"
                    : "transparent",
              }}
            >
              Skills
            </Button>
          </Box>
        )}

        {/* User Menu */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {isAuthenticated ? (
            <>
              {/* Notifications */}
              <IconButton
                color="inherit"
                onClick={() => navigate("/swaps")}
                sx={{ position: "relative" }}
              >
                <Badge badgeContent={pendingSwapsCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>

              {/* User Avatar/Menu */}
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                {user?.profilePicture ? (
                  <Avatar
                    src={user.profilePicture}
                    alt={user.username}
                    sx={{ width: 32, height: 32 }}
                  />
                ) : (
                  <AccountCircle />
                )}
              </IconButton>

              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={() => handleNavigation("/dashboard")}>
                  <Dashboard sx={{ mr: 1 }} />
                  Dashboard
                </MenuItem>
                <MenuItem onClick={() => handleNavigation("/profile")}>
                  <Person sx={{ mr: 1 }} />
                  Profile
                </MenuItem>
                <MenuItem onClick={() => handleNavigation("/swaps")}>
                  <SwapHoriz sx={{ mr: 1 }} />
                  My Swaps
                  {pendingSwapsCount > 0 && (
                    <Badge
                      badgeContent={pendingSwapsCount}
                      color="error"
                      sx={{ ml: 1 }}
                    />
                  )}
                </MenuItem>
                <MenuItem onClick={() => handleNavigation("/feedback")}>
                  <Star sx={{ mr: 1 }} />
                  Feedback
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <Logout sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button
                color="inherit"
                onClick={() => navigate("/login")}
                sx={{
                  backgroundColor:
                    location.pathname === "/login"
                      ? "rgba(255,255,255,0.1)"
                      : "transparent",
                }}
              >
                Login
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => navigate("/register")}
                sx={{
                  backgroundColor:
                    location.pathname === "/register"
                      ? "rgba(255,255,255,0.1)"
                      : "transparent",
                }}
              >
                Register
              </Button>
            </>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={handleMobileMenuToggle}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Box>
      </Toolbar>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={handleMobileMenuToggle}
        PaperProps={{
          sx: { width: 280 },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Menu
          </Typography>
        </Box>
        <Divider />

        {/* Navigation Links */}
        <List>
          <ListItem button onClick={() => handleNavigation("/users")}>
            <ListItemIcon>
              <People />
            </ListItemIcon>
            <ListItemText primary="Users" />
          </ListItem>
          <ListItem button onClick={() => handleNavigation("/skills")}>
            <ListItemIcon>
              <School />
            </ListItemIcon>
            <ListItemText primary="Skills" />
          </ListItem>
        </List>

        {/* User Menu Items */}
        {isAuthenticated ? (
          <>
            <Divider />
            <List>
              <ListItem button onClick={() => handleNavigation("/dashboard")}>
                <ListItemIcon>
                  <Dashboard />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItem>
              <ListItem button onClick={() => handleNavigation("/profile")}>
                <ListItemIcon>
                  <Person />
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItem>
              <ListItem button onClick={() => handleNavigation("/swaps")}>
                <ListItemIcon>
                  <SwapHoriz />
                </ListItemIcon>
                <ListItemText
                  primary="My Swaps"
                  secondary={
                    pendingSwapsCount > 0
                      ? `${pendingSwapsCount} pending`
                      : undefined
                  }
                />
              </ListItem>
              <ListItem button onClick={() => handleNavigation("/feedback")}>
                <ListItemIcon>
                  <Star />
                </ListItemIcon>
                <ListItemText primary="Feedback" />
              </ListItem>
            </List>
            <Divider />
            <List>
              <ListItem button onClick={handleLogout}>
                <ListItemIcon>
                  <Logout />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItem>
            </List>
          </>
        ) : (
          <>
            <Divider />
            <List>
              <ListItem button onClick={() => handleNavigation("/login")}>
                <ListItemIcon>
                  <AccountCircle />
                </ListItemIcon>
                <ListItemText primary="Login" />
              </ListItem>
              <ListItem button onClick={() => handleNavigation("/register")}>
                <ListItemIcon>
                  <Person />
                </ListItemIcon>
                <ListItemText primary="Register" />
              </ListItem>
            </List>
          </>
        )}
      </Drawer>
    </AppBar>
  );
};

export default Header;
