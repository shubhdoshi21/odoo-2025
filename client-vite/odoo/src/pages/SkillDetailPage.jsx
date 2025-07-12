import React, { useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Button,
  Grid,
  Alert,
  Divider,
  Breadcrumbs,
  Link,
} from "@mui/material";
import {
  ArrowBack,
  Star,
  Category,
  TrendingUp,
  Person,
  School,
} from "@mui/icons-material";
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSkillById } from "../store/slices/skillSlice";
import LoadingSpinner from "../components/common/LoadingSpinner";

const SkillDetailPage = () => {
  const { skillId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentSkill, isLoading, error } = useSelector(
    (state) => state.skills
  );

  useEffect(() => {
    if (skillId) {
      dispatch(getSkillById(skillId));
    }
  }, [dispatch, skillId]);

  const getCategoryColor = (category) => {
    const colors = {
      Technology: "primary",
      Creative: "secondary",
      Language: "success",
      Business: "warning",
      Health: "error",
      Education: "info",
      Other: "default",
    };
    return colors[category] || "default";
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate("/skills")}
        >
          Back to Skills
        </Button>
      </Container>
    );
  }

  if (!currentSkill) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Skill not found
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate("/skills")}
        >
          Back to Skills
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          component={RouterLink}
          to="/skills"
          color="inherit"
          underline="hover"
        >
          Skills
        </Link>
        <Typography color="text.primary">{currentSkill.name}</Typography>
      </Breadcrumbs>

      {/* Back Button */}
      <Button
        variant="outlined"
        startIcon={<ArrowBack />}
        onClick={() => navigate("/skills")}
        sx={{ mb: 3 }}
      >
        Back to Skills
      </Button>

      {/* Skill Header */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h3" gutterBottom>
                {currentSkill.name}
              </Typography>
              <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                <Chip
                  icon={<Category />}
                  label={currentSkill.category}
                  color={getCategoryColor(currentSkill.category)}
                  variant="outlined"
                />
                <Chip
                  icon={<Star />}
                  label={`${currentSkill.userCount || 0} users`}
                  variant="outlined"
                />
                {currentSkill.isActive === false && (
                  <Chip label="Inactive" color="error" size="small" />
                )}
              </Box>
              {currentSkill.description && (
                <Typography variant="body1" color="text.secondary" paragraph>
                  {currentSkill.description}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: "center" }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Person />}
                  onClick={() => navigate(`/users?skill=${currentSkill._id}`)}
                >
                  Find Users with this Skill
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<TrendingUp />}
                  onClick={() => navigate("/swaps/new")}
                >
                  Request Skill Swap
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Skill Details */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <School sx={{ mr: 1, verticalAlign: "middle" }} />
                Skill Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Category
                  </Typography>
                  <Chip
                    label={currentSkill.category}
                    color={getCategoryColor(currentSkill.category)}
                    size="small"
                  />
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Users with this Skill
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Star color="primary" fontSize="small" />
                    <Typography variant="body1">
                      {currentSkill.userCount || 0} users
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Status
                  </Typography>
                  <Chip
                    label={currentSkill.isActive ? "Active" : "Inactive"}
                    color={currentSkill.isActive ? "success" : "error"}
                    size="small"
                  />
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Created
                  </Typography>
                  <Typography variant="body1">
                    {new Date(currentSkill.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
                {currentSkill.description && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Description
                    </Typography>
                    <Typography variant="body1">
                      {currentSkill.description}
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <TrendingUp sx={{ mr: 1, verticalAlign: "middle" }} />
                Quick Actions
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<Person />}
                  onClick={() => navigate(`/users?skill=${currentSkill._id}`)}
                >
                  Find Users with this Skill
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<TrendingUp />}
                  onClick={() =>
                    navigate(`/users?skill=${currentSkill._id}&type=offered`)
                  }
                >
                  Find Users Offering this Skill
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<School />}
                  onClick={() =>
                    navigate(`/users?skill=${currentSkill._id}&type=wanted`)
                  }
                >
                  Find Users Wanting this Skill
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate("/skills")}
                >
                  Explore More Skills
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SkillDetailPage;
