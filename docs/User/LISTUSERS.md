# Get All Users API

This endpoint allows administrators to retrieve a paginated list of all users in the system with optional filtering.

## Endpoint

**GET** `/api/users`

## Authorization

- This endpoint requires the user to be authenticated as an **Admin**.

## Query Parameters

| Parameter | Type   | Required | Description                                    |
|-----------|--------|----------|------------------------------------------------|
| `page`    | number | No       | Page number for pagination. Must be > 0. Defaults to 1. |
| `limit`   | number | No       | Number of users per page. Must be 1-100. Defaults to 10. |
| `role`    | string | No       | Filter by user role. Must be "ADMIN" or "MODERATOR". |
| `search`  | string | No       | Search term to filter users (searches in name/email). |

### Example Request

```
GET /api/users?page=1&limit=10&role=MODERATOR&search=john
```

## Response

### Success Response

- **Status Code:** `200 OK`
- **Body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Users retrieved successfully",
  "data": {
    "users": [
      {
        "id": "12345678-1234-1234-1234-123456789012",
        "email": "john.doe@example.com",
        "name": "John Doe",
        "role": "MODERATOR",
        "emailVerified": false,
        "createdAt": "2025-09-19T10:00:00.000Z",
        "updatedAt": "2025-09-19T10:00:00.000Z",
        "memberId": "98765432-4321-4321-4321-210987654321"
      },
      {
        "id": "87654321-4321-4321-4321-876543210987",
        "email": "jane.smith@example.com",
        "name": "Jane Smith",
        "role": "ADMIN",
        "emailVerified": true,
        "createdAt": "2025-09-18T15:30:00.000Z",
        "updatedAt": "2025-09-18T15:30:00.000Z",
        "memberId": "13579246-2468-2468-2468-135792468024"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 2,
      "totalPages": 1,
      "hasNext": false,
      "hasPrev": false
    }
  }
}
```

### Error Responses

- **Status Code:** `400 Bad Request`
  - Invalid query parameters:
    ```json
    {
      "success": false,
      "status": 400,
      "message": "Page must be greater than 0"
    }
    ```
    ```json
    {
      "success": false,
      "status": 400,
      "message": "Limit must be between 1 and 100"
    }
    ```
    ```json
    {
      "success": false,
      "status": 400,
      "message": "Invalid role. Must be ADMIN or MODERATOR"
    }
    ```

- **Status Code:** `401 Unauthorized`
  - Not authenticated:
    ```json
    {
      "success": false,
      "status": 401,
      "message": "Authentication required"
    }
    ```

- **Status Code:** `403 Forbidden`
  - Insufficient permissions:
    ```json
    {
      "success": false,
      "status": 403,
      "message": "Admin access required"
    }
    ```

- **Status Code:** `500 Internal Server Error`
  - General server error:
    ```json
    {
      "success": false,
      "status": 500,
      "message": "Internal server error"
    }
    ```

## Notes

- This endpoint is restricted to Admin users only
- Results are paginated to improve performance
- Search functionality searches across user names and email addresses
- Role filter allows filtering by specific user roles
- The response includes pagination metadata for easier navigation
