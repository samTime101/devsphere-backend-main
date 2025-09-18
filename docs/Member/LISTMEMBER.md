# Get Members API

This endpoint retrieves a paginated list of members from the system.

## Endpoint

**GET** `/members`

## Authorization

- This endpoint is **public** and does not require authentication.

## Query Parameters

| Parameter | Type   | Required | Description                                      |
|-----------|--------|----------|--------------------------------------------------|
| `page`    | number | No       | The page number to retrieve (default: 1).       |
| `limit`   | number | No       | The number of members per page (default: 10).   |

### Example Request

```http
GET /members?page=2&limit=5
```

## Response

### Success Response

- **Status Code:** `200 OK`
- **Body:**

```json
{
  "status": 200,
  "message": "Members fetched successfully",
  "data": [
    {
      "id": "12345",
      "name": "John Doe",
      "role": "Developer",
      "year": "2025",
      "status": "ACTIVE"
    },
    {
      "id": "67890",
      "name": "Jane Smith",
      "role": "Designer",
      "year": "2024",
      "status": "ACTIVE"
    }
  ],
  "pagination": {
    "total": 50,
    "page": 2,
    "limit": 5
  }
}
```

### Error Responses

- **Status Code:** `404 Not Found`
  - No members found:
    ```json
    {
      "status": 404,
      "message": "No member data found"
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

- The `page` and `limit` parameters are optional. If not provided, the default values are used.
- The response includes pagination details such as the total number of members, current page, and limit.