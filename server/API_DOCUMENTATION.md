# Skill Swap Platform API Documentation

## Base URL

```
http://localhost:5000/api
```

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Response Format

All API responses follow this format:

```json
{
  "success": true/false,
  "message": "Response message",
  "data": {
    // Response data
  }
}
```

---

## Authentication Endpoints

### Register User

**POST** `/auth/register`

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "location": "New York, NY",
  "availability": ["Weekends", "Evenings"]
}
```

**Response:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "location": "New York, NY",
      "availability": ["Weekends", "Evenings"],
      "isPublic": true,
      "offeredSkills": [],
      "wantedSkills": [],
      "averageRating": 0,
      "totalRatings": 0,
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt_token_here"
  }
}
```

### Login User

**POST** `/auth/login`

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** Same as register response

### Get User Profile

**GET** `/auth/profile`

**Headers:** `Authorization: Bearer <token>`

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "location": "New York, NY",
      "profilePhoto": "photo.jpg",
      "profilePhotoUrl": "http://localhost:5000/uploads/photo.jpg",
      "availability": ["Weekends", "Evenings"],
      "isPublic": true,
      "offeredSkills": [],
      "wantedSkills": [],
      "averageRating": 4.5,
      "totalRatings": 10,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### Update User Profile

**PUT** `/auth/profile`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "name": "John Updated",
  "location": "Los Angeles, CA",
  "availability": ["Weekdays", "Mornings"],
  "isPublic": false
}
```

---

## User Endpoints

### Get All Users

**GET** `/users?page=1&limit=10&location=New York&availability=Weekends`

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 50)
- `location` (optional): Filter by location
- `availability` (optional): Filter by availability (array)
- `isPublic` (optional): Filter by public status

**Response:**

```json
{
  "success": true,
  "data": {
    "users": [
      {
        "_id": "user_id",
        "name": "John Doe",
        "location": "New York, NY",
        "profilePhoto": "photo.jpg",
        "profilePhotoUrl": "http://localhost:5000/uploads/photo.jpg",
        "availability": ["Weekends", "Evenings"],
        "offeredSkills": [
          {
            "_id": "skill_id",
            "name": "JavaScript",
            "category": "Technology"
          }
        ],
        "wantedSkills": [
          {
            "_id": "skill_id",
            "name": "Python",
            "category": "Technology"
          }
        ],
        "averageRating": 4.5,
        "totalRatings": 10,
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "pages": 5
    }
  }
}
```

### Search Users

**GET** `/users/search?q=john&page=1&limit=10`

**Query Parameters:**

- `q` (required): Search query
- `page` (optional): Page number
- `limit` (optional): Items per page

### Get Top Rated Users

**GET** `/users/top-rated?limit=10`

### Get User by ID

**GET** `/users/:id`

### Get Users by Skill

**GET** `/users/skill/:skillId?type=offered&page=1&limit=10`

**Query Parameters:**

- `type` (optional): "offered" or "wanted" (default: "offered")

---

## Skill Endpoints

### Get All Skills

**GET** `/skills?page=1&limit=10&category=Technology`

**Query Parameters:**

- `page` (optional): Page number
- `limit` (optional): Items per page
- `category` (optional): Filter by category

**Response:**

```json
{
  "success": true,
  "data": {
    "skills": [
      {
        "_id": "skill_id",
        "name": "JavaScript",
        "description": "Programming language for web development",
        "category": "Technology",
        "createdByAdmin": true,
        "isActive": true,
        "usageCount": 25,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "pages": 5
    }
  }
}
```

### Search Skills

**GET** `/skills/search?q=javascript&limit=10`

### Get Popular Skills

**GET** `/skills/popular?limit=10`

### Get Skills by Category

**GET** `/skills/category/Technology?page=1&limit=10`

### Get Skill by ID

**GET** `/skills/:id`

---

## Swap Endpoints

### Get User's Swaps

**GET** `/swaps?page=1&limit=10&status=pending`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**

- `page` (optional): Page number
- `limit` (optional): Items per page
- `status` (optional): Filter by status

**Response:**

```json
{
  "success": true,
  "data": {
    "swaps": [
      {
        "_id": "swap_id",
        "requester": {
          "_id": "user_id",
          "name": "John Doe",
          "email": "john@example.com",
          "profilePhoto": "photo.jpg"
        },
        "responder": {
          "_id": "user_id",
          "name": "Jane Smith",
          "email": "jane@example.com",
          "profilePhoto": "photo.jpg"
        },
        "offeredSkill": {
          "_id": "skill_id",
          "name": "JavaScript",
          "category": "Technology"
        },
        "requestedSkill": {
          "_id": "skill_id",
          "name": "Python",
          "category": "Technology"
        },
        "status": "pending",
        "message": "I'd love to learn Python!",
        "scheduledDate": null,
        "completedAt": null,
        "isRated": false,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 5,
      "pages": 1
    }
  }
}
```

### Get Pending Swaps

**GET** `/swaps/pending`

**Headers:** `Authorization: Bearer <token>`

### Get Swap by ID

**GET** `/swaps/:id`

**Headers:** `Authorization: Bearer <token>`

### Create New Swap

**POST** `/swaps`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "responder": "user_id",
  "offeredSkill": "skill_id",
  "requestedSkill": "skill_id",
  "message": "I'd love to learn this skill!",
  "scheduledDate": "2024-01-15T10:00:00.000Z"
}
```

### Accept Swap

**PATCH** `/swaps/:id/accept`

**Headers:** `Authorization: Bearer <token>`

### Reject Swap

**PATCH** `/swaps/:id/reject`

**Headers:** `Authorization: Bearer <token>`

### Cancel Swap

**PATCH** `/swaps/:id/cancel`

**Headers:** `Authorization: Bearer <token>`

### Complete Swap

**PATCH** `/swaps/:id/complete`

**Headers:** `Authorization: Bearer <token>`

---

## Feedback Endpoints

### Get User's Feedback

**GET** `/feedback?page=1&limit=10&rating=5`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**

- `page` (optional): Page number
- `limit` (optional): Items per page
- `rating` (optional): Filter by rating (1-5)

### Get Feedback for User

**GET** `/feedback/user/:userId`

### Get Feedback for Swap

**GET** `/feedback/swap/:swapId`

**Headers:** `Authorization: Bearer <token>`

### Create Feedback

**POST** `/feedback`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "swapId": "swap_id",
  "toUser": "user_id",
  "rating": 5,
  "comment": "Great experience learning from this user!"
}
```

---

## Admin Endpoints

### Admin Login

**POST** `/admin/login`

**Request Body:**

```json
{
  "email": "admin@skillswap.com",
  "password": "Admin123!"
}
```

### Get Admin Profile

**GET** `/admin/profile`

**Headers:** `Authorization: Bearer <admin-token>`

### Get Dashboard Stats

**GET** `/admin/dashboard`

**Headers:** `Authorization: Bearer <admin-token>`

**Response:**

```json
{
  "success": true,
  "data": {
    "totalUsers": 150,
    "activeUsers": 120,
    "bannedUsers": 5,
    "totalSwaps": 75,
    "pendingSwaps": 15,
    "completedSwaps": 45,
    "totalSkills": 50,
    "totalFeedback": 30,
    "avgRating": 4.2
  }
}
```

### Get All Users (Admin View)

**GET** `/admin/users?page=1&limit=10`

**Headers:** `Authorization: Bearer <admin-token>`

### Ban/Unban User

**PATCH** `/admin/users/:id/ban`

**Headers:** `Authorization: Bearer <admin-token>`

**Request Body:**

```json
{
  "isBanned": true
}
```

### Create Skill (Admin)

**POST** `/admin/skills`

**Headers:** `Authorization: Bearer <admin-token>`

**Request Body:**

```json
{
  "name": "New Skill",
  "description": "Skill description",
  "category": "Technology"
}
```

### Create Admin Message

**POST** `/admin/messages`

**Headers:** `Authorization: Bearer <admin-token>`

**Request Body:**

```json
{
  "title": "Platform Update",
  "message": "We've added new features!",
  "priority": "medium",
  "targetAudience": "all"
}
```

---

## Error Responses

### Validation Error (400)

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address",
      "value": "invalid-email"
    }
  ]
}
```

### Authentication Error (401)

```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### Authorization Error (403)

```json
{
  "success": false,
  "message": "Access denied"
}
```

### Not Found Error (404)

```json
{
  "success": false,
  "message": "User not found"
}
```

### Server Error (500)

```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

---

## Rate Limiting

The API implements rate limiting to prevent abuse:

- 100 requests per 15 minutes per IP address
- Rate limit headers are included in responses:
  - `X-RateLimit-Limit`: Request limit
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset time

---

## Pagination

Most list endpoints support pagination with these parameters:

- `page`: Page number (starts from 1)
- `limit`: Items per page (max 50)

Response includes pagination metadata:

```json
{
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

---

## File Uploads

Profile photos can be uploaded to `/uploads/` endpoint (to be implemented).

---

## WebSocket Support

Real-time notifications will be implemented using WebSocket connections (future feature).
