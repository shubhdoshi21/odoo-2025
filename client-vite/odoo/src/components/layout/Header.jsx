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
  InputBase,
  Badge,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Search as SearchIcon,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  Dashboard,
  Person,
  SwapHoriz,
  Star,
  Logout,
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../store/slices/authSlice';
import { setSearchQuery } from '../../store/slices/uiSlice';

// Styled search component
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { isAuthenticated, user } = useSelector(state => state.auth);
  const { pendingSwaps } = useSelector(state => state.swaps);

  const [anchorEl, setAnchorEl] = useState(null);
  const [searchValue, setSearchValue] = useState('');

  const handleMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    handleClose();
    navigate('/');
  };

  const handleSearch = e => {
    e.preventDefault();
    if (searchValue.trim()) {
      dispatch(setSearchQuery(searchValue.trim()));
      navigate(`/users?search=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  const handleNavigation = path => {
    navigate(path);
    handleClose();
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
            flexGrow: 0,
            cursor: 'pointer',
            fontWeight: 700,
            color: 'white',
            textDecoration: 'none',
          }}
          onClick={() => navigate('/')}
        >
          SkillSwap
        </Typography>

        {/* Search Bar */}
        {!isMobile && (
          <Box
            component="form"
            onSubmit={handleSearch}
            sx={{ flexGrow: 1, mx: 2 }}
          >
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search users or skills..."
                inputProps={{ 'aria-label': 'search' }}
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
              />
            </Search>
          </Box>
        )}

        {/* Navigation Links */}
        {!isMobile && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              color="inherit"
              onClick={() => navigate('/users')}
              sx={{
                backgroundColor:
                  location.pathname === '/users'
                    ? 'rgba(255,255,255,0.1)'
                    : 'transparent',
              }}
            >
              Users
            </Button>
            <Button
              color="inherit"
              onClick={() => navigate('/skills')}
              sx={{
                backgroundColor:
                  location.pathname === '/skills'
                    ? 'rgba(255,255,255,0.1)'
                    : 'transparent',
              }}
            >
              Skills
            </Button>
          </Box>
        )}

        {/* User Menu */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isAuthenticated ? (
            <>
              {/* Notifications */}
              <IconButton
                color="inherit"
                onClick={() => navigate('/swaps')}
                sx={{ position: 'relative' }}
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
                )}
              </IconButton>

              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={() => handleNavigation('/dashboard')}>
                  <Dashboard sx={{ mr: 1 }} />
                  Dashboard
                </MenuItem>
                <MenuItem onClick={() => handleNavigation('/profile')}>
                  <Person sx={{ mr: 1 }} />
                  Profile
                </MenuItem>
                <MenuItem onClick={() => handleNavigation('/swaps')}>
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
                <MenuItem onClick={() => handleNavigation('/feedback')}>
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
                onClick={() => navigate('/login')}
                sx={{
                  backgroundColor:
                    location.pathname === '/login'
                      ? 'rgba(255,255,255,0.1)'
                      : 'transparent',
                }}
              >
                Login
              </Button>
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
            >
              <MenuIcon />
            </IconButton>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
