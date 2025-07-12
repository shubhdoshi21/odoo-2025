import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Button,
  Avatar,
  Chip,
  Rating,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  InputAdornment,
  useTheme,
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn,
  Star,
  FilterList,
  Person,
} from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers, searchUsers } from '../store/slices/userSlice';
import LoadingSpinner from '../components/common/LoadingSpinner';

const UsersPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const { users, pagination, isLoading } = useSelector(state => state.users);

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [availability, setAvailability] = useState(
    searchParams.get('availability') || '',
  );

  // Load users on component mount
  useEffect(() => {
    dispatch(getAllUsers({ page: 1, limit: 12 }));
  }, [dispatch]);

  const handleSearch = e => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (location) params.set('location', location);
    if (availability) params.set('availability', availability);
    setSearchParams(params);

    // Trigger immediate search when form is submitted
    const searchParams = {};
    if (searchQuery) searchParams.q = searchQuery;
    if (location) searchParams.location = location;
    if (availability) searchParams.availability = availability;

    if (Object.keys(searchParams).length > 0) {
      dispatch(searchUsers(searchParams));
    } else {
      dispatch(getAllUsers({ page: 1, limit: 12 }));
    }
  };

  const handlePageChange = (event, value) => {
    const params = { page: value, limit: 12 };
    if (searchQuery) params.q = searchQuery;
    if (location) params.location = location;
    if (availability) params.availability = availability;

    if (
      Object.keys(params).filter(key => key !== 'page' && key !== 'limit')
        .length > 0
    ) {
      dispatch(searchUsers(params));
    } else {
      dispatch(getAllUsers(params));
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setLocation('');
    setAvailability('');
    setSearchParams({});
    dispatch(getAllUsers({ page: 1, limit: 12 }));
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Discover Users
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Find people to exchange skills with
        </Typography>
      </Box>

      {/* Search and Filters */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box component="form" onSubmit={handleSearch}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Search users by name..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  placeholder="Location"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOn />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Availability</InputLabel>
                  <Select
                    value={availability}
                    label="Availability"
                    onChange={e => setAvailability(e.target.value)}
                  >
                    <MenuItem value="">Any Availability</MenuItem>
                    <MenuItem value="Weekdays">Weekdays</MenuItem>
                    <MenuItem value="Weekends">Weekends</MenuItem>
                    <MenuItem value="Evenings">Evenings</MenuItem>
                    <MenuItem value="Mornings">Mornings</MenuItem>
                    <MenuItem value="Afternoons">Afternoons</MenuItem>
                    <MenuItem value="Flexible">Flexible</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    startIcon={<SearchIcon />}
                  >
                    Search
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={clearFilters}
                    startIcon={<FilterList />}
                  >
                    Clear
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>

      {/* Users Grid */}
      {users.length > 0 ? (
        <>
          <Grid container spacing={3}>
            {users.map(user => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={user._id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      transition: 'transform 0.3s ease-in-out',
                      boxShadow: theme.shadows[8],
                    },
                  }}
                  onClick={() => navigate(`/users/${user._id}`)}
                >
                  <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                    <Avatar
                      src={user.profilePhotoUrl}
                      alt={user.name}
                      sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }}
                    >
                      <Person sx={{ fontSize: 40 }} />
                    </Avatar>
                    <Typography variant="h6" gutterBottom>
                      {user.name}
                    </Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        mb: 2,
                      }}
                    >
                      <Rating
                        value={user.averageRating || 0}
                        readOnly
                        size="small"
                      />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        ({user.totalRatings || 0})
                      </Typography>
                    </Box>

                    {user.location && (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 2,
                        }}
                      >
                        <LocationOn fontSize="small" color="action" />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ ml: 0.5 }}
                        >
                          {user.location}
                        </Typography>
                      </Box>
                    )}

                    {user.availability && user.availability.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          Available:
                        </Typography>
                        <Box
                          sx={{
                            display: 'flex',
                            gap: 0.5,
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                          }}
                        >
                          {user.availability.slice(0, 2).map((avail, index) => (
                            <Chip
                              key={index}
                              label={avail}
                              size="small"
                              variant="outlined"
                              color="primary"
                            />
                          ))}
                          {user.availability.length > 2 && (
                            <Chip
                              label={`+${user.availability.length - 2}`}
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      </Box>
                    )}

                    {user.offeredSkills && user.offeredSkills.length > 0 && (
                      <Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          Offers:
                        </Typography>
                        <Box
                          sx={{
                            display: 'flex',
                            gap: 0.5,
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                          }}
                        >
                          {user.offeredSkills
                            .slice(0, 3)
                            .map((skill, index) => (
                              <Chip
                                key={index}
                                label={
                                  typeof skill === 'string' ? skill : skill.name
                                }
                                size="small"
                                variant="outlined"
                                color="success"
                              />
                            ))}
                          {user.offeredSkills.length > 3 && (
                            <Chip
                              label={`+${user.offeredSkills.length - 3}`}
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={pagination.pages}
                page={pagination.page}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      ) : (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No users found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search criteria
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default UsersPage;