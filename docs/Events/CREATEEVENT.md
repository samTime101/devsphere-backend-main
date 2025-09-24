# CREATE EVENT(POST)

```
/api/event/create
```

## VALID REQUEST

```json
{
  "name": "ABCD",
  "description": "ALPHABET",
  "status": "UPCOMING",
  "eventSchedule": [
    {
      "startDate": "2025-09-15T10:00:00.000Z",
      "endDate": "2025-09-15T12:00:00.000Z",
      "description": "TODAY IS FIRST DAY"
    },
    {
      "startDate": "2025-09-16T12:00:00.000Z",
      "endDate": "2025-09-16T14:00:00.000Z",
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
		"name": "ABCD",
		"description": "ALPHABET",
		"status": "UPCOMING",
		"eventSchedule": [
			{
				"startDate": "2025-09-15T10:00:00.000Z",
				"endDate": "2025-09-15T12:00:00.000Z",
				"description": "TODAY IS FIRST DAY"
			},
			{
				"startDate": "2025-09-16T12:00:00.000Z",
				"endDate": "2025-09-16T14:00:00.000Z",
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
  "name": "",
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