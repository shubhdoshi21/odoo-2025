import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  Button,
  Chip,
  Grid,
  Pagination,
  Card,
  CircularProgress,
  Alert,
  Container,
  Stack,
  Divider,
} from "@mui/material";
import { LocationOn, Star, Person } from "@mui/icons-material";

const UsersShowcase = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const usersPerPage = 3;

  // API base URL - adjust this to match your backend URL
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

  // Fetch users from API
  const fetchUsers = async (currentPage = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const url = `${API_BASE_URL}/users?page=${currentPage}&limit=${usersPerPage}&isPublic=true`;
      console.log('Fetching from URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.success) {
        // Handle the response structure from your backend
        setUsers(data.data.users || []);
        setTotalPages(data.data.pagination?.pages || 1);
        setTotalUsers(data.data.pagination?.total || 0);
      } else {
        throw new Error(data.message || "Failed to fetch users");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.message || "Failed to load users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users on component mount and when page changes
  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  // Handle page change
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Handle request button click
  const handleRequest = async (userId) => {
    try {
      // You can implement the request logic here
      console.log(`Request sent to user ${userId}`);
      // Example: call your request API endpoint
      // const response = await fetch(`${API_BASE_URL}/swaps`, {
      //   method: 'POST',
      //   headers: { 
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   },
      //   body: JSON.stringify({ 
      //     recipientId: userId,
      //     message: "I'd like to connect for skill exchange"
      //   })
      // });
      alert("Request sent successfully!");
    } catch (err) {
      console.error("Error sending request:", err);
      alert("Failed to send request");
    }
  };

  // Loading state
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress sx={{ color: "#1976d2", mb: 2 }} size={60} />
          <Typography variant="h6" color="text.secondary">
            Loading users...
          </Typography>
        </Box>
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => fetchUsers(page)}
            >
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Container>
    );
  }

  // Empty state
  if (users.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ textAlign: "center" }}>
          <Person sx={{ fontSize: 80, color: "text.secondary", mb: 2 }} />
          <Typography variant="h4" gutterBottom color="text.primary">
            No Skill Swappers Found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Be the first to join our skill swapping community!
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Header Section */}
      <Box sx={{ textAlign: "center", mb: 5 }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{ 
            fontWeight: "bold",
            color: "text.primary",
            mb: 2
          }}
        >
          Meet Skill Swappers
        </Typography>
        
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ mb: 2 }}
        >
          {totalUsers} skill swappers ready to connect
        </Typography>
        
        <Divider sx={{ maxWidth: 200, mx: "auto" }} />
      </Box>

      {/* Users Grid */}
      <Grid container spacing={4} justifyContent="center">
        {users.map((user) => (
          <Grid item key={user._id} xs={12} lg={10}>
            <Card
              sx={{
                p: 4,
                borderRadius: 3,
                boxShadow: 3,
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: 6,
                  transform: "translateY(-2px)",
                },
              }}
            >
              <Grid container spacing={3} alignItems="center">
                {/* Left Section - Profile */}
                <Grid item xs={12} md={8}>
                  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 3 }}>
                    <Avatar
                      src={user.profilePhotoUrl}
                      alt={user.name}
                      sx={{
                        width: { xs: 80, sm: 100 },
                        height: { xs: 80, sm: 100 },
                        border: "3px solid",
                        borderColor: "primary.main",
                        fontSize: "2rem",
                        flexShrink: 0,
                      }}
                    >
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </Avatar>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          mb: 1, 
                          fontWeight: "bold",
                          color: "text.primary"
                        }}
                      >
                        {user.name}
                      </Typography>
                      
                      {user.location && (
                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                          <LocationOn sx={{ fontSize: 18, color: "text.secondary", mr: 0.5 }} />
                          <Typography variant="body2" color="text.secondary">
                            {user.location}
                          </Typography>
                        </Box>
                      )}

                      {/* Skills Offered */}
                      {user.offeredSkills && user.offeredSkills.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                          <Typography 
                            variant="subtitle2" 
                            sx={{ 
                              color: "success.main", 
                              fontWeight: "bold",
                              mb: 1
                            }}
                          >
                            Skills Offered
                          </Typography>
                          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            {user.offeredSkills.map((skill, index) => (
                              <Chip
                                key={skill._id || skill.id || index}
                                label={skill.name || skill}
                                size="small"
                                sx={{
                                  backgroundColor: "success.light",
                                  color: "success.contrastText",
                                  fontWeight: "medium",
                                }}
                              />
                            ))}
                          </Stack>
                        </Box>
                      )}

                      {/* Skills Wanted */}
                      {user.wantedSkills && user.wantedSkills.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                          <Typography 
                            variant="subtitle2" 
                            sx={{ 
                              color: "primary.main", 
                              fontWeight: "bold",
                              mb: 1
                            }}
                          >
                            Skills Wanted
                          </Typography>
                          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            {user.wantedSkills.map((skill, index) => (
                              <Chip
                                key={skill._id || skill.id || index}
                                label={skill.name || skill}
                                size="small"
                                sx={{
                                  backgroundColor: "primary.light",
                                  color: "primary.contrastText",
                                  fontWeight: "medium",
                                }}
                              />
                            ))}
                          </Stack>
                        </Box>
                      )}

                      {/* Availability */}
                      {user.availability && user.availability.length > 0 && (
                        <Box>
                          <Typography 
                            variant="subtitle2" 
                            sx={{ 
                              color: "warning.main", 
                              fontWeight: "bold",
                              mb: 1
                            }}
                          >
                            Available
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {user.availability.join(", ")}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Grid>

                {/* Right Section - Actions & Rating */}
                <Grid item xs={12} md={4}>
                  <Box 
                    sx={{ 
                      display: "flex", 
                      flexDirection: "column", 
                      alignItems: "center", 
                      gap: 2,
                      height: "100%",
                      justifyContent: "center"
                    }}
                  >
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => handleRequest(user._id)}
                      sx={{
                        borderRadius: 2,
                        px: 4,
                        py: 1.5,
                        minWidth: 120,
                        fontWeight: "bold",
                        textTransform: "none",
                        fontSize: "1rem",
                      }}
                    >
                      Connect
                    </Button>
                    
                    <Box sx={{ textAlign: "center" }}>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5, mb: 0.5 }}>
                        <Star sx={{ color: "warning.main", fontSize: 20 }} />
                        <Typography variant="h6" fontWeight="bold">
                          {user.averageRating?.toFixed(1) || "0.0"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          /5
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {user.totalRatings || 0} reviews
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            variant="outlined"
            shape="rounded"
            size="large"
            sx={{
              "& .MuiPaginationItem-root": {
                fontSize: "1rem",
              },
            }}
          />
        </Box>
      )}
    </Container>
  );
};

export default UsersShowcase;