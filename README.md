# Exercise Tracker



## How to use


- Create an user

```http
  POST /api/users
```

| Path Param    | Type       | Required                           |
| :---------- | :--------- | :---------------------------------- |
| `username` | `string` | **Yes** |

#### Response sample

    {
        username: "danielmunier",
        _id: "5fb58534342df1456ccb3b05"
    }


- Register a new exercise

```http
  POST /api/users/{_id}/exercises
```

| Path Param   | Type       | Required                                   |
| :---------- | :--------- | :------------------------------------------ |
| `_id`      | `string` | **Yes** |

| Body Param   | Type       | Required                                   |
| :---------- | :--------- | :------------------------------------------ |
| `description`      | `string` | **Yes**  |
| `duration`      | `number` | **Yes**     |
| `date`      | `string` | **No** |

#### Response sample

    {
            username: "danielmunier",
            description: "test",
            duration: 60,
            date: "Tue Feb 27 2024",
            _id: "2fb5853f7342314564cb3b05"
    }

- Getting exercise record

```http
GET /api/users/:_id/logs?[from][&to][&limit] 
```

| Path Param   | Type       | Required                           |
| :---------- | :--------- | :---------------------------------- |
| `username` | `string` | **Yes** |

| Query Param   | Type       | Required                                   |
| :---------- | :--------- | :------------------------------------------ |
| `from`      | `string` | **No**  |
| `to`      | `string` | **No**     |
| `limit`      | `string` | **No** |

### Response sample
```http
GET /api/users/2fb5853f7342314564cb3b05/logs?&from=2024-01-01&to=2024-01-31&limit=2
```
         {
            username: "danielmunier",
            count: 1,
            _id: "2fb5853f7342314564cb3b05",
            log: [{
                description: "test",
                duration: 60,
                date: "Thu Jan 25 2024",
            },
            {
                description: "test",
                duration: 35,
                date: "Sun Jan 28 2024",
            }]
            }
           


