import React, { useState, useEffect, useMemo } from "react";
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
import { getAllSkills, getPopularSkills } from "../store/slices/skillSlice";
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
  const [currentPage, setCurrentPage] = useState(1);
  const skillsPerPage = 12;

  // Load all skills on component mount (we'll filter on frontend)
  useEffect(() => {
    dispatch(getAllSkills({ page: 1, limit: 1000 })); // Get more skills for frontend filtering
    dispatch(getPopularSkills(6));
  }, [dispatch]);

  // Filter and search skills on frontend
  const filteredSkills = useMemo(() => {
    if (!skills || skills.length === 0) return [];

    return skills.filter((skill) => {
      // Search by name and description
      const matchesSearch =
        !searchQuery ||
        skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (skill.description &&
          skill.description.toLowerCase().includes(searchQuery.toLowerCase()));

      // Filter by category
      const matchesCategory = !category || skill.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [skills, searchQuery, category]);

  // Sort filtered skills
  const sortedSkills = useMemo(() => {
    const sorted = [...filteredSkills];

    switch (sortBy) {
      case "name":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "userCount":
        return sorted.sort((a, b) => (b.userCount || 0) - (a.userCount || 0));
      case "createdAt":
        return sorted.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      default:
        return sorted;
    }
  }, [filteredSkills, sortBy]);

  // Paginate sorted skills
  const paginatedSkills = useMemo(() => {
    const startIndex = (currentPage - 1) * skillsPerPage;
    const endIndex = startIndex + skillsPerPage;
    return sortedSkills.slice(startIndex, endIndex);
  }, [sortedSkills, currentPage, skillsPerPage]);

  // Calculate pagination info
  const totalPages = Math.ceil(sortedSkills.length / skillsPerPage);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (category) params.set("category", category);
    if (sortBy) params.set("sortBy", sortBy);
    setSearchParams(params);
    setCurrentPage(1); // Reset to first page when searching
  };

  const clearFilters = () => {
    setSearchQuery("");
    setCategory("");
    setSortBy("name");
    setSearchParams({});
    setCurrentPage(1);
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
        {skills.length > 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Showing {paginatedSkills.length} of {sortedSkills.length} skills
            {sortedSkills.length !== skills.length &&
              ` (filtered from ${skills.length} total)`}
          </Typography>
        )}
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
                        {skill.userCount || 0} users
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
                    <MenuItem value="userCount">Most Popular</MenuItem>
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
      {paginatedSkills.length > 0 ? (
        <>
          <Grid container spacing={3}>
            {paginatedSkills.map((skill) => (
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
                        {skill.userCount || 0} users
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
          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(event, value) => setCurrentPage(value)}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      ) : (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {sortedSkills.length === 0 && skills.length > 0
              ? "No skills match your search criteria"
              : "No skills found"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {sortedSkills.length === 0 && skills.length > 0
              ? "Try adjusting your search criteria"
              : "No skills are currently available"}
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default SkillsPage;
