import React, { useState } from 'react';
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
} from '@mui/material';
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
  Psychology,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../store/slices/authSlice';
const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const { pendingSwaps } = useSelector(state => state.swaps);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const handleMenu = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    dispatch(logoutUser());
    handleClose();
    setMobileMenuOpen(false);
    navigate('/');
  };
  const handleNavigation = path => {
    navigate(path);
    handleClose();
    setMobileMenuOpen(false);
  };
  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  const pendingSwapsCount = pendingSwaps?.length || 0;
  const navigationItems = [
    { path: '/users', label: 'Users', icon: <People /> },
    { path: '/skills', label: 'Skills', icon: <Psychology /> },
  ];
  const userMenuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <Dashboard /> },
    { path: '/profile', label: 'Profile', icon: <Person /> },
    {
      path: '/swaps',
      label: 'My Swaps',
      icon: <SwapHoriz />,
      badge: pendingSwapsCount,
    },
    { path: '/feedback', label: 'Feedback', icon: <Star /> },
  ];
  const MobileMenu = () => (
    <Drawer
      anchor="right"
      open={mobileMenuOpen}
      onClose={handleMobileMenuToggle}
      PaperProps={{ sx: { width: 280 } }}
    >
      {' '}
      <Box sx={{ p: 2 }}>
        {' '}
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
          {' '}
          SkillSwap{' '}
        </Typography>{' '}
        {isAuthenticated ? (
          <>
            {' '}
            {/* User Info */}{' '}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 2,
                p: 1,
                bgcolor: 'grey.100',
                borderRadius: 1,
              }}
            >
              {' '}
              {user?.profilePhotoUrl || user?.profilePhoto ? (
                <Avatar
                  src={
                    user.profilePhotoUrl ||
                    (user.profilePhoto
                      ? `http://localhost:3001/uploads/${user.profilePhoto}`
                      : null)
                  }
                  alt={user.name || user.username}
                  sx={{ width: 40, height: 40, mr: 2 }}
                />
              ) : (
                <AccountCircle sx={{ width: 40, height: 40, mr: 2 }} />
              )}{' '}
              <Box>
                {' '}
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {' '}
                  {user?.name || user?.username}{' '}
                </Typography>{' '}
                <Typography variant="caption" color="text.secondary">
                  {' '}
                  {user?.email}{' '}
                </Typography>{' '}
              </Box>{' '}
            </Box>{' '}
            {/* Navigation Links */}{' '}
            <List>
              {' '}
              {navigationItems.map(item => (
                <ListItem
                  key={item.path}
                  button
                  onClick={() => handleNavigation(item.path)}
                  selected={location.pathname === item.path}
                  sx={{
                    borderRadius: 1,
                    mb: 0.5,
                    '&.Mui-selected': {
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': { bgcolor: 'primary.dark' },
                    },
                  }}
                >
                  {' '}
                  <ListItemIcon sx={{ color: 'inherit' }}>
                    {' '}
                    {item.icon}{' '}
                  </ListItemIcon>{' '}
                  <ListItemText primary={item.label} />{' '}
                </ListItem>
              ))}{' '}
            </List>{' '}
            <Divider sx={{ my: 2 }} /> {/* User Menu Items */}{' '}
            <List>
              {' '}
              {userMenuItems.map(item => (
                <ListItem
                  key={item.path}
                  button
                  onClick={() => handleNavigation(item.path)}
                  selected={location.pathname === item.path}
                  sx={{
                    borderRadius: 1,
                    mb: 0.5,
                    '&.Mui-selected': {
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': { bgcolor: 'primary.dark' },
                    },
                  }}
                >
                  {' '}
                  <ListItemIcon sx={{ color: 'inherit' }}>
                    {' '}
                    {item.icon}{' '}
                  </ListItemIcon>{' '}
                  <ListItemText primary={item.label} />{' '}
                  {item.badge && item.badge > 0 && (
                    <Badge badgeContent={item.badge} color="error" />
                  )}{' '}
                </ListItem>
              ))}{' '}
              <ListItem
                button
                onClick={handleLogout}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  color: 'error.main',
                  '&:hover': { bgcolor: 'error.light', color: 'white' },
                }}
              >
                {' '}
                <ListItemIcon sx={{ color: 'inherit' }}>
                  {' '}
                  <Logout />{' '}
                </ListItemIcon>{' '}
                <ListItemText primary="Logout" />{' '}
              </ListItem>{' '}
            </List>{' '}
          </>
        ) : (
          <List>
            {' '}
            {navigationItems.map(item => (
              <ListItem
                key={item.path}
                button
                onClick={() => handleNavigation(item.path)}
                selected={location.pathname === item.path}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': { bgcolor: 'primary.dark' },
                  },
                }}
              >
                {' '}
                <ListItemIcon sx={{ color: 'inherit' }}>
                  {' '}
                  {item.icon}{' '}
                </ListItemIcon>{' '}
                <ListItemText primary={item.label} />{' '}
              </ListItem>
            ))}{' '}
            <Divider sx={{ my: 2 }} />{' '}
            <ListItem
              button
              onClick={() => handleNavigation('/login')}
              selected={location.pathname === '/login'}
              sx={{
                borderRadius: 1,
                mb: 1,
                '&.Mui-selected': { bgcolor: 'primary.main', color: 'white' },
              }}
            >
              {' '}
              <ListItemText primary="Login" />{' '}
            </ListItem>{' '}
            <ListItem
              button
              onClick={() => handleNavigation('/register')}
              selected={location.pathname === '/register'}
              sx={{
                borderRadius: 1,
                bgcolor: 'secondary.main',
                color: 'white',
                '&:hover': { bgcolor: 'secondary.dark' },
              }}
            >
              {' '}
              <ListItemText primary="Register" />{' '}
            </ListItem>{' '}
          </List>
        )}{' '}
      </Box>{' '}
    </Drawer>
  );
  return (
    <AppBar position="sticky" elevation={1}>
      {' '}
      <Toolbar>
        {' '}
        {/* Logo/Brand */}{' '}
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            cursor: 'pointer',
            fontWeight: 700,
            color: 'white',
            textDecoration: 'none',
          }}
          onClick={() => navigate('/')}
        >
          {' '}
          SkillSwap{' '}
        </Typography>{' '}
        {/* Desktop Navigation */}{' '}
        {!isMobile && (
          <Box sx={{ display: 'flex', gap: 1, mr: 2 }}>
            {' '}
            {navigationItems.map(item => (
              <Button
                key={item.path}
                color="inherit"
                onClick={() => navigate(item.path)}
                sx={{
                  backgroundColor:
                    location.pathname === item.path
                      ? 'rgba(255,255,255,0.1)'
                      : 'transparent',
                }}
              >
                {' '}
                {item.label}{' '}
              </Button>
            ))}{' '}
          </Box>
        )}{' '}
        {/* User Menu */}{' '}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {' '}
          {isAuthenticated ? (
            <>
              {' '}
              {/* Notifications */}{' '}
              <IconButton
                color="inherit"
                onClick={() => navigate('/swaps')}
                sx={{ position: 'relative' }}
              >
                {' '}
                <Badge badgeContent={pendingSwapsCount} color="error">
                  {' '}
                  <NotificationsIcon />{' '}
                </Badge>{' '}
              </IconButton>{' '}
              {/* User Avatar/Menu */}{' '}
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                {' '}
                {user?.profilePhotoUrl || user?.profilePhoto ? (
                  <Avatar
                    src={
                      user.profilePhotoUrl ||
                      (user.profilePhoto
                        ? `http://localhost:3001/uploads/${user.profilePhoto}`
                        : null)
                    }
                    alt={user.name || user.username}
                    sx={{ width: 32, height: 32 }}
                  />
                ) : (
                  <AccountCircle />
                )}{' '}
              </IconButton>{' '}
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                {' '}
                {userMenuItems.map(item => (
                  <MenuItem
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                  >
                    {' '}
                    {item.icon}{' '}
                    <Box
                      sx={{
                        ml: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                      }}
                    >
                      {' '}
                      {item.label}{' '}
                      {item.badge && item.badge > 0 && (
                        <Badge
                          badgeContent={item.badge}
                          color="error"
                          sx={{ ml: 1 }}
                        />
                      )}{' '}
                    </Box>{' '}
                  </MenuItem>
                ))}{' '}
                <MenuItem onClick={handleLogout}>
                  {' '}
                  <Logout sx={{ mr: 1 }} /> Logout{' '}
                </MenuItem>{' '}
              </Menu>{' '}
            </>
          ) : (
            <>
              {' '}
              {!isMobile && (
                <>
                  {' '}
                  <Button
                    color="inherit"
                    onClick={() => navigate('/login')}
                    sx={{
                      backgroundColor:
                        location.pathname === '/login'
                          ? 'rgba(255,255,255,0.1)'
                          : 'transparent',
                    }}
                  >
                    {' '}
                    Login{' '}
                  </Button>{' '}
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => navigate('/register')}
                    sx={{
                      backgroundColor:
                        location.pathname === '/register'
                          ? 'rgba(255,255,255,0.1)'
                          : 'transparent',
                    }}
                  >
                    {' '}
                    Register{' '}
                  </Button>{' '}
                </>
              )}{' '}
            </>
          )}{' '}
          {/* Mobile Menu Button */}{' '}
          {isMobile && (
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={handleMobileMenuToggle}
            >
              {' '}
              <MenuIcon />{' '}
            </IconButton>
          )}{' '}
        </Box>{' '}
      </Toolbar>{' '}
      {/* Mobile Menu Drawer */} {isMobile && <MobileMenu />}{' '}
    </AppBar>
  );
};
export default Header;
