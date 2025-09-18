# User Login API

This endpoint allows users to authenticate and log into the system using email and password.

## Endpoint

**POST** `/api/auth/sign-in`

## Authorization

- This endpoint is **public** and does not require authentication.

## Request Body

The request body should be a JSON object with the following fields:

| Field      | Type   | Required | Description                     |
|------------|--------|----------|---------------------------------|
| `email`    | string | Yes      | The user's email address.       |
| `password` | string | Yes      | The user's password.            |

### Example Request

```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123"
}
```

## Response

### Success Response

- **Status Code:** `200 OK`
- **Body:**

```json
{
  "user": {
    "id": "12345678-1234-1234-1234-123456789012",
    "email": "john.doe@example.com",
    "name": "John Doe",
    "emailVerified": false,
    "createdAt": "2025-09-19T10:00:00.000Z",
    "updatedAt": "2025-09-19T10:00:00.000Z"
  },
  "session": {
    "id": "session_12345",
    "userId": "12345678-1234-1234-1234-123456789012",
    "expiresAt": "2025-10-19T10:00:00.000Z"
  }
}
```

### Error Responses

- **Status Code:** `400 Bad Request`
  - Missing credentials:
    ```json
    {
      "message": "Email and password are required",
      "code": "MISSING_CREDENTIALS"
    }
    ```
  - Invalid credentials:
    ```json
    {
      "message": "Invalid email or password",
      "code": "INVALID_CREDENTIALS"
    }
    ```

- **Status Code:** `500 Internal Server Error`
  - General server error:
    ```json
    {
      "message": "Internal server error",
      "code": "INTERNAL_ERROR"
    }
    ```

## Notes

- Successful login creates an active session and sets authentication cookies
- The session is valid until the expiration date
- Authentication cookies are automatically included in subsequent requests
- Failed login attempts may be rate-limited for security
