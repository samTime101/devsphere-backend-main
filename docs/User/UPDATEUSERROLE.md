# Update User Role API

This endpoint allows administrators to update the role of a specific user in the system.

## Endpoint

**PATCH** `/api/users/{id}/role`

## Authorization

- This endpoint requires the user to be authenticated as an **Admin**.

## Path Parameters

| Parameter | Type   | Required | Description                     |
|-----------|--------|----------|---------------------------------|
| `id`      | string | Yes      | The UUID of the user to update. |

## Request Body

The request body should be a JSON object with the following fields:

| Field  | Type   | Required | Description                                    |
|--------|--------|----------|------------------------------------------------|
| `role` | string | Yes      | The new role for the user. Must be "ADMIN" or "MODERATOR". |

### Example Request

```json
{
  "role": "ADMIN"
}
```

## Response

### Success Response

- **Status Code:** `200 OK`
- **Body:**

```json
{
  "success": true,
  "status": 200,
  "message": "User role updated successfully",
  "data": {
    "id": "12345678-1234-1234-1234-123456789012",
    "email": "john.doe@example.com",
    "name": "John Doe",
    "role": "ADMIN",
    "emailVerified": false,
    "createdAt": "2025-09-19T10:00:00.000Z",
    "updatedAt": "2025-09-19T10:15:00.000Z",
    "memberId": "98765432-4321-4321-4321-210987654321"
  }
}
```

### Error Responses

- **Status Code:** `400 Bad Request`
  - Invalid user ID format:
    ```json
    {
      "success": false,
      "status": 400,
      "message": "Invalid user ID format"
    }
    ```
  - Invalid role:
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

- **Status Code:** `404 Not Found`
  - User not found:
    ```json
    {
      "success": false,
      "status": 404,
      "message": "User not found"
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
- The user ID must be a valid UUID format
- Only "ADMIN" and "MODERATOR" roles are supported
- The `updatedAt` timestamp is automatically updated when the role changes
- Role changes take effect immediately
