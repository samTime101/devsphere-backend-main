# GET EVENT(GET)

```
/api/event/id/<id>
```

## VALID GET (200)

```json
{
	"success": true,
	"message": "EVENT FETCHED SUCCESSFULLY",
	"data": {
		"name": "ABCD",
		"description": "ALPHABET",
		"status": "UPCOMING",
		"eventSchedule": [
			{
				"id": "fcbe5081-3f6e-4696-bb2b-19f7758a6425",
				"startDate": "2025-09-15T10:00:00.000Z",
				"endDate": "2025-09-15T12:00:00.000Z",
				"description": "TODAY IS FIRST DAY",
				"eventId": "4786f250-3fda-48a5-80ea-de84fdf9076f"
			},
			{
				"id": "aa11b7ed-a465-4098-897c-5ce847b71549",
				"startDate": "2025-09-16T12:00:00.000Z",
				"endDate": "2025-09-16T14:00:00.000Z",
				"description": "TODAY IS SECOND DAY",
				"eventId": "4786f250-3fda-48a5-80ea-de84fdf9076f"
			}
		]
	},
	"code": 200
}
```

## INVALID GET (404)

```json
{
	"success": false,
	"error": "EVENT NOT FOUND",
	"details": null,
	"code": 404
}
```