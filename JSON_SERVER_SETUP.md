# JSON Server Setup for Portfolio Management System

This document explains how to use JSON Server as a replacement for mock data in the Portfolio Management System.

## What is JSON Server?

JSON Server is a full fake REST API that creates a REST API from a JSON file. It's perfect for prototyping and development without setting up a real backend.

## Setup Instructions

### 1. Installation
JSON Server is already installed as a dev dependency:
```bash
npm install json-server --save-dev
```

### 2. Database File
The database is stored in `db.json` at the root of the project. This file contains all the mock data for:
- User Details
- User Login Details
- Security Details
- Order Details
- Account Details
- Audit User Login
- Audit Actions

### 3. Starting the Servers

#### Option 1: Start Both Servers Together (Recommended)
```bash
npm run dev:all
```
This will start both the React development server (port 5174) and JSON Server (port 3001).

#### Option 2: Start Servers Separately
```bash
# Terminal 1: Start React dev server
npm run dev

# Terminal 2: Start JSON Server
npm run json-server
```

### 4. API Endpoints

Once JSON Server is running, you can access the following REST API endpoints:

- **Users**: `http://localhost:3001/userDetails`
- **User Login**: `http://localhost:3001/userLoginDetails`
- **Securities**: `http://localhost:3001/securityDetails`
- **Orders**: `http://localhost:3001/orderDetails`
- **Accounts**: `http://localhost:3001/accountDetails`
- **Audit Login**: `http://localhost:3001/auditUserLogin`
- **Audit Actions**: `http://localhost:3001/auditActions`

### 5. API Features

JSON Server provides full CRUD operations:
- **GET**: `GET /userDetails` - Get all users
- **GET**: `GET /userDetails/1` - Get user by ID
- **POST**: `POST /userDetails` - Create new user
- **PUT**: `PUT /userDetails/1` - Update user
- **DELETE**: `DELETE /userDetails/1` - Delete user
- **Filtering**: `GET /orderDetails?createdBy=1` - Filter orders by user
- **Sorting**: `GET /orderDetails?_sort=orderDate&_order=desc` - Sort by date

### 6. Code Changes

The application has been updated to use the new `ApiService` instead of `MockDataService`:

#### Before (Mock Data):
```javascript
import { MockDataService } from '../services';

const data = MockDataService.getPortfolioSummary(userId);
```

#### After (JSON Server):
```javascript
import { ApiService } from '../services';

const data = await ApiService.getPortfolioSummary(userId);
```

### 7. Benefits of JSON Server

1. **Real REST API**: Simulates a real backend API
2. **Persistent Data**: Data persists between server restarts
3. **Full CRUD**: Supports all HTTP methods
4. **Filtering & Sorting**: Built-in query capabilities
5. **Real-time Updates**: Changes are reflected immediately
6. **Easy Testing**: Perfect for API testing and development

### 8. Development Workflow

1. Start both servers: `npm run dev:all`
2. Make changes to `db.json` to modify data
3. Changes are automatically reflected in the API
4. Use browser dev tools to inspect API calls
5. Test different scenarios by modifying the JSON data

### 9. Troubleshooting

#### Port Already in Use
If port 3001 is already in use, modify the script in `package.json`:
```json
"json-server": "json-server --watch db.json --port 3002"
```

#### CORS Issues
JSON Server handles CORS automatically, but if you encounter issues, you can add CORS headers:
```json
"json-server": "json-server --watch db.json --port 3001 --middlewares ./cors.js"
```

#### Data Not Loading
1. Check that JSON Server is running on port 3001
2. Verify the `db.json` file is valid JSON
3. Check browser console for API errors
4. Ensure the API endpoints match the service calls

### 10. Next Steps

This setup provides a solid foundation for:
- Frontend development with real API calls
- API testing and debugging
- Data persistence during development
- Easy transition to a real backend later

The `ApiService` class can be easily modified to point to a real backend API by changing the `API_BASE_URL` constant. 