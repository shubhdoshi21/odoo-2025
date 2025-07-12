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
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  InputAdornment,
  useTheme,
  Alert,
} from "@mui/material";
import {
  Search as SearchIcon,
  Category,
  TrendingUp,
  FilterList,
  Star,
} from "@mui/icons-material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllSkills,
  searchSkills,
  getSkillsByCategory,
  getPopularSkills,
} from "../store/slices/skillSlice";
import LoadingSpinner from "../components/common/LoadingSpinner";

const SkillsPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const { skills, popularSkills, pagination, isLoading, error } = useSelector(
    (state) => state.skills
  );

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "name");

  // Load skills on component mount
  useEffect(() => {
    dispatch(getAllSkills({ page: 1, limit: 12 }));
    dispatch(getPopularSkills(6));
  }, [dispatch]);

  useEffect(() => {
    const params = {};
    if (searchQuery) params.q = searchQuery;
    if (category) params.category = category;
    if (sortBy) params.sortBy = sortBy;

    if (Object.keys(params).length > 0) {
      if (searchQuery) {
        dispatch(searchSkills(searchQuery));
      } else if (category) {
        dispatch(getSkillsByCategory({ category, page: 1, limit: 12, sortBy }));
      } else {
        dispatch(getAllSkills({ page: 1, limit: 12, sortBy }));
      }
    } else {
      dispatch(getAllSkills({ page: 1, limit: 12 }));
    }
  }, [dispatch, searchQuery, category, sortBy]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (category) params.set("category", category);
    if (sortBy) params.set("sortBy", sortBy);
    setSearchParams(params);
  };

  const handlePageChange = (event, value) => {
    const params = { page: value, limit: 12 };
    if (searchQuery) params.q = searchQuery;
    if (category) params.category = category;
    if (sortBy) params.sortBy = sortBy;

    if (category) {
      dispatch(getSkillsByCategory(params));
    } else {
      dispatch(getAllSkills(params));
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setCategory("");
    setSortBy("name");
    setSearchParams({});
    dispatch(getAllSkills({ page: 1, limit: 12 }));
  };

  const getCategoryColor = (category) => {
    const colors = {
      Technology: "primary",
      Creative: "secondary",
      Language: "success",
      Business: "warning",
      Health: "error",
      Education: "info",
      Other: "default",
    };
    return colors[category] || "default";
  };

  if (isLoading && skills.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Discover Skills
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Find skills to learn or offer to others
        </Typography>
      </Box>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Popular Skills Section */}
      {popularSkills.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <TrendingUp color="primary" />
            Popular Skills
          </Typography>
          <Grid container spacing={2}>
            {popularSkills.map((skill) => (
              <Grid item xs={12} sm={6} md={4} lg={2} key={skill._id}>
                <Card
                  sx={{
                    cursor: "pointer",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      transition: "transform 0.2s ease-in-out",
                      boxShadow: theme.shadows[4],
                    },
                  }}
                  onClick={() => navigate(`/skills/${skill._id}`)}
                >
                  <CardContent sx={{ textAlign: "center", py: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      {skill.name}
                    </Typography>
                    <Chip
                      label={skill.category}
                      color={getCategoryColor(skill.category)}
                      size="small"
                      sx={{ mb: 1 }}
                    />
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 0.5,
                      }}
                    >
                      <Star fontSize="small" color="primary" />
                      <Typography variant="body2" color="text.secondary">
                        {skill.usageCount || 0} users
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Search and Filters */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box component="form" onSubmit={handleSearch}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Search skills..."
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
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={category}
                    label="Category"
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <MenuItem value="">All Categories</MenuItem>
                    <MenuItem value="Technology">Technology</MenuItem>
                    <MenuItem value="Creative">Creative</MenuItem>
                    <MenuItem value="Language">Language</MenuItem>
                    <MenuItem value="Business">Business</MenuItem>
                    <MenuItem value="Health">Health</MenuItem>
                    <MenuItem value="Education">Education</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={sortBy}
                    label="Sort By"
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <MenuItem value="name">Name</MenuItem>
                    <MenuItem value="usageCount">Most Popular</MenuItem>
                    <MenuItem value="createdAt">Newest</MenuItem>
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

      {/* Skills Grid */}
      {skills.length > 0 ? (
        <>
          <Grid container spacing={3}>
            {skills.map((skill) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={skill._id}>
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
                  onClick={() => navigate(`/skills/${skill._id}`)}
                >
                  <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
                    <Typography variant="h6" gutterBottom>
                      {skill.name}
                    </Typography>

                    <Chip
                      label={skill.category}
                      color={getCategoryColor(skill.category)}
                      size="small"
                      sx={{ mb: 2 }}
                    />

                    {skill.description && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        paragraph
                        sx={{
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {skill.description}
                      </Typography>
                    )}

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                      }}
                    >
                      <Star fontSize="small" color="primary" />
                      <Typography variant="body2" color="text.secondary">
                        {skill.usageCount || 0} users
                      </Typography>
                    </Box>

                    {skill.isActive === false && (
                      <Chip
                        label="Inactive"
                        color="error"
                        size="small"
                        sx={{ mt: 1 }}
                      />
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
            No skills found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search criteria
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default SkillsPage;
