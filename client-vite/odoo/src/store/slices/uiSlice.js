import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Modal states
  isLoginModalOpen: false,
  isRegisterModalOpen: false,
  isProfileModalOpen: false,
  isSwapModalOpen: false,
  isFeedbackModalOpen: false,

  // Sidebar states
  isSidebarOpen: false,

  // Loading states
  isGlobalLoading: false,

  // Notification states
  notifications: [],

  // Search states
  searchQuery: "",
  searchFilters: {
    category: "",
    location: "",
    availability: [],
    rating: 0,
  },

  // Pagination states
  currentPage: 1,
  itemsPerPage: 10,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    // Modal actions
    openLoginModal: (state) => {
      state.isLoginModalOpen = true;
    },
    closeLoginModal: (state) => {
      state.isLoginModalOpen = false;
    },
    openRegisterModal: (state) => {
      state.isRegisterModalOpen = true;
    },
    closeRegisterModal: (state) => {
      state.isRegisterModalOpen = false;
    },
    openProfileModal: (state) => {
      state.isProfileModalOpen = true;
    },
    closeProfileModal: (state) => {
      state.isProfileModalOpen = false;
    },
    openSwapModal: (state) => {
      state.isSwapModalOpen = true;
    },
    closeSwapModal: (state) => {
      state.isSwapModalOpen = false;
    },
    openFeedbackModal: (state) => {
      state.isFeedbackModalOpen = true;
    },
    closeFeedbackModal: (state) => {
      state.isFeedbackModalOpen = false;
    },

    // Sidebar actions
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    openSidebar: (state) => {
      state.isSidebarOpen = true;
    },
    closeSidebar: (state) => {
      state.isSidebarOpen = false;
    },

    // Loading actions
    setGlobalLoading: (state, action) => {
      state.isGlobalLoading = action.payload;
    },

    // Notification actions
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        ...action.payload,
      });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },

    // Search actions
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSearchFilters: (state, action) => {
      state.searchFilters = { ...state.searchFilters, ...action.payload };
    },
    clearSearchFilters: (state) => {
      state.searchFilters = {
        category: "",
        location: "",
        availability: [],
        rating: 0,
      };
    },

    // Pagination actions
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setItemsPerPage: (state, action) => {
      state.itemsPerPage = action.payload;
    },

    // Reset all UI state
    resetUI: (state) => {
      return initialState;
    },
  },
});

export const {
  // Modal actions
  openLoginModal,
  closeLoginModal,
  openRegisterModal,
  closeRegisterModal,
  openProfileModal,
  closeProfileModal,
  openSwapModal,
  closeSwapModal,
  openFeedbackModal,
  closeFeedbackModal,

  // Sidebar actions
  toggleSidebar,
  openSidebar,
  closeSidebar,

  // Loading actions
  setGlobalLoading,

  // Notification actions
  addNotification,
  removeNotification,
  clearNotifications,

  // Search actions
  setSearchQuery,
  setSearchFilters,
  clearSearchFilters,

  // Pagination actions
  setCurrentPage,
  setItemsPerPage,

  // Reset action
  resetUI,
} = uiSlice.actions;

export default uiSlice.reducer;
