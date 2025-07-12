import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Avatar,
  FormControlLabel,
  Switch,
  Chip,
  Grid,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile } from '../store/slices/authSlice'; // Use auth slice instead

const ProfilePage = () => {
  const dispatch = useDispatch();

  // Get user data from auth slice (current logged-in user)
  const currentUser = useSelector(state => state.auth.user);
  const isLoading = useSelector(state => state.auth.isLoading);

  // Local UI state
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [offeredSkills, setOfferedSkills] = useState([]);
  const [wantedSkills, setWantedSkills] = useState([]);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [newOfferedSkill, setNewOfferedSkill] = useState('');
  const [newWantedSkill, setNewWantedSkill] = useState('');

  // Load profile data when component mounts
  useEffect(() => {
    if (!currentUser) {
      dispatch(getProfile());
    }
  }, [dispatch, currentUser]);

  useEffect(() => {
    if (currentUser) {
      console.log('Current user data:', currentUser);
      setName(currentUser.name || '');
      setLocation(currentUser.location || '');
      setIsPublic(
        currentUser.isPublic !== undefined ? currentUser.isPublic : true,
      );

      // Handle skills - they can be objects with _id and name, or just strings
      const extractSkillNames = skills => {
        if (!skills || !Array.isArray(skills)) return [];
        return skills.map(skill =>
          typeof skill === 'string' ? skill : skill.name,
        );
      };

      setOfferedSkills(extractSkillNames(currentUser.offeredSkills));
      setWantedSkills(extractSkillNames(currentUser.wantedSkills));

      // Set profile photo URL
      console.log('Profile photo data:', {
        profilePhotoUrl: currentUser.profilePhotoUrl,
        profilePhoto: currentUser.profilePhoto,
      });

      if (currentUser.profilePhotoUrl) {
        console.log('Using profilePhotoUrl:', currentUser.profilePhotoUrl);
        setPreviewPhoto(currentUser.profilePhotoUrl);
      } else if (currentUser.profilePhoto) {
        // Construct URL if only filename is available
        const baseUrl =
          process.env.REACT_APP_API_URL || 'http://localhost:3001';
        const photoUrl = `${baseUrl}/uploads/${currentUser.profilePhoto}`;
        console.log('Constructed photo URL:', photoUrl);
        setPreviewPhoto(photoUrl);
      } else {
        console.log('No profile photo available');
        setPreviewPhoto(null);
      }
    }
  }, [currentUser]);

  const handleImageUpload = e => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
      setPreviewPhoto(URL.createObjectURL(file));
    }
  };

  const handleRemoveSkill = (skill, type) => {
    if (type === 'offered') {
      setOfferedSkills(prev => prev.filter(s => s !== skill));
    } else {
      setWantedSkills(prev => prev.filter(s => s !== skill));
    }
  };

  const handleAddSkill = (e, type) => {
    e.preventDefault();
    const skill = (
      type === 'offered' ? newOfferedSkill : newWantedSkill
    ).trim();
    if (!skill) return;

    if (type === 'offered' && !offeredSkills.includes(skill)) {
      setOfferedSkills(prev => [...prev, skill]);
      setNewOfferedSkill('');
    }

    if (type === 'wanted' && !wantedSkills.includes(skill)) {
      setWantedSkills(prev => [...prev, skill]);
      setNewWantedSkill('');
    }
  };

  const handleSubmit = () => {
    // Call update API with edited values
    const formData = new FormData();
    formData.append('name', name);
    formData.append('location', location);
    formData.append('isPublic', isPublic);
    formData.append('offeredSkills', JSON.stringify(offeredSkills));
    formData.append('wantedSkills', JSON.stringify(wantedSkills));
    formData.append(
      'availability',
      JSON.stringify(currentUser.availability || []),
    );
    if (profilePhoto) formData.append('profilePhoto', profilePhoto);

    // Example: userService.updateUserProfile(loggedInUserId, formData);
    console.log('Submitting:', Object.fromEntries(formData));
  };

  if (isLoading || !currentUser) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>Loading profile...</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Edit Profile
      </Typography>

      {/* Profile Photo */}
      <Box display="flex" alignItems="center" mb={3}>
        <Avatar
          src={previewPhoto}
          sx={{ width: 80, height: 80, mr: 2 }}
          alt="Profile"
        />
        <Button variant="contained" component="label">
          Upload Photo
          <input
            hidden
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </Button>
        {profilePhoto && (
          <Button
            color="error"
            sx={{ ml: 2 }}
            onClick={() => {
              setProfilePhoto(null);
              setPreviewPhoto(null);
            }}
          >
            Remove
          </Button>
        )}
      </Box>

      {/* Name */}
      <TextField
        label="Name"
        value={name}
        fullWidth
        onChange={e => setName(e.target.value)}
        margin="normal"
      />

      {/* Location */}
      <TextField
        label="Location"
        value={location}
        fullWidth
        onChange={e => setLocation(e.target.value)}
        margin="normal"
      />

      {/* Profile Type */}
      <FormControlLabel
        control={
          <Switch
            checked={isPublic}
            onChange={e => setIsPublic(e.target.checked)}
          />
        }
        label={isPublic ? 'Public Profile' : 'Private Profile'}
      />

      {/* Offered Skills */}
      <Box mt={3}>
        <Typography variant="h6">Offered Skills</Typography>
        <Grid container spacing={1} mt={1}>
          {offeredSkills.map(skill => (
            <Grid item key={skill}>
              <Chip
                label={skill}
                onDelete={() => handleRemoveSkill(skill, 'offered')}
                deleteIcon={<Close />}
              />
            </Grid>
          ))}
        </Grid>
        <Box
          component="form"
          onSubmit={e => handleAddSkill(e, 'offered')}
          mt={2}
        >
          <TextField
            label="Add Offered Skill"
            value={newOfferedSkill}
            onChange={e => setNewOfferedSkill(e.target.value)}
            fullWidth
          />
        </Box>
      </Box>

      {/* Wanted Skills */}
      <Box mt={3}>
        <Typography variant="h6">Wanted Skills</Typography>
        <Grid container spacing={1} mt={1}>
          {wantedSkills.map(skill => (
            <Grid item key={skill}>
              <Chip
                label={skill}
                onDelete={() => handleRemoveSkill(skill, 'wanted')}
                deleteIcon={<Close />}
              />
            </Grid>
          ))}
        </Grid>
        <Box
          component="form"
          onSubmit={e => handleAddSkill(e, 'wanted')}
          mt={2}
        >
          <TextField
            label="Add Wanted Skill"
            value={newWantedSkill}
            onChange={e => setNewWantedSkill(e.target.value)}
            fullWidth
          />
        </Box>
      </Box>

      {/* Submit */}
      <Box mt={4}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Save Profile
        </Button>
      </Box>
    </Container>
  );
};

export default ProfilePage;
