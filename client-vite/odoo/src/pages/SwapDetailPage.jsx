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
  Alert,
} from "@mui/material";
import {
  SwapHoriz,
  ArrowBack,
  School,
  LocationOn,
  AccessTime,
  Schedule,
  Person,
  Send,
} from "@mui/icons-material";
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSwapById } from "../store/slices/swapSlice";
import LoadingSpinner from "../components/common/LoadingSpinner";

const SwapDetailPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { swapId } = useParams();

  const { currentSwap, isLoading: swapLoading } = useSelector(
    (state) => state.swaps
  );
  const { user: currentUser } = useSelector((state) => state.auth);

  const [showCreateRequestDialog, setShowCreateRequestDialog] = useState(false);
  const [requestData, setRequestData] = useState({
    offeredSkill: "",
    wantedSkill: "",
    message: "",
  });

  useEffect(() => {
    if (swapId) {
      dispatch(getSwapById(swapId));
    }
  }, [dispatch, swapId]);

  // Debug: Log swap data
  useEffect(() => {
    console.log("SwapDetailPage - currentSwap:", currentSwap);
    if (currentSwap) {
      console.log("SwapDetailPage - requester:", currentSwap.requester);
      console.log("SwapDetailPage - responder:", currentSwap.responder);
      console.log("SwapDetailPage - offeredSkill:", currentSwap.offeredSkill);
      console.log(
        "SwapDetailPage - requestedSkill:",
        currentSwap.requestedSkill
      );
    }
  }, [currentSwap]);

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

  const handleCreateRequest = () => {
    setShowCreateRequestDialog(true);
  };

  const handleSubmitRequest = () => {
    // Handle request submission logic here
    console.log("Submitting request:", requestData);
    setShowCreateRequestDialog(false);
    setRequestData({ offeredSkill: "", wantedSkill: "", message: "" });
  };

  if (swapLoading) {
    return <LoadingSpinner />;
  }

  if (!currentSwap) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Swap not found
          </Typography>
          <Button
            variant="outlined"
            onClick={() => navigate("/swaps")}
            startIcon={<ArrowBack />}
          >
            Back to Swaps
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
          to="/swaps"
          color="inherit"
          underline="hover"
        >
          My Swaps
        </Link>
        <Typography color="text.primary">Swap Details</Typography>
      </Breadcrumbs>

      {/* Swap Header */}
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
            <Box>
              <Typography variant="h4" gutterBottom>
                Skill Swap Request
              </Typography>
              <Chip
                label={
                  currentSwap.status.charAt(0).toUpperCase() +
                  currentSwap.status.slice(1)
                }
                color={getStatusColor(currentSwap.status)}
                sx={{ mb: 2 }}
              />
              {currentSwap.message && (
                <Typography variant="body1" color="text.secondary" paragraph>
                  {currentSwap.message}
                </Typography>
              )}
            </Box>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => navigate("/swaps")}
            >
              Back to Swaps
            </Button>
          </Box>

          {/* Skills Exchange */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <School color="primary" />
              <Typography variant="h6">
                {currentSwap.offeredSkill?.name ||
                  `Skill ${
                    currentSwap.offeredSkill?._id?.slice(-6) || "Unknown"
                  }`}
              </Typography>
            </Box>
            <SwapHoriz color="action" />
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <School color="primary" />
              <Typography variant="h6">
                {currentSwap.requestedSkill?.name ||
                  `Skill ${
                    currentSwap.requestedSkill?._id?.slice(-6) || "Unknown"
                  }`}
              </Typography>
            </Box>
          </Box>

          {/* Swap Details */}
          <Grid container spacing={2}>
            {currentSwap.scheduledDate && (
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccessTime color="action" />
                  <Typography variant="body2" color="text.secondary">
                    Scheduled: {new Date(currentSwap.scheduledDate).toLocaleDateString()}
                  </Typography>
                </Box>
              </Grid>
            )}
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" color="text.secondary">
                Created: {new Date(currentSwap.createdAt).toLocaleDateString()}
              </Typography>
            </Grid>
            {currentSwap.rejectedAt && (
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Rejected: {new Date(currentSwap.rejectedAt).toLocaleDateString()}
                </Typography>
              </Grid>
            )}
            {currentSwap.cancelledAt && (
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Cancelled: {new Date(currentSwap.cancelledAt).toLocaleDateString()}
                </Typography>
              </Grid>
            )}
          </Grid>

          {/* Additional Information */}
          {(currentSwap.rejectionReason || currentSwap.cancellationReason) && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                {currentSwap.rejectionReason ? 'Rejection Reason:' : 'Cancellation Reason:'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {currentSwap.rejectionReason || currentSwap.cancellationReason}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Users Section */}
      <Grid container spacing={3}>
        {/* Requester */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Swap Requester
              </Typography>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
              >
                <Avatar
                  src={currentSwap.requester?.profilePhotoUrl}
                  alt={currentSwap.requester?.name || "Requester"}
                  sx={{ width: 60, height: 60 }}
                >
                  {currentSwap.requester?.name?.[0] || "R"}
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {currentSwap.requester?.name ||
                      `User ${
                        currentSwap.requester?._id?.slice(-6) || "Unknown"
                      }`}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {currentSwap.requester?.email}
                  </Typography>
                  {currentSwap.requester?.location && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        mt: 0.5,
                      }}
                    >
                      <LocationOn fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {currentSwap.requester.location}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>

              {currentSwap.requester?.offeredSkills &&
                currentSwap.requester.offeredSkills.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Skills Offered:
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {currentSwap.requester.offeredSkills.map(
                        (skill, index) => (
                          <Chip
                            key={index}
                            label={
                              typeof skill === "string" ? skill : skill.name
                            }
                            size="small"
                            variant="outlined"
                          />
                        )
                      )}
                    </Box>
                  </Box>
                )}

              {currentSwap.requester?.wantedSkills &&
                currentSwap.requester.wantedSkills.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Skills Wanted:
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {currentSwap.requester.wantedSkills.map(
                        (skill, index) => (
                          <Chip
                            key={index}
                            label={
                              typeof skill === "string" ? skill : skill.name
                            }
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        )
                      )}
                    </Box>
                  </Box>
                )}
            </CardContent>
          </Card>
        </Grid>

        {/* Responder */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Swap Responder
              </Typography>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
              >
                <Avatar
                  src={currentSwap.responder?.profilePhotoUrl}
                  alt={currentSwap.responder?.name || "Responder"}
                  sx={{ width: 60, height: 60 }}
                >
                  {currentSwap.responder?.name?.[0] || "R"}
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {currentSwap.responder?.name ||
                      `User ${
                        currentSwap.responder?._id?.slice(-6) || "Unknown"
                      }`}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {currentSwap.responder?.email}
                  </Typography>
                  {currentSwap.responder?.location && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        mt: 0.5,
                      }}
                    >
                      <LocationOn fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {currentSwap.responder.location}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>

              {currentSwap.responder?.offeredSkills &&
                currentSwap.responder.offeredSkills.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Skills Offered:
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {currentSwap.responder.offeredSkills.map(
                        (skill, index) => (
                          <Chip
                            key={index}
                            label={
                              typeof skill === "string" ? skill : skill.name
                            }
                            size="small"
                            variant="outlined"
                          />
                        )
                      )}
                    </Box>
                  </Box>
                )}

              {currentSwap.responder?.wantedSkills &&
                currentSwap.responder.wantedSkills.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Skills Wanted:
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {currentSwap.responder.wantedSkills.map(
                        (skill, index) => (
                          <Chip
                            key={index}
                            label={
                              typeof skill === "string" ? skill : skill.name
                            }
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        )
                      )}
                    </Box>
                  </Box>
                )}
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
        <DialogTitle>Create Swap Request</DialogTitle>
        <DialogContent>
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
                {currentUser?.offeredSkills?.map((skill) => (
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
                {currentSwap.responder?.offeredSkills?.map((skill) => (
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
              placeholder="Describe what you want to exchange and any specific requirements..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreateRequestDialog(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmitRequest}
            variant="contained"
            disabled={!requestData.offeredSkill || !requestData.wantedSkill}
          >
            Submit Request
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SwapDetailPage;
