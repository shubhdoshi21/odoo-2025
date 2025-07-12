import React, { useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  useTheme,
} from "@mui/material";
import {
  SwapHoriz,
  People,
  School,
  Star,
  TrendingUp,
  Security,
  Speed,
  Support,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getTopRatedUsers } from "../store/slices/userSlice";
import { getPopularSkills } from "../store/slices/skillSlice";
import LoadingSpinner from "../components/common/LoadingSpinner";
import UsersShowcase from "../components/home/UsersShowcase";


const HomePage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated } = useSelector((state) => state.auth);
  const { topRatedUsers, isLoading: usersLoading } = useSelector(
    (state) => state.users
  );
  const { popularSkills, isLoading: skillsLoading } = useSelector(
    (state) => state.skills
  );

  useEffect(() => {
    dispatch(getTopRatedUsers(6));
    dispatch(getPopularSkills(6));
  }, [dispatch]);

  const features = [
    {
      icon: <SwapHoriz fontSize="large" />,
      title: "Skill Exchange",
      description:
        "Trade your expertise for new skills. Learn from others while teaching what you know.",
    },
    {
      icon: <People fontSize="large" />,
      title: "Community",
      description:
        "Connect with like-minded individuals who share your passion for learning and growth.",
    },
    {
      icon: <School fontSize="large" />,
      title: "Learn & Teach",
      description:
        "Both beginners and experts can find value in our skill-sharing platform.",
    },
    {
      icon: <Star fontSize="large" />,
      title: "Quality Assurance",
      description:
        "Rate and review your learning experiences to maintain high standards.",
    },
    {
      icon: <Security fontSize="large" />,
      title: "Safe & Secure",
      description:
        "Your data and privacy are protected with industry-standard security measures.",
    },
    {
      icon: <Speed fontSize="large" />,
      title: "Fast & Easy",
      description:
        "Quick setup and intuitive interface make skill swapping effortless.",
    },
  ];

  if (usersLoading || skillsLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: "white",
          py: 8,
          textAlign: "center",
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 700 }}
          >
            Exchange Skills, Build Connections
          </Typography>
          <Typography variant="h5" paragraph sx={{ mb: 4, opacity: 0.9 }}>
            Connect with people who share your passion for learning. Trade your
            expertise for new skills and grow together.
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {!isAuthenticated ? (
              <>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  onClick={() => navigate("/register")}
                  sx={{ px: 4, py: 1.5 }}
                >
                  Get Started
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  size="large"
                  onClick={() => navigate("/users")}
                  sx={{ px: 4, py: 1.5 }}
                >
                  Browse Users
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                color="secondary"
                size="large"
                onClick={() => navigate("/dashboard")}
                sx={{ px: 4, py: 1.5 }}
              >
                Go to Dashboard
              </Button>
            )}
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
          Why Choose SkillSwap?
        </Typography>
        <Typography
          variant="h6"
          textAlign="center"
          color="text.secondary"
          paragraph
          sx={{ mb: 6 }}
        >
          Our platform makes skill sharing simple, safe, and rewarding
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  p: 3,
                  "&:hover": {
                    transform: "translateY(-4px)",
                    transition: "transform 0.3s ease-in-out",
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                <Box sx={{ color: "primary.main", mb: 2 }}>{feature.icon}</Box>
                <Typography variant="h6" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
{/* After Features Section */}
<UsersShowcase />
      {/* Popular Skills Section */}
      {/*<Box sx={{ bgcolor: "grey.50", py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            textAlign="center"
            gutterBottom
          >
            Popular Skills
          </Typography>
          <Typography
            variant="h6"
            textAlign="center"
            color="text.secondary"
            paragraph
            sx={{ mb: 6 }}
          >
            Discover the most sought-after skills in our community
          </Typography>

          <Grid container spacing={3}>
            {popularSkills.slice(0, 6).map((skill) => (
              <Grid item xs={12} sm={6} md={4} key={skill._id}>
                <Card sx={{ height: "100%" }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {skill.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      paragraph
                    >
                      {skill.description}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      <Chip
                        label={skill.category}
                        size="small"
                        color="primary"
                      />
                      <Chip
                        label={`${skill.userCount} users`}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              onClick={() => navigate("/skills")}
            >
              View All Skills
            </Button>
          </Box>
        </Container>
      </Box>*/}

      {/* Top Users Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
          Top Rated Users
        </Typography>
        <Typography
          variant="h6"
          textAlign="center"
          color="text.secondary"
          paragraph
          sx={{ mb: 6 }}
        >
          Meet some of our most trusted skill sharers
        </Typography>

        <Grid container spacing={3}>
          {topRatedUsers.slice(0, 6).map((user) => (
            <Grid item xs={12} sm={6} md={4} key={user._id}>
              <Card sx={{ height: "100%" }}>
                <CardContent sx={{ textAlign: "center" }}>
                  <Avatar
                    src={user.profilePicture}
                    alt={user.username}
                    sx={{ width: 80, height: 80, mx: "auto", mb: 2 }}
                  />
                  <Typography variant="h6" gutterBottom>
                    {user.username}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {user.bio || "Passionate skill sharer"}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      gap: 1,
                      mb: 2,
                    }}
                  >
                    <Star sx={{ color: "warning.main" }} />
                    <Typography variant="body2">
                      {user.rating?.toFixed(1) || "4.5"} (
                      {user.reviewCount || 0} reviews)
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => navigate(`/users/${user._id}`)}
                  >
                    View Profile
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            onClick={() => navigate("/users")}
          >
            Discover More Users
          </Button>
        </Box>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
          color: "white",
          py: 8,
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" component="h2" gutterBottom>
            Ready to Start Swapping Skills?
          </Typography>
          <Typography variant="h6" paragraph sx={{ mb: 4, opacity: 0.9 }}>
            Join thousands of learners and teachers in our growing community
          </Typography>
          {!isAuthenticated ? (
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate("/register")}
              sx={{ px: 4, py: 1.5 }}
            >
              Join SkillSwap Today
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate("/swaps/create")}
              sx={{ px: 4, py: 1.5 }}
            >
              Create Your First Swap
            </Button>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
