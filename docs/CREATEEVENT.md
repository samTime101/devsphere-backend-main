# CREATE EVENT(POST)

```
/api/event/create
```

## VALID REQUEST

```json
{
  "title": "ABCD",
  "description": "ALPHABET",
  "status": "UPCOMING",
  "EventSchedule": [
    {
      "startDate": "2025-09-15 1:10",
      "endDate": "2025-09-15 4:10",
      "description": "TODAY IS FIRST DAY"
    },
    {
      "startDate": "2025-09-16 1:10",
      "endDate": "2025-09-16 4:10",
      "description": "TODAY IS SECOND DAY"
    }
  ]
}
```

## RESPONSE(201)

```json
{
	"success": true,
	"message": "EVENT CREATED SUCCESSFULLY",
	"data": {
		"title": "ABCD",
		"description": "ALPHABET",
		"status": "UPCOMING",
		"EventSchedule": [
			{
				"startDate": "2025-09-15 1:10",
				"endDate": "2025-09-15 4:10",
				"description": "TODAY IS FIRST DAY"
			},
			{
				"startDate": "2025-09-16 1:10",
				"endDate": "2025-09-16 4:10",
				"description": "TODAY IS SECOND DAY"
			}
		]
	},
	"code": 201
}
```

## INVALID REQUEST 

```json
{
  "title": "",
  "description": "ALPHABET",
  "status": "UPCOMING",
  "EventSchedule": [

  ]
}
```

## RESPONSE (400)

```json
{
	"success": false,
	"error": "INVALID EVENT DATA GIVEN",
	"details": null,
	"code": 400
}
```