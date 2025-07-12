import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import {
  SwapHoriz,
  ArrowBack,
  School,
  LocationOn,
  AccessTime,
  Schedule,
  Person,
  Send,
} from '@mui/icons-material';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getSwapById } from '../store/slices/swapSlice';
import { getUserById } from '../store/slices/userSlice';
import LoadingSpinner from '../components/common/LoadingSpinner';

const SwapDetailPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { swapId } = useParams();

  const { currentSwap, isLoading: swapLoading } = useSelector(
    state => state.swaps,
  );
  const { currentUser: targetUser, isLoading: userLoading } = useSelector(
    state => state.users,
  );
  const { user: currentUser } = useSelector(state => state.auth);

  const [showCreateRequestDialog, setShowCreateRequestDialog] = useState(false);
  const [requestData, setRequestData] = useState({
    offeredSkill: '',
    wantedSkill: '',
    message: '',
  });

  useEffect(() => {
    if (swapId) {
      dispatch(getSwapById(swapId));
    }
  }, [dispatch, swapId]);

  useEffect(() => {
    if (currentSwap?.targetUserId) {
      dispatch(getUserById(currentSwap.targetUserId));
    }
  }, [dispatch, currentSwap]);

  const getStatusColor = status => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'accepted':
        return 'info';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleCreateRequest = () => {
    setShowCreateRequestDialog(true);
  };

  const handleSubmitRequest = () => {
    // Handle request submission logic here
    console.log('Submitting request:', requestData);
    setShowCreateRequestDialog(false);
    setRequestData({ offeredSkill: '', wantedSkill: '', message: '' });
  };

  if (swapLoading || userLoading) {
    return <LoadingSpinner />;
  }

  if (!currentSwap) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Swap not found
          </Typography>
          <Button
            variant="outlined"
            onClick={() => navigate('/swaps')}
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
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              mb: 3,
            }}
          >
            <Box>
              <Typography variant="h4" gutterBottom>
                {currentSwap.title}
              </Typography>
              <Chip
                label={
                  currentSwap.status.charAt(0).toUpperCase() +
                  currentSwap.status.slice(1)
                }
                color={getStatusColor(currentSwap.status)}
                sx={{ mb: 2 }}
              />
              <Typography variant="body1" color="text.secondary" paragraph>
                {currentSwap.description}
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => navigate('/swaps')}
            >
              Back to Swaps
            </Button>
          </Box>

          {/* Skills Exchange */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <School color="primary" />
              <Typography variant="h6">
                {currentSwap.offeredSkill?.name || 'Unknown Skill'}
              </Typography>
            </Box>
            <SwapHoriz color="action" />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <School color="primary" />
              <Typography variant="h6">
                {currentSwap.wantedSkill?.name || 'Unknown Skill'}
              </Typography>
            </Box>
          </Box>

          {/* Swap Details */}
          <Grid container spacing={2}>
            {currentSwap.duration && (
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccessTime color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {currentSwap.duration}
                  </Typography>
                </Box>
              </Grid>
            )}
            {currentSwap.location && (
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOn color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {currentSwap.location}
                  </Typography>
                </Box>
              </Grid>
            )}
            {currentSwap.preferredTime && (
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Schedule color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {currentSwap.preferredTime}
                  </Typography>
                </Box>
              </Grid>
            )}
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" color="text.secondary">
                Created: {new Date(currentSwap.createdAt).toLocaleDateString()}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Users Section */}
      <Grid container spacing={3}>
        {/* Initiator */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Swap Initiator
              </Typography>
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}
              >
                <Avatar
                  src={currentSwap.initiator?.profilePicture}
                  alt={currentSwap.initiator?.username}
                  sx={{ width: 60, height: 60 }}
                >
                  {currentSwap.initiator?.firstName?.[0]}
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {currentSwap.initiator?.firstName}{' '}
                    {currentSwap.initiator?.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    @{currentSwap.initiator?.username}
                  </Typography>
                  {currentSwap.initiator?.location && (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        mt: 0.5,
                      }}
                    >
                      <LocationOn fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {currentSwap.initiator.location}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>

              {currentSwap.initiator?.skills &&
                currentSwap.initiator.skills.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Skills Offered:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {currentSwap.initiator.skills.map((skill, index) => (
                        <Chip
                          key={index}
                          label={skill.name}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>
                )}
            </CardContent>
          </Card>
        </Grid>

        {/* Target User */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Swap Partner
              </Typography>
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}
              >
                <Avatar
                  src={targetUser?.profilePicture}
                  alt={targetUser?.username}
                  sx={{ width: 60, height: 60 }}
                >
                  {targetUser?.firstName?.[0]}
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {targetUser?.firstName} {targetUser?.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    @{targetUser?.username}
                  </Typography>
                  {targetUser?.location && (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        mt: 0.5,
                      }}
                    >
                      <LocationOn fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {targetUser.location}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>

              {targetUser?.skills && targetUser.skills.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Skills Offered:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {targetUser.skills.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill.name}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {targetUser?.wantedSkills &&
                targetUser.wantedSkills.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Skills Wanted:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {targetUser.wantedSkills.map((skill, index) => (
                        <Chip
                          key={index}
                          label={skill.name}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>
                )}

              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<Send />}
                  onClick={handleCreateRequest}
                >
                  Create Swap Request
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
        <DialogTitle>Create Swap Request</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>My Offered Skill</InputLabel>
              <Select
                value={requestData.offeredSkill}
                label="My Offered Skill"
                onChange={e =>
                  setRequestData({
                    ...requestData,
                    offeredSkill: e.target.value,
                  })
                }
              >
                {currentUser?.skills?.map(skill => (
                  <MenuItem key={skill._id} value={skill._id}>
                    {skill.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Their Wanted Skill</InputLabel>
              <Select
                value={requestData.wantedSkill}
                label="Their Wanted Skill"
                onChange={e =>
                  setRequestData({
                    ...requestData,
                    wantedSkill: e.target.value,
                  })
                }
              >
                {targetUser?.wantedSkills?.map(skill => (
                  <MenuItem key={skill._id} value={skill._id}>
                    {skill.name}
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
              onChange={e =>
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
