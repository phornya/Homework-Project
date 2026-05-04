# Project Architecture Refactoring

## Overview
The project has been restructured to follow a clean, layered architecture pattern with clear separation of concerns:

```
Client → Route → Controller → Service → Model → Database
```

## Directory Structure

```
src/
├── config/
│   └── db.ts                 # Database connection pool configuration
├── controllers/
│   ├── BaseController.ts     # Parent class with common functionality
│   └── UserController.ts     # User-specific business request handling
├── services/
│   └── UserService.ts        # Business logic & validation layer
├── models/
│   └── User.ts              # Data access layer (ORM/Query builder)
└── routes/
    └── userRoutes.ts         # HTTP endpoint definitions
server.js                      # Application entry point
```

## Layer Responsibilities

### 1. **Routes** (`userRoutes.ts`)
- Define HTTP endpoints
- Map URLs to controller methods
- Handle routing configuration

### 2. **Controllers** (`BaseController.ts`, `UserController.ts`)
- Handle HTTP request/response
- Parse request parameters
- Return responses in consistent format
- **BaseController**: Common response handling methods
  - `sendSuccess()` - Send successful response
  - `sendError()` - Send error response
  - `handleAsyncError()` - Unified error handling

### 3. **Services** (`UserService.ts`)
- **Business Logic**: Core application logic
- **Validation**: Input validation and data sanitization
- **Error Handling**: Business-level exception handling
- **Orchestration**: Coordinate between controllers and models
- Does NOT handle HTTP concerns

### 4. **Models** (`User.ts`)
- Database operations only
- CRUD operations (Create, Read, Update, Delete)
- Query execution
- No business logic

### 5. **Database** (`config/db.ts`)
- Connection pool management
- Database configuration
- Connection lifecycle

## Key Benefits

### ✅ Separation of Concerns
Each layer has a single responsibility:
- Routes: URL mapping
- Controllers: HTTP handling
- Services: Business logic
- Models: Data access
- DB: Connection management

### ✅ Testability
Each layer can be tested independently:
- Mock the service in controller tests
- Mock the model in service tests
- Mock the database in model tests

### ✅ Reusability
Services can be used by multiple controllers or external systems

### ✅ Maintainability
- Easy to locate and modify code
- Clear dependency flow
- Reduced code coupling

### ✅ Scalability
- Easy to add new features
- Easy to refactor
- Patterns are consistent

## Service Layer Features

The `UserService` class includes:

### Validation
```typescript
- Email format validation
- Required field validation
- Error message aggregation
```

### Business Logic
```typescript
- User CRUD operations
- Data sanitization (trim, lowercase)
- Duplicate email checking
- User existence verification
```

### Error Handling
```typescript
- Meaningful error messages
- Proper status code mapping
- Exception wrapping
```

## Controller Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": { /* response data */ }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

## Example Flow

### Create User Request:
1. **Client** sends POST request with user data
2. **Route** matches `/api/users` and calls `UserController.createUser()`
3. **Controller** extracts `name` and `email` from request body
4. **Controller** calls `UserService.createUser()`
5. **Service** validates input (email format, required fields)
6. **Service** normalizes data (trim, lowercase)
7. **Service** calls `User.create()` to persist data
8. **Model** executes SQL INSERT query
9. **Database** stores data and returns new record
10. **Service** returns created user to controller
11. **Controller** calls `sendSuccess()` with 201 status
12. **Client** receives formatted response

## Next Steps (Optional Enhancements)

### Authentication/Authorization
- Add JWT/session handling in middleware
- Add role-based access control in controllers

### Logging
- Add logging in each layer for debugging
- Implement request/response logging middleware

### Error Handling Middleware
- Create custom error classes
- Implement global error handler

### Dependency Injection
- Use IoC container for service instantiation
- Reduce tight coupling

### Repository Pattern
- Abstract data access further
- Support multiple data sources

### DTOs (Data Transfer Objects)
- Define request/response shapes
- Add validation decorators

## File Changes Summary

| File | Change | Reason |
|------|--------|--------|
| `src/services/UserService.ts` | ✨ Created | Centralize business logic and validation |
| `src/controllers/BaseController.ts` | ✨ Created | Provide common response handling |
| `src/controllers/UserController.ts` | 🔄 Refactored | Use service, extend BaseController |
| `server.js` | ✨ Created | Root entry point (moved from src/app.ts) |
| `src/app.ts` | ⚠️ Deprecated | Logic moved to server.js |

## How to Use

### Run the Server
```bash
npm start
# or
node server.js
```

### Development
```bash
npm run dev
# or
npx ts-node server.js
```

### API Endpoints
```
GET    /api/users         - Get all users
GET    /api/users/:id     - Get user by ID
POST   /api/users         - Create new user
PUT    /api/users/:id     - Update user
DELETE /api/users/:id     - Delete user
```
