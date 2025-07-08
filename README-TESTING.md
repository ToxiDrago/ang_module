# 🧪 Testing Guide - Angular + NestJS Full-Stack Application

## 🚀 Quick Start

### 1. Start Backend

```bash
npm run build:backend
npm run start:backend
```

Backend will run on: http://localhost:3000

### 2. Start Frontend

```bash
npm start
```

Frontend will run on: http://localhost:4200

## 📋 Available Test Scripts

### Basic Backend Test

```bash
node test-backend-simple.js
```

Tests basic backend functionality and endpoints.

### Authentication Test

```bash
node test-backend-auth.js
```

Tests full authentication flow (register → login → protected endpoints).

### Integration Test

```bash
node test-frontend-backend.js
```

Tests communication between frontend and backend.

### Detailed Backend Test

```bash
node test-backend-detailed.js
```

Detailed backend testing with response analysis.

## 🔌 API Endpoints

### Authentication

- `POST /auth/register` - User registration
- `POST /auth/login` - User login

### Protected Endpoints (require JWT token)

- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

- `GET /tours` - Get all tours
- `GET /tours/:id` - Get tour by ID
- `POST /tours` - Create tour
- `POST /tours/generate` - Generate test tours
- `DELETE /tours/:id` - Delete tour

- `GET /orders` - Get all orders
- `GET /orders/:id` - Get order by ID
- `POST /orders` - Create order
- `DELETE /orders/:id` - Delete order

## 🧪 Manual Testing

### 1. Test Backend API

```bash
# Register a user
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"login":"testuser","password":"testpass123","email":"test@example.com"}'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"login":"testuser","password":"testpass123"}'

# Access protected endpoint (replace YOUR_TOKEN with actual JWT token)
curl -X GET http://localhost:3000/users \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 2. Test Frontend

1. Open http://localhost:4200 in your browser
2. Navigate to authentication pages
3. Test registration and login functionality
4. Verify that frontend can communicate with backend

## 🐳 Docker Testing

### Start with Docker Compose

```bash
docker-compose up -d
```

### Build Backend Docker Image

```bash
docker build -f Dockerfile.backend -t ang-module-backend .
```

## 📊 Test Results Interpretation

### ✅ Success Indicators

- Backend responds on port 3000
- Frontend responds on port 4200
- CORS is properly configured
- Authentication endpoints work
- Protected endpoints return 401 without token
- Protected endpoints return 200 with valid token

### ❌ Common Issues

- **Backend not starting**: Check MongoDB connection
- **Frontend not starting**: Check Angular dependencies
- **CORS errors**: Verify CORS configuration in backend
- **Authentication fails**: Check JWT configuration

## 🔧 Troubleshooting

### Backend Issues

1. Check if MongoDB is running
2. Verify all dependencies are installed
3. Check TypeScript compilation errors
4. Review backend logs for errors

### Frontend Issues

1. Check if all Angular dependencies are installed
2. Verify proxy configuration
3. Check browser console for errors
4. Ensure backend is running

### Integration Issues

1. Verify CORS configuration
2. Check API endpoint URLs
3. Ensure JWT tokens are properly handled
4. Test with Postman or curl first

## 🎯 Next Steps

After successful testing:

1. Implement frontend authentication UI
2. Connect frontend services to backend API
3. Add error handling and loading states
4. Implement user management features
5. Add tour and order management
6. Deploy to production environment

## 📝 Notes

- Backend uses NestJS with JWT authentication
- Frontend uses Angular with PrimeNG components
- MongoDB is used as the database
- CORS is configured for localhost:4200
- JWT tokens expire after 1 hour
