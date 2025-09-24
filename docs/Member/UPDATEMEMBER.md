# Update Member API

This endpoint allows updating the details of an existing member in the system.

## Endpoint

**PATCH** `/members/:id`

## Authorization

- This endpoint requires the user to be authenticated as a **Moderator**.

## Path Parameters

| Parameter | Type   | Required | Description                     |
|-----------|--------|----------|---------------------------------|
| `id`      | string | Yes      | The unique identifier of the member to update. |

## Request Body

The request body should be a JSON object with any of the following fields:

| Field   | Type   | Required | Description                     |
|---------|--------|----------|---------------------------------|
| `name`  | string | No       | The updated name of the member. |
| `role`  | string | No       | The updated role of the member. |
| `year`  | string | No       | The updated year associated with the member. Must be a valid date. |
| `status`| string | No       | The updated status of the member. Can be `ACTIVE` or `INACTIVE`. |

### Example Request

```json
{
  "name": "John Doe",
  "role": "Team Lead",
  "year": "2026",
  "status": "ACTIVE"
}
```

## Response

### Success Response

- **Status Code:** `200 OK`
- **Body:**

```json
{
  "success": true,
  "data": {
    "id": "12345",
    "name": "John Doe",
    "role": "Team Lead",
    "year": "2026",
    "status": "ACTIVE"
  }
}
```

### Error Responses

- **Status Code:** `400 Bad Request`
  - Invalid or missing fields:
    ```json
    {
      "status": 400,
      "message": "No valid fields provided for update"
    }
    ```

- **Status Code:** `404 Not Found`
  - Member not found:
    ```json
    {
      "status": 404,
      "message": "Member not found"
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

- Only the fields provided in the request body will be updated.
- If no valid fields are provided, the request will fail with a `400 Bad Request` error.