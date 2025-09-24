# Create User API (Admin)

This endpoint allows administrators to create new users in the system with specific roles and member associations.

## Endpoint

**POST** `/api/users`

## Authorization

- This endpoint requires the user to be authenticated as an **Admin**.

## Request Body

The request body should be a JSON object with the following fields:

| Field      | Type   | Required | Description                                    |
|------------|--------|----------|------------------------------------------------|
| `email`    | string | Yes      | The user's email address. Must be valid email format. |
| `password` | string | Yes      | The user's password. Must be at least 8 characters with uppercase, lowercase, and number. |
| `name`     | string | Yes      | The user's full name. Must be 2-100 characters. |
| `role`     | string | No       | The user's role. Must be "ADMIN" or "MODERATOR". Defaults to "MODERATOR". |
| `memberId` | string | Yes      | UUID of the member to associate with this user. |

### Example Request

```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123",
  "name": "John Doe",
  "role": "MODERATOR",
  "memberId": "98765432-4321-4321-4321-210987654321"
}
```

## Response

### Success Response

- **Status Code:** `201 Created`
- **Body:**

```json
{
  "success": true,
  "status": 201,
  "message": "User created successfully",
  "data": {
    "user": {
      "id": "12345678-1234-1234-1234-123456789012",
      "email": "john.doe@example.com"
    }
  }
}
```

### Error Responses

- **Status Code:** `400 Bad Request`
  - Missing required fields:
    ```json
    {
      "success": false,
      "status": 400,
      "message": "Email and password are required"
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
  - Invalid member ID format:
    ```json
    {
      "success": false,
      "status": 400,
      "message": "Invalid member ID format"
    }
    ```
  - Validation errors:
    ```json
    {
      "success": false,
      "status": 400,
      "message": "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    }
    ```
  - User creation failed:
    ```json
    {
      "success": false,
      "status": 400,
      "message": "Failed to create user"
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
- The created user will be associated with the specified member ID
- Default role is "MODERATOR" if not specified
- Password must meet security requirements: minimum 8 characters, at least one uppercase letter, one lowercase letter, and one number
- Email must be unique in the system
