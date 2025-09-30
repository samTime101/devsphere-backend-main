# Contributing to DevSphere Backend

Welcome to the DevSphere Backend project! This guide will help you understand our conventions, patterns, and best practices for contributing to this TypeScript/Express API.

## Table of Contents

- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Naming Conventions](#naming-conventions)
- [Service Layer Conventions](#service-layer-conventions)
- [Controller Layer Conventions](#controller-layer-conventions)
- [Route Definitions](#route-definitions)
- [Error Handling](#error-handling)
- [Database Operations](#database-operations)
- [Type Definitions](#type-definitions)
- [Validation & Parsing](#validation--parsing)
- [Authentication & Authorization](#authentication--authorization)
- [Code Style Guidelines](#code-style-guidelines)

## Project Structure

```
src/
├── controllers/          # Request handlers and business logic coordination
├── services/            # Business logic and database operations
├── routers/             # Route definitions and middleware
├── middleware/          # Custom middleware functions
├── lib/                 # Utility libraries (auth, jwt, password, etc.)
├── utils/               # Utility functions and constants
├── types/               # TypeScript type definitions
├── dtos/                # Data Transfer Objects for responses
├── jobs/                # Background jobs and cron tasks
├── db/                  # Database configuration
└── index.ts             # Application entry point

prisma/
├── schema/              # Prisma schema files
└── migrations/          # Database migration files

docs/                    # API documentation
```

## Naming Conventions

### File Naming

- Use **kebab-case** for file names: `event.controller.ts`, `member.service.ts`
- Use **camelCase** for directories: `controllers/`, `services/`

### Class Naming

- Use **PascalCase** for class names: `EventController`, `MemberService`
- Export instances using **camelCase**: `export const eventController = new EventController()`

### Function Naming

- Use **camelCase** for function names: `createEvent`, `getUserRole`
- Use descriptive verbs for CRUD operations:
  - `create` for POST operations
  - `get`/`fetch` for GET operations
  - `update` for PUT/PATCH operations
  - `remove`/`delete` for DELETE operations

### Variable Naming

- Use **camelCase** for variables: `eventData`, `userId`
- Use **SCREAMING_SNAKE_CASE** for constants: `HTTP.INTERNAL`, `DATABASE_URL`

## Service Layer Conventions

Services contain the core business logic and database operations. They follow a consistent return pattern.

### Service Return Pattern

**ALL services MUST return an object with the following structure:**

```typescript
// Success Response
{
  success: true,
  data?: T  // Optional data payload
}

// Error Response
{
  success: false,
  error: string,           // Error message
  message?: string         // Optional additional message
}
```

### Service Class Structure

```typescript
import prisma from '@/db/prisma';
import { prismaSafe } from '@/lib/prismaSafe';

class ExampleService {
  async createExample(data: ExampleType) {
    try {
      const [dbError, result] = await prismaSafe(
        prisma.example.create({
          data: {
            ...data,
          },
        })
      );

      if (dbError) {
        return { success: false, error: dbError };
      }

      if (!result) {
        return { success: false, error: 'Failed to create example' };
      }

      return { success: true, data: result };
    } catch (error) {
      console.log(`Failed to create example: ${error}`);
      return { success: false, error: 'Failed to create example' };
    }
  }
}

export const exampleService = new ExampleService();
```

### Service Method Naming

- `create{Resource}` - Create new resource
- `get{Resource}` or `fetch{Resource}` - Retrieve resource(s)
- `update{Resource}` - Update existing resource
- `remove{Resource}` or `delete{Resource}` - Delete resource

### Method Organization

- **Public methods at the top**
- **Private helpers at the bottom** (prefixed with `_`)

## Controller Layer Conventions

Controllers handle HTTP requests, validate input, call services, and return responses.

### Controller Structure

```typescript
import type { Request, Response } from 'express';
import { ErrorResponse, SuccessResponse } from '@/dtos';
import { HTTP } from '@/utils/constants';
import { exampleService } from '@/services/example.service';
import exampleParser from '@/parser/example/example.parser';

class ExampleController {
  async createExample(req: Request, res: Response) {
    try {
      // 1. Parse and validate input
      const parseResult = await exampleParser(req.body);
      if (!parseResult.success) {
        return res
          .status(HTTP.BAD_REQUEST)
          .json(ErrorResponse(HTTP.BAD_REQUEST, parseResult.error || 'Invalid data'));
      }

      // 2. Call service
      const serviceResult = await exampleService.createExample(parseResult.data);
      if (!serviceResult.success) {
        return res
          .status(HTTP.INTERNAL)
          .json(ErrorResponse(HTTP.INTERNAL, serviceResult.error || 'Failed to create'));
      }

      // 3. Return success response
      return res
        .status(HTTP.CREATED)
        .json(SuccessResponse(HTTP.CREATED, 'Created successfully', serviceResult.data));
    } catch (error) {
      return res.status(HTTP.INTERNAL).json(ErrorResponse(HTTP.INTERNAL, 'Internal Server Error'));
    }
  }
}

export const exampleController = new ExampleController();
```

### Controller Response Patterns

**Always use the standardized response helpers:**

```typescript
// Success Response
res.status(HTTP.CREATED).json(
    SuccessResponse(statusCode, message, data)
);

// Error Response
res.status(HTTP.BAD_REQUEST).json(
    ErrorResponse(statusCode, errorMessage, details?)
);
```

## Route Definitions

Routes should be organized by resource and follow RESTful conventions.

### Route File Structure

```typescript
const exampleRouter = Router();

// Public routes
exampleRouter.get('/', exampleController.getExamples);
exampleRouter.get('/:id', exampleController.getExample);

// Authenticated routes
exampleRouter.use(authMiddleware); // Apply to all routes below
exampleRouter.post('/', exampleController.createExample);
exampleRouter.put('/:id', exampleController.updateExample);

// Admin only routes
exampleRouter.delete('/:id', isAdmin, exampleController.deleteExample);

export default exampleRouter;
```

### RESTful Route Conventions

| HTTP Method | Route Pattern       | Purpose                | Controller Method |
| ----------- | ------------------- | ---------------------- | ----------------- |
| `GET`       | `/api/resource`     | Get all resources      | `getResources`    |
| `GET`       | `/api/resource/:id` | Get single resource    | `getResource`     |
| `POST`      | `/api/resource`     | Create new resource    | `createResource`  |
| `PUT`       | `/api/resource/:id` | Update entire resource | `updateResource`  |
| `PATCH`     | `/api/resource/:id` | Partial update         | `patchResource`   |
| `DELETE`    | `/api/resource/:id` | Delete resource        | `deleteResource`  |

### Route Registration in Main App

```typescript
// In src/index.ts
app.use('/api/examples', exampleRouter);
app.use('/api/events', eventRouter);
app.use('/api/members', memberRouter);
```

## Error Handling

### HTTP Status Codes

Use the constants from `@/utils/constants`:

### Database Error Handling

Always use `prismaSafe` for database operations:

```typescript
const [error, result] = await prismaSafe(prisma.model.operation());

if (error) {
  return { success: false, error };
}
```

## Database Operations

### Prisma Usage

1. **Always use `prismaSafe` wrapper** for database operations
2. **Check for errors first**, then check for null results
3. **Use meaningful error messages**

```typescript
const [error, user] = await prismaSafe(
  prisma.user.findUnique({
    where: { id: userId },
  })
);

if (error) {
  return { success: false, error };
}

if (!user) {
  return { success: false, error: 'User not found' };
}
```

### Schema Changes

After any Prisma schema changes:

1. Run `npx prisma migrate dev` to update the database
2. Run `npx prisma generate` to update the Prisma client

## Type Definitions

### Type File Organization

- Place shared types in `src/types/`
- Use descriptive names: `userTypes.ts`, `member.types.ts`
- Export interfaces and types clearly

```typescript
// src/types/example.types.ts
export interface Example {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateExampleRequest {
  name: string;
  description?: string;
}
```

### Zod Schemas

Place validation schemas in `src/utils/types/`:

```typescript
import { z } from 'zod';

export const exampleSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
  })
  .strict();

export type Example = z.infer<typeof exampleSchema>;
```

## Validation & Parsing

use Zod validation middleware

## Authentication & Authorization

### Middleware Usage

Apply authentication middleware appropriately:

```typescript
// For all routes in a router
router.use(authMiddleware);

// For specific routes
router.post('/admin-only', isAdmin, controller.method);

// For role-based access
router.get('/moderator', isModerator, controller.method);
```

### Session Access

In controllers, access user ID from request:

```typescript
async createExample(req: Request, res: Response) {
    const userId = req.userId; // Available after authMiddleware
    // ... rest of controller logic
}
```

## Code Style Guidelines

### Error Logging

Use consistent error logging:

```typescript
console.log(`Failed to ${operation}: ${error}`);
```

### Import Organization

1. External libraries first
2. Internal utilities and types
3. Local imports (controllers, services)

```typescript
import { z } from 'zod';
import type { Request, Response } from 'express';

import { HTTP } from '@/utils/constants';
import type { Example } from '@/types/example.types';

import { exampleService } from '@/services/example.service';
```

### Environment Variables

- Add all environment variables to `.env.example`
- Use TypeScript for environment validation
- Access via `process.env.VARIABLE_NAME`

## Pull Request Guidelines

1. **Write descriptive commit messages**
2. **Test your changes** thoroughly
3. **Update documentation** if needed
4. **Follow all conventions** outlined in this guide

### Commit Message Format

```
type: description

Examples:
feat: add user profile endpoint
fix: resolve authentication middleware issue
docs: update API documentation
refactor: improve error handling in user service
```

## Questions?

If you have questions about these conventions or need clarification on any patterns, please:

1. Check existing code for examples
2. Create an issue for discussion
3. Ask in team communication channels

Thank you for contributing to DevSphere Backend!
