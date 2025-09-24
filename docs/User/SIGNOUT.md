# User Logout API

This endpoint allows users to log out of the system by terminating their current session.

## Endpoint

**POST** `/api/auth/sign-out`

## Authorization

- This endpoint requires the user to be **authenticated** (have an active session).

## Request Body

No request body is required for this endpoint.

### Example Request

```
POST /api/auth/sign-out
```

## Response

### Success Response

- **Status Code:** `200 OK`
- **Body:**

```json
{
  "success": true,
  "message": "Successfully logged out"
}
```

### Error Responses

- **Status Code:** `401 Unauthorized`
  - Not authenticated:
    ```json
    {
      "message": "No active session found",
      "code": "NO_SESSION"
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

- This endpoint terminates the current user session
- Authentication cookies are cleared upon successful logout
- The user will need to sign in again to access protected endpoints
- This endpoint is safe to call even if no active session exists
