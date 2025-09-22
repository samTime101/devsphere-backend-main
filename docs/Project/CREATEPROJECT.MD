# Create Project

## Endpoint

**GET** `/projects`
**POST** `/projects`
**PATCH** `/projects/:id`
**DELETE** `/projects/:id`

## Authorization

- This endpoint requires the user to be authenticated as a **Moderator** or **Admin**.

## Request Body

| Field          | Type       | Description                                  | Required |
| -------------- | ---------- | -------------------------------------------- | -------- |
| `name`         | `string`   | The name of the project.                     | Yes      |
| `githubLink`   | `string`   | The GitHub link of the project.              | Yes      |
| `demoLink`     | `string`   | The demo link of the project.                | No       |
| `thumbnailUrl` | `string`   | The thumbnail of the project.                | No       |
| `description`  | `string`   | A brief description of the project.          | Yes      |
| `techStacks`   | `string[]` | List of technologies used in the project.    | Yes      |
| `tagIds`       | `string[]` | List of tag IDs associated with the project. | No       |

## Example Request

```json
{
  "name": "Routine Backend",
  "githubLink": "https://github.com/BIC-DevSphere/devsphere-backend",
  "demoLink": "N/A",
  "thumbnailUrl": "N/A",
  "description": "hdhwidwidodooeufsoife",
  "techStacks": ["JavaScript", "React"],
  "tagIds": ["defcb3cf-6199-4cfa-8957-d340869c8129"]
}
```

## Responses

### Success Response

```json
{
  "success": true,
  "message": "Project added successfully",
  "code": 200,
  "data": {
    "id": "edbadd2d-f906-4143-8260-2ce2f12a53f7",
    "name": "Routine Backend",
    "githubLink": "https://github.com/BIC-DevSphere/devsphere-backend",
    "demoLink": null,
    "tech_stack": ["JavaScript", "React"],
    "description": "hdhwidwidodooeufsoife",
    "thumbnailUrl": null,
    "createdAt": "2025-09-21T18:14:35.091Z",
    "updatedAt": "2025-09-21T18:14:35.091Z"
  }
}
```

### Error Responses

**Status Code:** `400 Bad Request`

- On invalid or missing fields:

```json
{
  "success": false,
  "error": "Invalid request body",
  "code": 400,
  "details": [
    {
      "field": "thumbnailUrl", // Example field
      "message": "Invalid thumbnail URL",
      "code": "invalid_format"
    }
  ]
}
```

- Validation errors:

```json
{
  "success": false,
  "error": "Invalid request body",
  "code": 400,
  "details": [
    {
      "field": "description",
      "message": "Description is required",
      "code": "invalid_type"
    }
  ]
}
```

- **Status Code:** `401 Unauthorized`

```json
{
  "success": false,
  "error": "Unauthorized",
  "code": 401
}
```
