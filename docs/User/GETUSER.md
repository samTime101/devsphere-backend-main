# Get User by ID API

This endpoint allows administrators to retrieve detailed information about a specific user by their ID.

## Endpoint

**GET** `/api/users/{id}`

## Authorization

- This endpoint requires the user to be authenticated as an **Admin**.

## Path Parameters

| Parameter | Type   | Required | Description                     |
|-----------|--------|----------|---------------------------------|
| `id`      | string | Yes      | The UUID of the user to retrieve. |

### Example Request

```
GET /api/users/12345678-1234-1234-1234-123456789012
```

## Response

### Success Response

- **Status Code:** `200 OK`
- **Body:**

```json
{
  "success": true,
  "status": 200,
  "message": "User retrieved successfully",
  "data": {
    "id": "12345678-1234-1234-1234-123456789012",
    "email": "john.doe@example.com",
    "name": "John Doe",
    "role": "MODERATOR",
    "emailVerified": false,
    "createdAt": "2025-09-19T10:00:00.000Z",
    "updatedAt": "2025-09-19T10:00:00.000Z",
    "memberId": "98765432-4321-4321-4321-210987654321",
    "member": {
      "id": "98765432-4321-4321-4321-210987654321",
      "name": "John Doe",
      "role": "Developer",
      "year": "2025",
      "status": "ACTIVE"
    }
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
- The response includes associated member information if available
- Returns complete user profile information including role and membership details
