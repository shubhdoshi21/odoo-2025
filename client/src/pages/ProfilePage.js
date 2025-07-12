import React, { useState } from "react";
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
  IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material";

const ProfilePage = () => {
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [name, setName] = useState("John Doe");
  const [location, setLocation] = useState("Mumbai");
  const [isPublic, setIsPublic] = useState(true);
  const [availability, setAvailability] = useState([]);
  const [offeredSkills, setOfferedSkills] = useState(["Web Development"]);
  const [wantedSkills, setWantedSkills] = useState(["Photography"]);
  const [newOfferedSkill, setNewOfferedSkill] = useState("");
  const [newWantedSkill, setNewWantedSkill] = useState("");

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
    const skill = type === "offered" ? newOfferedSkill.trim() : newWantedSkill.trim();
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
    // Construct form data and send to backend
    console.log({
      profilePhoto,
      name,
      location,
      isPublic,
      availability,
      offeredSkills,
      wantedSkills,
    });
  };

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
