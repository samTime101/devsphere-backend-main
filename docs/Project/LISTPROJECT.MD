# List Projects

## Endpoint

**GET** `/projects`

## Authorization

- This endpoint is public and does not require authentication.

## Example Response

```json
{
  "success": true,
  "message": "Fetched Sucessfully",
  "code": 200,
  "data": {
    "success": true,
    "data": [
      {
        "id": "1",
        "name": "Devsphere",
        "githubLink": "https://github.com/BIC-DevSphere/devsphere-backend",
        "demoLink": null,
        "tech_stack": ["JavaScript", "React"],
        "tags": [
          {
            "id": "1",
            "name": "Web"
          }
        ],
        "contributors": [
          {
            "id": "1",
            "name": "Test",
            "avatarUrl": "https://avatars.githubusercontent.com/contributor-1",
            "githubUsername": "samTime101"
          }
        ],
        "description": "hdhwidwidodooeufsoife",
        "createdAt": "2025-09-21T18:14:35.091Z",
        "updatedAt": "2025-09-21T18:16:11.461Z"
      }
    ]
  }
}
```
