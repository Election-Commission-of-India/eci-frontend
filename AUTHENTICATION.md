# ECI Frontend Authentication System

## Overview
This authentication system provides secure login and signup functionality for the ECI (Election Commission of India) Voter Service Portal with role-based access control.

## Features

### Authentication
- **Login**: Users can login with email/mobile and password
- **Signup**: New users can register with required details
- **Logout**: Secure logout with session cleanup
- **Profile Management**: View user profile information

### Role-Based Access Control
- **USER**: Citizens who can access voter registration services
- **ERO**: Electoral Registration Officers (admin access)
- **BLO**: Booth Level Officers (admin access)  
- **ADMIN**: System administrators

### Protected Routes
- Voter registration services are restricted to USER role only
- ERO/BLO/ADMIN users can access the home page but cannot perform voter registration activities
- Appropriate error messages and redirects for unauthorized access

## API Integration

### Backend Endpoints
- `POST /users/api/login` - User authentication
- `POST /users/api/adduser` - User registration
- `GET /users/api/profile/{userId}` - Get user profile
- `PUT /users/api/updateprofile/{userId}` - Update user profile

### Data Models
- **LoginRequest**: `{ emailOrMobile, password }`
- **SignUpDto**: `{ userName, firstName, lastName, email, mobile, password, userRole }`
- **UserProfileResponse**: User profile information with role and verification status

## Components

### Pages
- `LoginPage.jsx` - User login form
- `SignupPage.jsx` - User registration form
- `UserProfilePage.jsx` - User profile display
- `UnauthorizedPage.jsx` - Access denied page

### Components
- `ProtectedRoute.jsx` - Route protection wrapper
- `VoterServiceWrapper.jsx` - Voter service access control
- `Header.jsx` - Updated with authentication status

### Context & Services
- `AuthContext.jsx` - Authentication state management
- `authApis.js` - API service functions

## Usage

### Basic Authentication
```jsx
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  if (!isAuthenticated()) {
    return <div>Please login</div>;
  }
  
  return <div>Welcome {user.firstName}</div>;
}
```

### Role-Based Access
```jsx
import { useAuth } from '../contexts/AuthContext';

function VoterService() {
  const { canAccessVoterServices } = useAuth();
  
  if (!canAccessVoterServices()) {
    return <div>Access denied</div>;
  }
  
  return <div>Voter registration form</div>;
}
```

### Protected Routes
```jsx
<Route 
  path="/voter-registration" 
  element={
    <VoterServiceWrapper serviceName="Voter Registration">
      <VoterRegistration />
    </VoterServiceWrapper>
  } 
/>
```

## Security Features
- JWT token storage in localStorage
- Automatic token validation
- Role-based route protection
- Secure logout with token cleanup
- Input validation and error handling

## Styling
- Follows existing ECI design patterns
- Tailwind CSS for consistent styling
- Responsive design for mobile and desktop
- Toast notifications for user feedback

## Error Handling
- Network error handling
- Validation error display
- Unauthorized access redirects
- User-friendly error messages