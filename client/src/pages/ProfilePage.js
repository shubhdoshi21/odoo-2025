import React from "react";
import { Container, Typography, Box } from "@mui/material";

const ProfilePage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Profile Page
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Profile management page coming soon...
      </Typography>
    </Container>
  );
};

export default ProfilePage;
