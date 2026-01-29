# Admin Module

This module provides administrative functionality for the Election Commission system, similar to the ERO module but with admin-specific features.

## Features

### 1. Admin Authentication
- JWT-based authentication
- Role-based access control (ROLE_ADMIN only)
- Secure login with email and password
- Profile dropdown with user information

### 2. User Management
- Create new users (Admin, ERO, BLO roles)
- View all users with pagination and filtering
- Toggle user active/inactive status
- Assign roles to existing users
- Filter by role and status

### 3. Constituency Management
- Create new assembly constituencies
- Update existing constituencies
- Toggle constituency status
- Link constituencies to districts
- View available districts

### 4. Polling Station Management
- Create new polling stations
- Update station details
- Assign stations to constituencies
- Check station assignments
- Location management (latitude/longitude)

### 5. Document Type Management
- Create document types for validation
- Configure file size limits
- Set allowed file formats
- Define validation rules
- Template-based creation

## File Structure

```
src/admin/
├── components/
│   ├── AdminLogin.jsx                    # Login form
│   ├── AdminLayout.jsx                   # Main layout with sidebar and profile dropdown
│   ├── AdminDashboard.jsx                # Dashboard with statistics
│   ├── AdminUserManagement.jsx           # User CRUD operations
│   ├── AdminConstituencyManagement.jsx   # Constituency management
│   ├── AdminPollingStationManagement.jsx # Polling station management
│   ├── AdminDocumentTypeManagement.jsx   # Document type configuration
│   └── AdminProtectedRoute.jsx           # Route protection
├── pages/
│   ├── AdminLoginPage.jsx
│   ├── AdminDashboardPage.jsx
│   ├── AdminUserManagementPage.jsx
│   ├── AdminConstituencyManagementPage.jsx
│   ├── AdminPollingStationManagementPage.jsx
│   └── AdminDocumentTypeManagementPage.jsx
├── services/
│   └── adminApis.js                      # API calls to backend
├── hooks/
│   └── useAdminAuth.js                   # Authentication hook
└── index.js                              # Module exports
```

## API Integration

The admin module integrates with the following backend endpoints:

### Authentication
- `POST /api/admin/login` - Admin login

### User Management
- `POST /api/admin/users` - Create user
- `GET /api/admin/users` - Get all users (with pagination/filtering)
- `PUT /api/admin/users/{userId}/toggle-status` - Toggle user status
- `PUT /api/admin/users/{userId}/assign-role` - Assign role

### Constituency Management
- `POST /api/admin/constituencies` - Create constituency
- `PUT /api/admin/constituencies/{id}` - Update constituency
- `PUT /api/admin/constituencies/{id}/toggle-status` - Toggle status

### Polling Station Management
- `POST /api/admin/polling-stations` - Create polling station
- `PUT /api/admin/polling-stations/{id}` - Update polling station
- `PUT /api/admin/polling-stations/{stationId}/assign-constituency/{constituencyId}` - Assign to constituency
- `GET /api/admin/polling-stations/{stationId}/assignment` - Check assignment

### Document Type Management
- `POST /api/admin/document-types` - Create document type

### Helper Endpoints
- `GET /api/admin/districts` - Get all districts

## JWT Token Management

The admin module uses separate JWT token storage:
- Token: `adminJwtToken` (localStorage)
- User Info: `adminUser` (localStorage)

## Profile Dropdown Features

The profile dropdown in the top-right corner shows:
- Admin username and role
- Login timestamp
- Profile settings option
- Logout functionality

## Usage

1. **Login**: Navigate to `/admin/login`
2. **Dashboard**: View system statistics at `/admin/dashboard`
3. **User Management**: Manage users at `/admin/users`
4. **Constituencies**: Manage constituencies at `/admin/constituencies`
5. **Polling Stations**: Manage stations at `/admin/polling-stations`
6. **Document Types**: Configure document types at `/admin/document-types`

## Security

- JWT token validation on all protected routes
- Role-based access control (ROLE_ADMIN required)
- Automatic logout on token expiration
- Secure API communication

## Styling

Uses Tailwind CSS classes consistent with the ERO module:
- Red color scheme for admin (vs blue for ERO)
- Responsive design
- Modal dialogs for forms
- Loading states and error handling