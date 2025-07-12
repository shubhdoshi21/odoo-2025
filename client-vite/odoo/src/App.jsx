import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Box, CssBaseline } from "@mui/material";
import { toast } from "react-toastify";

// Components
import Header from "./components/layout/Header.jsx";
import Footer from "./components/layout/Footer.jsx";
import LoadingSpinner from "./components/common/LoadingSpinner.jsx";

// Pages
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import UsersPage from "./pages/UsersPage.jsx";
import UserDetailPage from "./pages/UserDetailPage.jsx";
import SkillsPage from "./pages/SkillsPage.jsx";
import SkillDetailPage from "./pages/SkillDetailPage.jsx";
import SwapsPage from "./pages/SwapsPage.jsx";
import SwapDetailPage from "./pages/SwapDetailPage.jsx";
import CreateSwapPage from "./pages/CreateSwapPage.jsx";
import FeedbackPage from "./pages/FeedbackPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

// Redux actions
import { getProfile } from "./store/slices/authSlice";
import { getTopRatedUsers } from "./store/slices/userSlice";
import { getPopularSkills } from "./store/slices/skillSlice";
import { getPendingSwaps } from "./store/slices/swapSlice";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const { error: authError } = useSelector((state) => state.auth);
  const { error: userError } = useSelector((state) => state.users);
  const { error: skillError } = useSelector((state) => state.skills);
  const { error: swapError } = useSelector((state) => state.swaps);
  const { error: feedbackError } = useSelector((state) => state.feedback);

  // Load user profile on app start if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getProfile());
    }
  }, [dispatch, isAuthenticated]);

  // Load initial data for authenticated users
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getTopRatedUsers(5));
      dispatch(getPopularSkills(5));
      dispatch(getPendingSwaps());
    }
  }, [dispatch, isAuthenticated]);

  // Handle errors with toast notifications
  useEffect(() => {
    if (authError) {
      toast.error(authError);
    }
  }, [authError]);

  useEffect(() => {
    if (userError) {
      toast.error(userError);
    }
  }, [userError]);

  useEffect(() => {
    if (skillError) {
      toast.error(skillError);
    }
  }, [skillError]);

  useEffect(() => {
    if (swapError) {
      toast.error(swapError);
    }
  }, [swapError]);

  useEffect(() => {
    if (feedbackError) {
      toast.error(feedbackError);
    }
  }, [feedbackError]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <CssBaseline />
      <Header />

      <Box component="main" sx={{ flexGrow: 1 }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/users/:userId" element={<UserDetailPage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/skills/:skillId" element={<SkillDetailPage />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/swaps"
            element={
              <ProtectedRoute>
                <SwapsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/swaps/create"
            element={
              <ProtectedRoute>
                <CreateSwapPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/swaps/:swapId"
            element={
              <ProtectedRoute>
                <SwapDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/feedback"
            element={
              <ProtectedRoute>
                <FeedbackPage />
              </ProtectedRoute>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Box>

      <Footer />
    </Box>
  );
}

export default App;
