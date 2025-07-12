import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  Divider,
  useTheme,
  Breadcrumbs,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Rating,
} from "@mui/material";
import {
  Person,
  LocationOn,
  School,
  Star,
  Send,
  ArrowBack,
  SwapHoriz,
} from "@mui/icons-material";
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserById } from "../store/slices/userSlice";
import { createSwap, clearError } from "../store/slices/swapSlice";
import LoadingSpinner from "../components/common/LoadingSpinner";

const UserDetailPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userId } = useParams();

  const { currentUser, isLoading } = useSelector((state) => state.users);
  const { user: currentAuthUser } = useSelector((state) => state.auth);
  const { isLoading: isSwapLoading, error: swapError } = useSelector(
    (state) => state.swaps
  );

  const [showCreateRequestDialog, setShowCreateRequestDialog] = useState(false);
  const [requestData, setRequestData] = useState({
    offeredSkill: "",
    wantedSkill: "",
    message: "",
  });

  useEffect(() => {
    if (userId) {
      dispatch(getUserById(userId));
    }
  }, [dispatch, userId]);

  const handleCreateRequest = () => {
    dispatch(clearError()); // Clear any previous errors
    setShowCreateRequestDialog(true);
  };

  const handleSubmitRequest = async () => {
    try {
      // Format the data according to backend validation rules
      const swapData = {
        responder: currentUser._id, // The user we're requesting from
        offeredSkill: requestData.offeredSkill, // My skill that I'm offering
        requestedSkill: requestData.wantedSkill, // Their offered skill that I want
        message: requestData.message || "", // Optional message
      };

      console.log("Submitting swap request:", swapData);

      // Dispatch the create swap action
      await dispatch(createSwap(swapData)).unwrap();

      // Close dialog and reset form on success
      setShowCreateRequestDialog(false);
      setRequestData({ offeredSkill: "", wantedSkill: "", message: "" });

      // Show success message (you can add a toast notification here)
      console.log("Swap request created successfully!");
    } catch (error) {
      console.error("Failed to create swap request:", error);
      // You can add error handling here (show error message to user)
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!currentUser) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            User not found
          </Typography>
          <Button
            variant="outlined"
            onClick={() => navigate("/users")}
            startIcon={<ArrowBack />}
          >
            Back to Users
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          component={RouterLink}
          to="/users"
          color="inherit"
          underline="hover"
        >
          Users
        </Link>
        <Typography color="text.primary">{currentUser.name}</Typography>
      </Breadcrumbs>

      {/* User Profile Header */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
              <Avatar
                src={currentUser.profilePicture}
                alt={currentUser.username}
                sx={{ width: 100, height: 100 }}
              >
                {currentUser.name?.[0]}
              </Avatar>
              <Box>
                <Typography variant="h4" gutterBottom>
                  {currentUser.name}
                </Typography>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  @{currentUser.username}
                </Typography>
                {currentUser.location && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <LocationOn color="action" />
                    <Typography variant="body1" color="text.secondary">
                      {currentUser.location}
                    </Typography>
                  </Box>
                )}
                {currentUser.rating && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Rating value={currentUser.rating} readOnly size="small" />
                    <Typography variant="body2" color="text.secondary">
                      ({currentUser.rating})
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => navigate("/users")}
            >
              Back to Users
            </Button>
          </Box>

          {currentUser.bio && (
            <Typography variant="body1" color="text.secondary" paragraph>
              {currentUser.bio}
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Skills and Actions */}
      <Grid container spacing={3}>
        {/* Skills Offered */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Skills Offered
              </Typography>
              {currentUser.offeredSkills &&
              currentUser.offeredSkills.length > 0 ? (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {currentUser.offeredSkills.map((skill, index) => (
                    <Chip
                      key={index}
                      label={typeof skill === "string" ? skill : skill.name}
                      size="medium"
                      variant="outlined"
                      icon={<School />}
                    />
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No skills offered yet
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Skills Wanted */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Skills Wanted
              </Typography>
              {currentUser.wantedSkills &&
              currentUser.wantedSkills.length > 0 ? (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {currentUser.wantedSkills.map((skill, index) => (
                    <Chip
                      key={index}
                      label={typeof skill === "string" ? skill : skill.name}
                      size="medium"
                      color="primary"
                      variant="outlined"
                      icon={<School />}
                    />
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No skills wanted yet
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* User Stats */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                User Statistics
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="h4" color="primary">
                      {currentUser.completedSwaps || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Completed Swaps
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="h4" color="primary">
                      {currentUser.totalSwaps || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Swaps
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="h4" color="primary">
                      {currentUser.offeredSkills?.length || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Skills Offered
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="h4" color="primary">
                      {currentUser.wantedSkills?.length || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Skills Wanted
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<Send />}
                  onClick={handleCreateRequest}
                  disabled={
                    !currentAuthUser || currentAuthUser._id === currentUser._id
                  }
                >
                  Create Swap Request
                </Button>
                {/* <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<SwapHoriz />}
                  onClick={() => navigate("/create-swap")}
                >
                  Create New Swap
                </Button> */}
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate("/users")}
                >
                  Browse More Users
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Create Request Dialog */}
      <Dialog
        open={showCreateRequestDialog}
        onClose={() => setShowCreateRequestDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create Swap Request with {currentUser.name}</DialogTitle>
        <DialogContent>
          {swapError && (
            <Box sx={{ mb: 2 }}>
              <Typography color="error" variant="body2">
                {swapError}
              </Typography>
            </Box>
          )}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>My Offered Skill</InputLabel>
              <Select
                value={requestData.offeredSkill}
                label="My Offered Skill"
                onChange={(e) =>
                  setRequestData({
                    ...requestData,
                    offeredSkill: e.target.value,
                  })
                }
              >
                {currentAuthUser?.offeredSkills?.map((skill) => (
                  <MenuItem key={skill._id || skill} value={skill._id || skill}>
                    {typeof skill === "string" ? skill : skill.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Their Offered Skill (What I Want)</InputLabel>
              <Select
                value={requestData.wantedSkill}
                label="Their Offered Skill (What I Want)"
                onChange={(e) =>
                  setRequestData({
                    ...requestData,
                    wantedSkill: e.target.value,
                  })
                }
              >
                {currentUser?.offeredSkills?.map((skill) => (
                  <MenuItem key={skill._id || skill} value={skill._id || skill}>
                    {typeof skill === "string" ? skill : skill.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Message"
              multiline
              rows={4}
              value={requestData.message}
              onChange={(e) =>
                setRequestData({ ...requestData, message: e.target.value })
              }
              placeholder={`Hi ${currentUser.name}, I'd like to exchange skills with you...`}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              dispatch(clearError());
              setShowCreateRequestDialog(false);
            }}
            disabled={isSwapLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmitRequest}
            variant="contained"
            disabled={
              !requestData.offeredSkill ||
              !requestData.wantedSkill ||
              isSwapLoading
            }
          >
            {isSwapLoading ? "Creating..." : "Submit Request"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserDetailPage;
