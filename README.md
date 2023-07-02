# Users API

JWT authenticated REST endpoint to create, retrieve, update and delete a `User` resource.

`Users` resource contains the following properties:
- `id`
- `name`
- `email`
- `password` 

## Configuration

All application configurations are set in `.env` file. Default port is set to `3000`.

Please see `.env.sample` as an example.

**Note**: `.env` is part of `git.ignore` to avoid accidental commit.

## Authentication

User should have the copy of `CLIENT_ID` and `CLIENT_SECRET` value pair.
To get the access token the following requests to `/auth` endpoint.

###### curl
<pre>
curl -X GET --location "http://localhost:3000/auth" \
    -H "Authorization: Basic CLIENT_ID:CLIENT_SECRET"
</pre>
###### response body
```json
{
    "access_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNsaWVudF9pZCIsInNlY3JldCI6ImNsaWVudF9zZWNyZXQiLCJpYXQiOjE2ODgyMjQwNzUsImV4cCI6MTY4ODMxMDQ3NX0.l-V7GqZXS237yebLaxQghh4XkqpYyQAjopeNZPZOzkA"
}
```
---

## REST Endpoints
**Note**: 
- All CRUD endpoints are JWT authenticated. Request first for an unexpired `access_token` before doing any requests.
- `password` is not returned as part of resource for security purposes.
### Create
---
###### curl
```
curl -X POST --location "http://localhost:3000/users" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer access_token" \
    -d "{
          \"name\": \"Assignment\",
          \"email\": \"assignment@email.com\",
          \"password\": \"password\"
        }"
```

###### response body
```json
{
    "id":"68b45a57-ba2b-4ddd-bfbb-a878c5b37bd0",
    "name": "Assignment",
    "email": "assignment@email.com"
}
```
---
### Retrieve
###### curl
```
curl -X GET --location "http://localhost:3000/users/68b45a57-ba2b-4ddd-bfbb-a878c5b37bd0" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer access_token"
```
###### response body
```json
{
    "id":"68b45a57-ba2b-4ddd-bfbb-a878c5b37bd0",
    "name": "Assignment",
    "email": "assignment@email.com"
}
```
---
### Update
**Note**: request body can also omit fields not needed for update.
###### curl
```
curl -X PATCH --location "http://localhost:3000/users/68b45a57-ba2b-4ddd-bfbb-a878c5b37bd0" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer access_token" \
    -d "{
          \"name\": \"Updated Asssignment\",
          \"email\": \"updated_assignment@email.com\",
          \"password\": \"updated_password\"
        }"
```
```json
{
    "id":"68b45a57-ba2b-4ddd-bfbb-a878c5b37bd0",
    "name": "Updated Assignment",
    "email": "updated_assignment@email.com"
}
```
---
### Delete
**Note**: `delete` returns an empty body.
###### curl
```
curl -X DELETE --location "http://localhost:3000/users/68b45a57-ba2b-4ddd-bfbb-a878c5b37bd0" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer access_token"
```
---
## Application
### Running the application

Development server:
```
start:dev
```

Production server:
```
start
```

### Testing the application

Unit testing:
```
test
test:watch
```

End-to-end testing:
```
test:e2e
```

Coverage testing:
```
test:cov
```