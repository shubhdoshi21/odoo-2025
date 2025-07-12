import React, { useEffect } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  useTheme,
} from "@mui/material";
import {
  SwapHoriz,
  People,
  Star,
  TrendingUp,
  Add,
  Notifications,
  Schedule,
  CheckCircle,
  Cancel,
  Pending,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserSwaps } from "../store/slices/swapSlice";
import { getUserFeedback } from "../store/slices/feedbackSlice";
import LoadingSpinner from "../components/common/LoadingSpinner";

const DashboardPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { swaps, isLoading: swapsLoading } = useSelector(
    (state) => state.swaps
  );
  const { feedback, isLoading: feedbackLoading } = useSelector(
    (state) => state.feedback
  );

  useEffect(() => {
    dispatch(getUserSwaps({ limit: 5 }));
    dispatch(getUserFeedback({ limit: 5 }));
  }, [dispatch]);

  if (swapsLoading || feedbackLoading) {
    return <LoadingSpinner />;
  }

  // Ensure swaps is always an array
  const safeSwaps = Array.isArray(swaps) ? swaps : [];

  // Ensure feedback is always an array
  const safeFeedback = Array.isArray(feedback) ? feedback : [];

  // Calculate stats
  const totalSwaps = safeSwaps.length;
  const pendingSwaps = safeSwaps.filter(
    (swap) => swap.status === "pending"
  ).length;
  const completedSwaps = safeSwaps.filter(
    (swap) => swap.status === "completed"
  ).length;
  const cancelledSwaps = safeSwaps.filter(
    (swap) => swap.status === "cancelled"
  ).length;

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Pending color="warning" />;
      case "accepted":
        return <CheckCircle color="success" />;
      case "completed":
        return <CheckCircle color="success" />;
      case "cancelled":
        return <Cancel color="error" />;
      default:
        return <Schedule color="info" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "accepted":
        return "info";
      case "completed":
        return "success";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome back, {user?.firstName || user?.username}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's what's happening with your skill swaps
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <SwapHoriz color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" color="primary">
                  Total Swaps
                </Typography>
              </Box>
              <Typography variant="h4" gutterBottom>
                {totalSwaps}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                All time skill exchanges
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Pending color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6" color="warning.main">
                  Pending
                </Typography>
              </Box>
              <Typography variant="h4" gutterBottom>
                {pendingSwaps}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Awaiting response
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <CheckCircle color="success" sx={{ mr: 1 }} />
                <Typography variant="h6" color="success.main">
                  Completed
                </Typography>
              </Box>
              <Typography variant="h4" gutterBottom>
                {completedSwaps}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Successful exchanges
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Star color="secondary" sx={{ mr: 1 }} />
                <Typography variant="h6" color="secondary.main">
                  Rating
                </Typography>
              </Box>
              <Typography variant="h4" gutterBottom>
                {user?.rating?.toFixed(1) || "4.5"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Average rating
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => navigate("/swaps/create")}
                >
                  Create Swap
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<People />}
                  onClick={() => navigate("/users")}
                >
                  Find Users
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<SwapHoriz />}
                  onClick={() => navigate("/swaps")}
                >
                  View All Swaps
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Profile Overview
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar
                  src={user?.profilePicture}
                  alt={user?.username}
                  sx={{ width: 60, height: 60, mr: 2 }}
                />
                <Box>
                  <Typography variant="h6">
                    {user?.firstName} {user?.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    @{user?.username}
                  </Typography>
                  {user?.location && (
                    <Typography variant="body2" color="text.secondary">
                      📍 {user.location}
                    </Typography>
                  )}
                </Box>
              </Box>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate("/profile")}
              >
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Swaps
              </Typography>
              {safeSwaps.length > 0 ? (
                <List>
                  {safeSwaps.slice(0, 5).map((swap, index) => (
                    <React.Fragment key={swap._id}>
                      <ListItem>
                        <ListItemAvatar>
                          {getStatusIcon(swap.status)}
                        </ListItemAvatar>
                        <ListItemText
                          primary={swap.title}
                          secondary={`${swap.status} • ${new Date(
                            swap.createdAt
                          ).toLocaleDateString()}`}
                        />
                        <Chip
                          label={swap.status}
                          color={getStatusColor(swap.status)}
                          size="small"
                        />
                      </ListItem>
                      {index < safeSwaps.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: "center", py: 3 }}>
                  <SwapHoriz
                    sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
                  />
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    gutterBottom
                  >
                    No swaps yet
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => navigate("/swaps/create")}
                  >
                    Create Your First Swap
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Feedback
              </Typography>
              {safeFeedback.length > 0 ? (
                <List>
                  {safeFeedback.slice(0, 5).map((item, index) => (
                    <React.Fragment key={item._id}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar>
                            <Star />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={`${item.rating}/5 stars`}
                          secondary={`${item.comment?.substring(0, 50)}${
                            item.comment?.length > 50 ? "..." : ""
                          }`}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </Typography>
                      </ListItem>
                      {index < safeFeedback.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: "center", py: 3 }}>
                  <Star sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    gutterBottom
                  >
                    No feedback yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Complete some swaps to receive feedback
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage;
