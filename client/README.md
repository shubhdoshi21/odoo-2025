# SkillSwap Frontend

A modern React application for the SkillSwap platform, built with Material-UI and Redux Toolkit.

## Features

- **Modern UI/UX**: Built with Material-UI for a beautiful, responsive design
- **State Management**: Redux Toolkit for efficient state management
- **Authentication**: Complete user authentication flow
- **User Discovery**: Search and filter users by skills, location, and ratings
- **Dashboard**: Personal dashboard with stats and recent activity
- **Responsive Design**: Mobile-first approach with responsive components
- **Real-time Updates**: Toast notifications and real-time state updates

## Technology Stack

- **React 18**: Latest React with hooks and modern patterns
- **Material-UI (MUI)**: Component library for consistent design
- **Redux Toolkit**: State management with RTK Query
- **React Router**: Client-side routing
- **Axios**: HTTP client for API communication
- **React Toastify**: Toast notifications

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Common components (LoadingSpinner, etc.)
│   └── layout/         # Layout components (Header, Footer)
├── pages/              # Page components
├── services/           # API service functions
├── store/              # Redux store configuration
│   └── slices/         # Redux slices for different features
└── utils/              # Utility functions
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running (see server README)

### Installation

1. Navigate to the client directory:

   ```bash
   cd client
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create environment variables (optional):

   ```bash
   cp .env.example .env
   ```

   Configure the following variables:

   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`.

## Available Scripts

- `npm start`: Start development server
- `npm build`: Build for production
- `npm test`: Run tests
- `npm eject`: Eject from Create React App

## Key Features

### Authentication

- User registration and login
- JWT token management
- Protected routes
- Password reset functionality

### User Management

- User profiles with skills and ratings
- Search and filter users
- User discovery by skills and location

### Dashboard

- Personal statistics
- Recent activity
- Quick actions
- Profile overview

### Responsive Design

- Mobile-first approach
- Responsive grid layouts
- Touch-friendly interactions

## Component Architecture

### Layout Components

- **Header**: Navigation, search, user menu
- **Footer**: Links and copyright information
- **LoadingSpinner**: Reusable loading component

### Page Components

- **HomePage**: Landing page with hero section and features
- **LoginPage**: User authentication
- **RegisterPage**: User registration
- **DashboardPage**: User dashboard
- **UsersPage**: User discovery and search
- **ProfilePage**: User profile management

### Redux Store Structure

```javascript
{
  auth: {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
  },
  users: {
    users: [],
    currentUser: null,
    topRatedUsers: [],
    pagination: {},
    isLoading: false,
    error: null
  },
  skills: {
    skills: [],
    currentSkill: null,
    popularSkills: [],
    pagination: {},
    isLoading: false,
    error: null
  },
  swaps: {
    swaps: [],
    pendingSwaps: [],
    currentSwap: null,
    pagination: {},
    isLoading: false,
    error: null
  },
  feedback: {
    feedback: [],
    currentFeedback: null,
    pagination: {},
    isLoading: false,
    error: null
  },
  ui: {
    modals: {},
    sidebar: false,
    notifications: [],
    search: {},
    pagination: {}
  }
}
```

## API Integration

The frontend communicates with the backend through RESTful APIs:

- **Authentication**: `/api/auth/*`
- **Users**: `/api/users/*`
- **Skills**: `/api/skills/*`
- **Swaps**: `/api/swaps/*`
- **Feedback**: `/api/feedback/*`

## Styling

The application uses Material-UI's theming system with:

- Custom color palette
- Typography scale
- Responsive breakpoints
- Component styling overrides

## State Management

Redux Toolkit is used for state management with:

- **Slices**: Feature-based state organization
- **Async Thunks**: API calls and async operations
- **Selectors**: Efficient state access
- **Middleware**: Custom middleware for side effects

## Error Handling

- Global error handling with toast notifications
- Form validation with error messages
- API error responses
- Network error handling

## Performance Optimizations

- React.memo for component memoization
- Lazy loading for routes
- Optimized re-renders
- Efficient state updates

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please refer to the main project README or create an issue in the repository.
