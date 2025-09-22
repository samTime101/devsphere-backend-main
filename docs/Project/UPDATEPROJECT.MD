# Update Project

# Endpoint

- **PATCH** `/projects/:id`

# Authorization

- This endpoint requires the user to be authenticated as a **Moderator** or **Admin**.

# Request Body

| Field          | Type       | Description                                  | Required |
| -------------- | ---------- | -------------------------------------------- | -------- |
| `name`         | `string`   | The name of the project.                     | No       |
| `githubLink`   | `string`   | The GitHub link of the project.              | No       |
| `demoLink`     | `string`   | The demo link of the project.                | No       |
| `thumbnailUrl` | `string`   | The thumbnail of the project.                | No       |
| `description`  | `string`   | A brief description of the project.          | No       |
| `techStacks`   | `string[]` | List of technologies used in the project.    | Yes      |
| `tagIds`       | `string[]` | List of tag IDs associated with the project. | No       |

# Example Request Body

```json
{
  "name": "Devsphere",
  "tagIds": ["2"],
  "techStacks": ["JavaScript", "React"]
}
```

# Example Response

```json
{
  "success": true,
  "message": "Project updated successfully",
  "code": 200,
  "data": {
    "id": "edbadd2d-f906-4143-8260-2ce2f12a53f7",
    "name": "Devsphere",
    "githubLink": "https://github.com/BIC-DevSphere/devsphere-backend",
    "demoLink": null,
    "tech_stack": ["JavaScript", "React"],
    "description": "hdhwidwidodooeufsoife",
    "thumbnailUrl": null,
    "createdAt": "2025-09-21T18:14:35.091Z",
    "updatedAt": "2025-09-21T18:16:11.461Z"
  }
}
```

# Note
- The PATCH request accepts the same fields as the POST request, but all fields are optional.
- To remove a tag from a project, send all tags except the one to be removed.
  E.g. If you have the following tags

  ```json
  ["tag1", "tag2", "tag3"]
  ```

  To remove `tag2`, send in `tagIds` field

  ```json
  ["tag1", "tag3"]
  ```
