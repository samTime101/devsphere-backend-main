# Create Member API

This endpoint allows the creation of a new member in the system.

## Endpoint

**POST** `/members`

## Authorization

- This endpoint requires the user to be authenticated as a **Moderator**.

## Request Body

The request body should be a JSON object with the following fields:

| Field   | Type   | Required | Description                     |
|---------|--------|----------|---------------------------------|
| `name`  | string | Yes      | The name of the member.         |
| `role`  | string | Yes      | The role of the member.         |
| `year`  | string | Yes      | The year associated with the member. Must be a valid date. |

### Example Request

```json
{
  "name": "John Doe",
  "role": "Developer",
  "year": "2025"
}
```

## Response

### Success Response

- **Status Code:** `201 Created`
- **Body:**

```json
{
  "status": 201,
  "message": "Member created successfully",
  "data": {
    "id": "12345",
    "name": "John Doe",
    "role": "Developer",
    "year": "2025",
    "status": "ACTIVE"
  }
}
```

### Error Responses

- **Status Code:** `400 Bad Request`
  - Missing required fields:
    ```json
    {
      "status": 400,
      "message": "Name, Role and Year are required"
    }
    ```
  - Validation errors:
    ```json
    {
      "status": 400,
      "message": "Validation error: [error details]"
    }
    ```

- **Status Code:** `500 Internal Server Error`
  - General server error:
    ```json
    {
      "status": 500,
      "message": "Internal Server Error"
    }
    ```

## Notes

- The `status` field is automatically set to `ACTIVE` upon creation.
- The `year` field is validated to ensure it is a valid date.