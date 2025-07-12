## Contributors
Megh Prajapati, Shubh Doshi, Riddhi Thakkar

# Skill Swap Platform

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) application that enables users to exchange skills with each other. Users can offer skills they have and request skills they want to learn, creating a community-driven learning platform.

## 🚀 Features

### User Features

- **User Registration & Authentication**: Secure JWT-based authentication
- **Profile Management**: Update profile, skills, availability, and privacy settings
- **Skill Discovery**: Browse and search for skills by category
- **User Discovery**: Find users offering or wanting specific skills
- **Skill Swaps**: Request, accept, reject, and manage skill exchanges
- **Rating System**: Rate and review completed swaps
- **Public/Private Profiles**: Control profile visibility

### Admin Features

- **User Management**: View, ban/unban users
- **Skill Management**: Create, update, and manage skills
- **Moderation**: Monitor and moderate platform activity
- **Analytics**: View platform statistics and insights
- **Admin Messages**: Send announcements to users

## 🏗️ Architecture

The application follows a clean architecture pattern with the following structure:

```
server/
├── index.js                 # Main server entry point
├── models/                  # MongoDB/Mongoose models
├── repositories/            # Data access layer
├── services/                # Business logic layer
├── controllers/             # Request/response handlers
├── routes/                  # API route definitions
├── middleware/              # Custom middleware
└── package.json

client/
├── src/
│   ├── components/          # React components
│   ├── pages/              # Page components
│   ├── services/           # API services
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   └── App.js              # Main App component
└── package.json
```

## 🗄️ Database Schema

### Collections

1. **users** - User profiles and authentication
2. **skills** - Available skills with categories
3. **swaps** - Skill exchange requests and status
4. **feedback** - User ratings and reviews
5. **admins** - Admin user accounts
6. **adminMessages** - Platform announcements
7. **moderationLogs** - Admin action tracking

### Key Relationships

- Users have many offered and wanted skills (references to skills collection)
- Swaps connect two users with their respective skills
- Feedback is linked to completed swaps and users
- Admin actions are logged with user/skill references

## 🛠️ Technology Stack

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **helmet** - Security middleware
- **cors** - Cross-origin resource sharing

### Frontend (To be implemented)

- **React.js** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Material-UI** - UI component library
- **Redux Toolkit** - State management

## 📦 Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd odoo-2025
   ```

2. **Install dependencies**

   ```bash
   cd server
   npm install
   ```

3. **Environment Configuration**

   ```bash
   cp env.example .env
   ```

   Update `.env` with your configuration:

   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/skill-swap-platform
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=7d
   ```

4. **Start the server**

   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

### Frontend Setup (To be implemented)

1. **Install dependencies**

   ```bash
   cd client
   npm install
   ```

2. **Start the development server**
   ```bash
   npm start
   ```

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/forgot-password` - Forgot password
- `POST /api/auth/reset-password` - Reset password
- `DELETE /api/auth/account` - Delete account

### Users

- `GET /api/users` - Get all users (public profiles)
- `GET /api/users/search` - Search users
- `GET /api/users/top-rated` - Get top rated users
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/skill/:skillId` - Get users by skill

### Skills

- `GET /api/skills` - Get all skills
- `GET /api/skills/search` - Search skills
- `GET /api/skills/popular` - Get popular skills
- `GET /api/skills/category/:category` - Get skills by category
- `GET /api/skills/:id` - Get skill by ID
- `POST /api/skills` - Create skill (admin)
- `PUT /api/skills/:id` - Update skill (admin)
- `DELETE /api/skills/:id` - Delete skill (admin)

### Swaps

- `GET /api/swaps` - Get user's swaps
- `GET /api/swaps/pending` - Get pending swaps
- `GET /api/swaps/:id` - Get swap by ID
- `POST /api/swaps` - Create new swap
- `PUT /api/swaps/:id` - Update swap
- `PATCH /api/swaps/:id/accept` - Accept swap
- `PATCH /api/swaps/:id/reject` - Reject swap
- `PATCH /api/swaps/:id/cancel` - Cancel swap
- `PATCH /api/swaps/:id/complete` - Complete swap
- `DELETE /api/swaps/:id` - Delete swap

### Feedback

- `GET /api/feedback` - Get user's feedback
- `GET /api/feedback/user/:userId` - Get feedback for user
- `GET /api/feedback/swap/:swapId` - Get feedback for swap
- `GET /api/feedback/:id` - Get feedback by ID
- `POST /api/feedback` - Create feedback
- `PUT /api/feedback/:id` - Update feedback
- `DELETE /api/feedback/:id` - Delete feedback

### Admin

- `POST /api/admin/login` - Admin login
- `GET /api/admin/profile` - Get admin profile
- `GET /api/admin/dashboard` - Get dashboard stats
- `GET /api/admin/users` - Get all users (admin view)
- `PATCH /api/admin/users/:id/ban` - Ban/unban user
- `GET /api/admin/swaps` - Get all swaps (admin view)
- `DELETE /api/admin/swaps/:id` - Delete swap
- `GET /api/admin/feedback` - Get all feedback (admin view)
- `DELETE /api/admin/feedback/:id` - Delete feedback
- `GET /api/admin/messages` - Get admin messages
- `POST /api/admin/messages` - Create admin message
- `GET /api/admin/logs` - Get moderation logs
- `POST /api/admin/logs` - Create moderation log
- `GET /api/admin/stats` - Get detailed statistics

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt for password security
- **Input Validation** - Comprehensive request validation
- **Rate Limiting** - API rate limiting to prevent abuse
- **CORS Protection** - Cross-origin resource sharing protection
- **Helmet Security** - Security headers middleware
- **Role-based Access Control** - Admin role hierarchy

## 📊 Database Indexes

The application includes optimized indexes for:

- User email and public status
- Skill name and category
- Swap status and user relationships
- Feedback user relationships
- Admin actions and timestamps

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 🚀 Deployment

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/skill-swap-platform
JWT_SECRET=your-production-jwt-secret
JWT_EXPIRE=7d
BASE_URL=https://your-domain.com
```

### Docker Deployment (Optional)

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@skillswapplatform.com or create an issue in the repository.

## 🔮 Roadmap

- [ ] Frontend React application
- [ ] Real-time notifications
- [ ] File upload for profile photos
- [ ] Email notifications
- [ ] Mobile app (React Native)
- [ ] Advanced search filters
- [ ] Skill verification system
- [ ] Payment integration for premium features
- [ ] Video call integration for remote skill sharing
- [ ] Community forums and discussions
