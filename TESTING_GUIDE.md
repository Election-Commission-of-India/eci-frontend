# Quick Test Guide - ERO Module

## Backend Setup
1. Start your Spring Boot application on port 8080
2. Add CORS configuration to allow frontend requests
3. Ensure all ERO endpoints are working

## Frontend Setup
1. Authentication is DISABLED for testing
2. API base URL is set to `http://localhost:8080`
3. All API calls are logged in browser console

## Test URLs
- Login: http://localhost:5173/ero/login (any credentials work)
- Dashboard: http://localhost:5173/ero/dashboard
- Applications: http://localhost:5173/ero/applications
- Voters: http://localhost:5173/ero/voters
- BLO Assignment: http://localhost:5173/ero/blo-assignment
- Complaints: http://localhost:5173/ero/complaints

## API Endpoints Being Called
- Dashboard: GET /dashboard
- Applications: GET /applications/constituency/{id}
- Voters: GET /voters
- BLO Assignment: POST /api/ero/blo/assign-blo
- Complaints: GET /ero/complaints/complaints

## Debugging
- Check browser console for API request/response logs
- Check Network tab in DevTools
- Verify backend is running on localhost:8080

## Re-enable Authentication Later
1. Uncomment authentication code in EroLogin.jsx
2. Add EroProtectedRoute back to App.jsx
3. Implement proper token management