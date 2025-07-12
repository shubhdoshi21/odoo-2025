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
  Tabs,
  Tab,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Badge,
} from "@mui/material";
import {
  SwapHoriz,
  CheckCircle,
  Cancel,
  Schedule,
  LocationOn,
  AccessTime,
  School,
  Person,
  FilterList,
  Refresh,
  Visibility,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserSwaps,
  acceptSwap,
  rejectSwap,
  cancelSwap,
  clearError,
} from "../store/slices/swapSlice";
import LoadingSpinner from "../components/common/LoadingSpinner";

const SwapsPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { swaps = [], isLoading, error } = useSelector((state) => state.swaps);
  const { user: currentUser } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState(0);
  const [selectedSwap, setSelectedSwap] = useState(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    dispatch(getUserSwaps());
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Debug: Log swaps data
  useEffect(() => {
    console.log("Swaps data:", swaps);
    console.log("Current user:", currentUser);
    if (swaps && swaps.length > 0) {
      console.log("First swap structure:", swaps[0]);
      console.log("First swap requester:", swaps[0].requester);
      console.log("First swap responder:", swaps[0].responder);
      console.log("First swap offeredSkill:", swaps[0].offeredSkill);
      console.log("First swap requestedSkill:", swaps[0].requestedSkill);
    }
  }, [swaps, currentUser]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleAcceptSwap = async (swapId) => {
    try {
      await dispatch(acceptSwap(swapId)).unwrap();
      // Refresh the swaps list
      dispatch(getUserSwaps());
    } catch (error) {
      console.error("Failed to accept swap:", error);
    }
  };

  const handleRejectSwap = async (swapId) => {
    try {
      await dispatch(rejectSwap({ swapId, reason: rejectReason })).unwrap();
      setShowRejectDialog(false);
      setRejectReason("");
      setSelectedSwap(null);
      // Refresh the swaps list
      dispatch(getUserSwaps());
    } catch (error) {
      console.error("Failed to reject swap:", error);
    }
  };

  const openRejectDialog = (swap) => {
    setSelectedSwap(swap);
    setShowRejectDialog(true);
  };

  const closeRejectDialog = () => {
    setShowRejectDialog(false);
    setRejectReason("");
    setSelectedSwap(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "accepted":
        return "info";
      case "completed":
        return "success";
      case "rejected":
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Schedule />;
      case "accepted":
        return <CheckCircle />;
      case "completed":
        return <CheckCircle />;
      case "rejected":
      case "cancelled":
        return <Cancel />;
      default:
        return <SwapHoriz />;
    }
  };

  const filterSwapsByStatus = (status) => {
    if (!swaps || !Array.isArray(swaps)) return [];
    if (status === "all") return swaps;
    return swaps.filter((swap) => swap.status === status);
  };

  const getFilteredSwaps = () => {
    if (!swaps || !Array.isArray(swaps)) return [];

    switch (activeTab) {
      case 0: // All
        return swaps;
      case 1: // Pending
        return filterSwapsByStatus("pending");
      case 2: // Accepted
        return filterSwapsByStatus("accepted");
      case 3: // Completed
        return filterSwapsByStatus("completed");
      case 4: // Rejected/Cancelled
        return swaps.filter((swap) =>
          ["rejected", "cancelled"].includes(swap.status)
        );
      default:
        return swaps;
    }
  };

  const canUserActOnSwap = (swap) => {
    // User can only act on swaps where they are the responder and status is pending
    return (
      swap.responder?._id === currentUser?._id && swap.status === "pending"
    );
  };

  const isUserInitiator = (swap) => {
    return swap.requester?._id === currentUser?._id;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredSwaps = getFilteredSwaps();

  if (isLoading) {
    return <LoadingSpinner message="Loading your swaps..." />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          My Swaps
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your skill swap requests and track their status
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          onClose={() => dispatch(clearError())}
        >
          {error}
        </Alert>
      )}

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="swap status tabs"
        >
          <Tab
            label={
              <Badge badgeContent={swaps?.length || 0} color="primary">
                All
              </Badge>
            }
          />
          <Tab
            label={
              <Badge
                badgeContent={filterSwapsByStatus("pending")?.length || 0}
                color="warning"
              >
                Pending
              </Badge>
            }
          />
          <Tab
            label={
              <Badge
                badgeContent={filterSwapsByStatus("accepted")?.length || 0}
                color="info"
              >
                Accepted
              </Badge>
            }
          />
          <Tab
            label={
              <Badge
                badgeContent={filterSwapsByStatus("completed")?.length || 0}
                color="success"
              >
                Completed
              </Badge>
            }
          />
          <Tab
            label={
              <Badge
                badgeContent={
                  swaps?.filter((swap) =>
                    ["rejected", "cancelled"].includes(swap.status)
                  )?.length || 0
                }
                color="error"
              >
                Rejected/Cancelled
              </Badge>
            }
          />
        </Tabs>
      </Box>

      {/* Swaps Grid */}
      {filteredSwaps.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <SwapHoriz sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No swaps found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {activeTab === 0
              ? "You haven't made or received any swap requests yet."
              : `No ${
                  [
                    "all",
                    "pending",
                    "accepted",
                    "completed",
                    "rejected/cancelled",
                  ][activeTab]
                } swaps found.`}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredSwaps.map((swap) => (
            <Grid item xs={12} md={6} lg={4} key={swap._id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  "&:hover": {
                    boxShadow: theme.shadows[8],
                    transform: "translateY(-2px)",
                    transition: "all 0.2s ease-in-out",
                  },
                }}
              >
                {/* Status Badge */}
                <Box
                  sx={{ position: "absolute", top: 16, right: 16, zIndex: 1 }}
                >
                  <Chip
                    icon={getStatusIcon(swap.status)}
                    label={
                      swap.status.charAt(0).toUpperCase() + swap.status.slice(1)
                    }
                    color={getStatusColor(swap.status)}
                    size="small"
                  />
                </Box>

                <CardContent sx={{ flexGrow: 1, pt: 6 }}>
                  {/* Swap Title */}
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                  >
                    Skill Swap Request
                  </Typography>

                  {/* Skills Exchange */}
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      <strong>Skills Exchange:</strong>
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        flexWrap: "wrap",
                      }}
                    >
                      <Chip
                        icon={<School />}
                        label={
                          swap.offeredSkill?.name ||
                          `Skill ${
                            swap.offeredSkill?._id?.slice(-6) || "Unknown"
                          }`
                        }
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      <SwapHoriz color="action" fontSize="small" />
                      <Chip
                        icon={<School />}
                        label={
                          swap.requestedSkill?.name ||
                          `Skill ${
                            swap.requestedSkill?._id?.slice(-6) || "Unknown"
                          }`
                        }
                        size="small"
                        color="secondary"
                        variant="outlined"
                      />
                    </Box>
                  </Box>

                  {/* Message */}
                  {swap.message && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {swap.message.length > 100
                        ? `${swap.message.substring(0, 100)}...`
                        : swap.message}
                    </Typography>
                  )}

                  {/* Swap Details */}
                  <Box sx={{ mb: 2 }}>
                    {swap.scheduledDate && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <AccessTime fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          Scheduled: {formatDate(swap.scheduledDate)}
                        </Typography>
                      </Box>
                    )}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Person fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {isUserInitiator(swap)
                          ? "You initiated"
                          : "Requested from you"}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Swap Participants */}
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      <strong>Swap Participants:</strong>
                    </Typography>

                    {/* Requester */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <Avatar
                        src={swap.requester?.profilePhotoUrl}
                        alt={swap.requester?.name || "Requester"}
                        sx={{ width: 24, height: 24, fontSize: "0.75rem" }}
                      >
                        {swap.requester?.name?.[0] || "R"}
                      </Avatar>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {swap.requester?.name ||
                          `User ${swap.requester?._id?.slice(-6) || "Unknown"}`}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        (Requester)
                      </Typography>
                    </Box>

                    {/* Responder */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Avatar
                        src={swap.responder?.profilePhotoUrl}
                        alt={swap.responder?.name || "Responder"}
                        sx={{ width: 24, height: 24, fontSize: "0.75rem" }}
                      >
                        {swap.responder?.name?.[0] || "R"}
                      </Avatar>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {swap.responder?.name ||
                          `User ${swap.responder?._id?.slice(-6) || "Unknown"}`}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        (Responder)
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Date */}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    Created: {formatDate(swap.createdAt)}
                  </Typography>

                  {/* Action Buttons */}
                  <Box sx={{ display: "flex", gap: 1, mt: "auto" }}>
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/swaps/${swap._id}`)}
                        color="primary"
                      >
                        <Visibility />
                      </IconButton>
                    </Tooltip>

                    {canUserActOnSwap(swap) && (
                      <>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          startIcon={<CheckCircle />}
                          onClick={() => handleAcceptSwap(swap._id)}
                          sx={{ flexGrow: 1 }}
                        >
                          Accept
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          startIcon={<Cancel />}
                          onClick={() => openRejectDialog(swap)}
                        >
                          Reject
                        </Button>
                      </>
                    )}

                    {isUserInitiator(swap) && swap.status === "pending" && (
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<Cancel />}
                        onClick={() => {
                          setSelectedSwap(swap);
                          setShowRejectDialog(true);
                        }}
                        sx={{ flexGrow: 1 }}
                      >
                        Cancel
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Reject Dialog */}
      <Dialog
        open={showRejectDialog}
        onClose={closeRejectDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedSwap && isUserInitiator(selectedSwap)
            ? "Cancel Swap"
            : "Reject Swap Request"}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {selectedSwap && isUserInitiator(selectedSwap)
              ? "Are you sure you want to cancel this swap request?"
              : "Are you sure you want to reject this swap request?"}
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Reason (optional)"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Provide a reason for rejecting this request..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeRejectDialog}>Cancel</Button>
          <Button
            onClick={() => {
              if (selectedSwap && isUserInitiator(selectedSwap)) {
                // Cancel swap
                dispatch(
                  cancelSwap({ swapId: selectedSwap._id, reason: rejectReason })
                )
                  .unwrap()
                  .then(() => {
                    closeRejectDialog();
                    dispatch(getUserSwaps());
                  })
                  .catch((error) => {
                    console.error("Failed to cancel swap:", error);
                  });
              } else {
                // Reject swap
                handleRejectSwap(selectedSwap._id);
              }
            }}
            color="error"
            variant="contained"
          >
            {selectedSwap && isUserInitiator(selectedSwap)
              ? "Cancel Swap"
              : "Reject Request"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SwapsPage;
