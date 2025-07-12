import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import {
  Search as SearchIcon,
  LocationOn,
  Star,
  FilterList,
} from "@mui/icons-material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers, searchUsers } from "../store/slices/userSlice";
import LoadingSpinner from "../components/common/LoadingSpinner";

const UsersPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const { users, pagination, isLoading } = useSelector((state) => state.users);

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [rating, setRating] = useState(searchParams.get("rating") || "");

  useEffect(() => {
    const params = {};
    if (searchQuery) params.search = searchQuery;
    if (category) params.category = category;
    if (location) params.location = location;
    if (rating) params.rating = rating;

    if (Object.keys(params).length > 0) {
      dispatch(searchUsers(params));
    } else {
      dispatch(getAllUsers({ page: 1, limit: 12 }));
    }
  }, [dispatch, searchQuery, category, location, rating]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (category) params.set("category", category);
    if (location) params.set("location", location);
    if (rating) params.set("rating", rating);
    setSearchParams(params);
  };

  const handlePageChange = (event, value) => {
    const params = { page: value, limit: 12 };
    if (searchQuery) params.search = searchQuery;
    if (category) params.category = category;
    if (location) params.location = location;
    if (rating) params.rating = rating;

    if (
      Object.keys(params).filter((key) => key !== "page" && key !== "limit")
        .length > 0
    ) {
      dispatch(searchUsers(params));
    } else {
      dispatch(getAllUsers(params));
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setCategory("");
    setLocation("");
    setRating("");
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
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={category}
                    label="Category"
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <MenuItem value="">All Categories</MenuItem>
                    <MenuItem value="technology">Technology</MenuItem>
                    <MenuItem value="languages">Languages</MenuItem>
                    <MenuItem value="music">Music</MenuItem>
                    <MenuItem value="cooking">Cooking</MenuItem>
                    <MenuItem value="fitness">Fitness</MenuItem>
                    <MenuItem value="art">Art</MenuItem>
                    <MenuItem value="business">Business</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  fullWidth
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOn />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Min Rating</InputLabel>
                  <Select
                    value={rating}
                    label="Min Rating"
                    onChange={(e) => setRating(e.target.value)}
                  >
                    <MenuItem value="">Any Rating</MenuItem>
                    <MenuItem value="4">4+ Stars</MenuItem>
                    <MenuItem value="3">3+ Stars</MenuItem>
                    <MenuItem value="2">2+ Stars</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <Box sx={{ display: "flex", gap: 1 }}>
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
            {users.map((user) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={user._id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    cursor: "pointer",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      transition: "transform 0.3s ease-in-out",
                      boxShadow: theme.shadows[8],
                    },
                  }}
                  onClick={() => navigate(`/users/${user._id}`)}
                >
                  <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
                    <Avatar
                      src={user.profilePicture}
                      alt={user.username}
                      sx={{ width: 80, height: 80, mx: "auto", mb: 2 }}
                    />
                    <Typography variant="h6" gutterBottom>
                      {user.firstName} {user.lastName}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      @{user.username}
                    </Typography>

                    {user.bio && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        paragraph
                      >
                        {user.bio.length > 100
                          ? `${user.bio.substring(0, 100)}...`
                          : user.bio}
                      </Typography>
                    )}

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <Rating value={user.rating || 0} readOnly size="small" />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        ({user.reviewCount || 0})
                      </Typography>
                    </Box>

                    {user.location && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
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

                    {user.skills && user.skills.length > 0 && (
                      <Box
                        sx={{
                          display: "flex",
                          gap: 0.5,
                          flexWrap: "wrap",
                          justifyContent: "center",
                        }}
                      >
                        {user.skills.slice(0, 3).map((skill, index) => (
                          <Chip
                            key={index}
                            label={skill.name}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                        {user.skills.length > 3 && (
                          <Chip
                            label={`+${user.skills.length - 3}`}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
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
        <Box sx={{ textAlign: "center", py: 8 }}>
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
