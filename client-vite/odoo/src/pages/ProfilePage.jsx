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
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { getUserById } from "../store/slices/userSlice"; // Adjust path as needed

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

  // Replace with actual logic to get the logged-in user's ID (from auth)
  const loggedInUserId = useSelector((state) => state.auth.user?.id);

  // Redux store data
  const currentUser = useSelector((state) => state.users.currentUser);
  const isLoading = useSelector((state) => state.users.isLoading);

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

  useEffect(() => {
    if (loggedInUserId) {
      dispatch(getUserById(loggedInUserId));
    }
  }, [dispatch, loggedInUserId]);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || "");
      setLocation(currentUser.location || "");
      setIsPublic(currentUser.isPublic);
      setOfferedSkills(currentUser.offeredSkills || []);
      setWantedSkills(currentUser.wantedSkills || []);
      if (currentUser.profilePhotoUrl) {
        setPreviewPhoto(currentUser.profilePhotoUrl);
      }
    }
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
    const skill = (type === "offered" ? newOfferedSkill : newWantedSkill).trim();
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

  const handleSubmit = () => {
    // Call update API with edited values
    const formData = new FormData();
    formData.append("name", name);
    formData.append("location", location);
    formData.append("isPublic", isPublic);
    formData.append("offeredSkills", JSON.stringify(offeredSkills));
    formData.append("wantedSkills", JSON.stringify(wantedSkills));
    formData.append("availability", JSON.stringify(currentUser.availability || []));
    if (profilePhoto) formData.append("profilePhoto", profilePhoto);

    // Example: userService.updateUserProfile(loggedInUserId, formData);
    console.log("Submitting:", Object.fromEntries(formData));
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
          <input hidden type="file" accept="image/*" onChange={handleImageUpload} />
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
        <Box component="form" onSubmit={(e) => handleAddSkill(e, "offered")} mt={2}>
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
        <Box component="form" onSubmit={(e) => handleAddSkill(e, "wanted")} mt={2}>
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
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Save Profile
        </Button>
      </Box>
    </Container>
  );
};

export default ProfilePage;