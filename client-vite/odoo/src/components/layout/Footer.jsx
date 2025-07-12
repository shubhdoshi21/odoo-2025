import React from "react";
import {
  Box,
  Container,
  Typography,
  Link,
  Grid,
  Divider,
  useTheme,
} from "@mui/material";
import {
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon,
  Email as EmailIcon,
} from "@mui/icons-material";

const Footer = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "background.paper",
        py: 6,
        mt: "auto",
        borderTop: 1,
        borderColor: "divider",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand Section */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="primary" gutterBottom>
              SkillSwap
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Connect with people who share your passion for learning and
              teaching. Exchange skills, build relationships, and grow together.
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Link href="#" color="inherit">
                <GitHubIcon />
              </Link>
              <Link href="#" color="inherit">
                <LinkedInIcon />
              </Link>
              <Link href="#" color="inherit">
                <TwitterIcon />
              </Link>
              <Link href="mailto:contact@skillswap.com" color="inherit">
                <EmailIcon />
              </Link>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link href="/users" color="text.secondary" underline="hover">
                Find Users
              </Link>
              <Link href="/skills" color="text.secondary" underline="hover">
                Browse Skills
              </Link>
              <Link href="/swaps" color="text.secondary" underline="hover">
                My Swaps
              </Link>
              <Link href="/feedback" color="text.secondary" underline="hover">
                Feedback
              </Link>
            </Box>
          </Grid>

          {/* Support */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Support
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link href="/help" color="text.secondary" underline="hover">
                Help Center
              </Link>
              <Link href="/faq" color="text.secondary" underline="hover">
                FAQ
              </Link>
              <Link href="/contact" color="text.secondary" underline="hover">
                Contact Us
              </Link>
              <Link href="/report" color="text.secondary" underline="hover">
                Report Issue
              </Link>
            </Box>
          </Grid>

          {/* Legal */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Legal
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link href="/privacy" color="text.secondary" underline="hover">
                Privacy Policy
              </Link>
              <Link href="/terms" color="text.secondary" underline="hover">
                Terms of Service
              </Link>
              <Link href="/cookies" color="text.secondary" underline="hover">
                Cookie Policy
              </Link>
              <Link href="/disclaimer" color="text.secondary" underline="hover">
                Disclaimer
              </Link>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Copyright */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {currentYear} SkillSwap. All rights reserved.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Made with ❤️ for the community
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
