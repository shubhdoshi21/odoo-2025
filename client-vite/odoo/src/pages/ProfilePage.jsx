import React, { useEffect, useState } from "react";
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
  Alert,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { getUserById } from "../store/slices/userSlice";
import { updateProfile } from "../store/slices/authSlice";

const ProfilePage = () => {
  const dispatch = useDispatch();

  //   useEffect(() => {
  //   dispatch({
  //     type: "users/getUserById/fulfilled", // mock success action
  //     payload: {
  //       user: {
  //         id: "dummy123",
  //         name: "Test User",
  //         location: "Testville",
  //         isPublic: true,
  //         offeredSkills: ["React", "Node.js"],
  //         wantedSkills: ["Go", "Rust"],
  //         profilePhotoUrl: "", // optional
  //         availability: ["Evenings", "Weekends"],
  //       },
  //     },
  //   });
  // }, [dispatch]);

  // Get user data from auth slice (current logged-in user)
  const currentUser = useSelector((state) => state.auth.user);
  const isLoading = useSelector((state) => state.auth.isLoading);
  const error = useSelector((state) => state.auth.error);

  // Local UI state
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [offeredSkills, setOfferedSkills] = useState([]);
  const [wantedSkills, setWantedSkills] = useState([]);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [newOfferedSkill, setNewOfferedSkill] = useState("");
  const [newWantedSkill, setNewWantedSkill] = useState("");

  // Load profile data when component mounts
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || "");
      setLocation(currentUser.location || "");
      setIsPublic(
        currentUser.isPublic !== undefined ? currentUser.isPublic : true
      );

      // Handle skills - they can be objects with _id and name, or just strings
      const extractSkillNames = (skills) => {
        if (!skills || !Array.isArray(skills)) return [];
        return skills.map((skill) =>
          typeof skill === "string" ? skill : skill.name
        );
      };

      setOfferedSkills(extractSkillNames(currentUser.offeredSkills));
      setWantedSkills(extractSkillNames(currentUser.wantedSkills));

      console.log("Profile photo URL:", currentUser.profilePhotoUrl);
      console.log("Profile photo field:", currentUser.profilePhoto);

      if (currentUser.profilePhotoUrl) {
        setPreviewPhoto(currentUser.profilePhotoUrl);
      } else if (currentUser.profilePhoto) {
        // Fallback: construct URL manually if virtual not working
        const photoUrl = `http://localhost:3001/api/profile-photo/${currentUser.profilePhoto}`;
        console.log("Constructed photo URL:", photoUrl);
        setPreviewPhoto(photoUrl);
      }
    }
  }, [currentUser]);

  // Debug log to see current user data
  useEffect(() => {
    console.log("Current user data:", currentUser);
  }, [currentUser]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
      setPreviewPhoto(URL.createObjectURL(file));
    }
  };

  const handleRemoveSkill = (skill, type) => {
    if (type === "offered") {
      setOfferedSkills((prev) => prev.filter((s) => s !== skill));
    } else {
      setWantedSkills((prev) => prev.filter((s) => s !== skill));
    }
  };

  const handleAddSkill = (e, type) => {
    e.preventDefault();
    const skill = (
      type === "offered" ? newOfferedSkill : newWantedSkill
    ).trim();
    if (!skill) return;

    if (type === "offered" && !offeredSkills.includes(skill)) {
      setOfferedSkills((prev) => [...prev, skill]);
      setNewOfferedSkill("");
    }

    if (type === "wanted" && !wantedSkills.includes(skill)) {
      setWantedSkills((prev) => [...prev, skill]);
      setNewWantedSkill("");
    }
  };

  const handleSubmit = async () => {
    try {
      const profileData = {
        name,
        location,
        isPublic,
        offeredSkills,
        wantedSkills,
        availability: currentUser?.availability || [],
      };

      console.log("Submitting profile data:", profileData);

      // If there's a new profile photo, add it to FormData
      if (profilePhoto) {
        const formData = new FormData();
        Object.keys(profileData).forEach((key) => {
          if (
            key === "offeredSkills" ||
            key === "wantedSkills" ||
            key === "availability"
          ) {
            // Send skills as individual form fields, not as JSON string
            if (Array.isArray(profileData[key])) {
              profileData[key].forEach((item, index) => {
                formData.append(`${key}[${index}]`, item);
              });
            }
          } else {
            formData.append(key, profileData[key]);
          }
        });
        formData.append("profilePhoto", profilePhoto);

        console.log("Sending FormData with file:", profilePhoto.name);
        console.log("FormData contents:");
        for (let [key, value] of formData.entries()) {
          console.log(key, value);
        }

        await dispatch(updateProfile(formData)).unwrap();
      } else {
        // Send as JSON if no file upload
        console.log("Sending JSON data");
        await dispatch(updateProfile(profileData)).unwrap();
      }

      // Clear the profile photo state after successful update
      setProfilePhoto(null);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
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

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Profile Photo */}
      <Box display="flex" alignItems="center" mb={3}>
        {previewPhoto ? (
          <img
            src={previewPhoto}
            alt="Profile"
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              objectFit: "cover",
              marginRight: 16,
              border: "2px solid #ddd",
            }}
            onError={(e) => {
              console.error("Image failed to load:", previewPhoto);
              console.error("Error event:", e);
            }}
            onLoad={() => {
              console.log("Image loaded successfully:", previewPhoto);
            }}
          />
        ) : (
          <Avatar sx={{ width: 80, height: 80, mr: 2 }} alt="Profile" />
        )}
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

      {/* Debug info */}
      {previewPhoto && (
        <Box mb={2}>
          <Typography variant="body2" color="textSecondary">
            Debug: Image URL: {previewPhoto}
          </Typography>
        </Box>
      )}

      {/* Name */}
      <TextField
        label="Name"
        value={name}
        fullWidth
        onChange={(e) => setName(e.target.value)}
        margin="normal"
      />

      {/* Location */}
      <TextField
        label="Location"
        value={location}
        fullWidth
        onChange={(e) => setLocation(e.target.value)}
        margin="normal"
      />

      {/* Profile Type */}
      <FormControlLabel
        control={
          <Switch
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />
        }
        label={isPublic ? "Public Profile" : "Private Profile"}
      />

      {/* Offered Skills */}
      <Box mt={3}>
        <Typography variant="h6">Offered Skills</Typography>
        <Grid container spacing={1} mt={1}>
          {offeredSkills.map((skill) => (
            <Grid item key={skill}>
              <Chip
                label={skill}
                onDelete={() => handleRemoveSkill(skill, "offered")}
                deleteIcon={<Close />}
              />
            </Grid>
          ))}
        </Grid>
        <Box
          component="form"
          onSubmit={(e) => handleAddSkill(e, "offered")}
          mt={2}
        >
          <TextField
            label="Add Offered Skill"
            value={newOfferedSkill}
            onChange={(e) => setNewOfferedSkill(e.target.value)}
            fullWidth
          />
        </Box>
      </Box>

      {/* Wanted Skills */}
      <Box mt={3}>
        <Typography variant="h6">Wanted Skills</Typography>
        <Grid container spacing={1} mt={1}>
          {wantedSkills.map((skill) => (
            <Grid item key={skill}>
              <Chip
                label={skill}
                onDelete={() => handleRemoveSkill(skill, "wanted")}
                deleteIcon={<Close />}
              />
            </Grid>
          ))}
        </Grid>
        <Box
          component="form"
          onSubmit={(e) => handleAddSkill(e, "wanted")}
          mt={2}
        >
          <TextField
            label="Add Wanted Skill"
            value={newWantedSkill}
            onChange={(e) => setNewWantedSkill(e.target.value)}
            fullWidth
          />
        </Box>
      </Box>

      {/* Submit */}
      <Box mt={4}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save Profile"}
        </Button>
      </Box>
    </Container>
  );
};

export default ProfilePage;
