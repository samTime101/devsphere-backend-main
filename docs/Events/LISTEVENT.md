# LIST EVENT(GET)

```
/api/event/list
```

## GET (200)

```json
{
	"success": true,
	"message": "EVENTS FETCHED SUCCESSFULLY",
	"data": [
		{
			"id": "4786f250-3fda-48a5-80ea-de84fdf9076f",
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
		{
			"id": "e5ae4620-b899-4486-83d9-a622074933f4",
			"name": "NEW EVENT",
			"description": "NEW EVENT",
			"status": "UPCOMING",
			"eventSchedule": [
				{
					"id": "95e60be8-4feb-47f1-b6fc-ae30ddc3f073",
					"startDate": "2025-09-15T10:00:00.000Z",
					"endDate": "2025-09-15T12:00:00.000Z",
					"description": "TODAY IS FIRST DAY",
					"eventId": "e5ae4620-b899-4486-83d9-a622074933f4"
				},
				{
					"id": "b11fd7e1-7aae-49fd-9638-98fad118e3f3",
					"startDate": "2025-09-16T12:00:00.000Z",
					"endDate": "2025-09-16T14:00:00.000Z",
					"description": "TODAY IS SECOND DAY",
					"eventId": "e5ae4620-b899-4486-83d9-a622074933f4"
				}
			]
		},
		{
			"id": "c4514d94-4b7a-4834-8e16-e3e42618244e",
			"name": "COMPLETED EVENT",
			"description": "NEW EVENT",
			"status": "COMPLETED",
			"eventSchedule": [
				{
					"id": "81c70f52-8386-4317-bd09-80247de1c289",
					"startDate": "2025-09-15T10:00:00.000Z",
					"endDate": "2025-09-15T12:00:00.000Z",
					"description": "TODAY IS FIRST DAY",
					"eventId": "c4514d94-4b7a-4834-8e16-e3e42618244e"
				},
				{
					"id": "2ebff3bc-80b7-4507-8c5c-fda1ce92ea2f",
					"startDate": "2025-09-16T12:00:00.000Z",
					"endDate": "2025-09-16T14:00:00.000Z",
					"description": "TODAY IS SECOND DAY",
					"eventId": "c4514d94-4b7a-4834-8e16-e3e42618244e"
				}
			]
		},
		{
			"id": "aeb58d3f-e5d1-4e3f-95d7-d447d858ffd4",
			"name": "COMPLETED TEST",
			"description": "NEW EVENT",
			"status": "COMPLETED",
			"eventSchedule": [
				{
					"id": "3d71c36a-119e-41d6-b3f8-bf354a27280b",
					"startDate": "2025-09-15T10:00:00.000Z",
					"endDate": "2025-09-15T12:00:00.000Z",
					"description": "TODAY IS FIRST DAY",
					"eventId": "aeb58d3f-e5d1-4e3f-95d7-d447d858ffd4"
				},
				{
					"id": "7f6f780f-1845-4b04-92a6-6c6974ca6820",
					"startDate": "2025-09-16T12:00:00.000Z",
					"endDate": "2025-09-16T14:00:00.000Z",
					"description": "TODAY IS SECOND DAY",
					"eventId": "aeb58d3f-e5d1-4e3f-95d7-d447d858ffd4"
				}
			]
		}
	],
	"code": 200
}
```
