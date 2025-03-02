# User API Documentation

## Register User
Register a new user in the system by creating a user account with provided information.

**Endpoint:** `POST /users/register`

### Request Body
```json
{
  "fullname": {
    "firstname": "string",
    "lastname": "string"
  },
  "email": "string",
  "password": "string"
}
```

### Validation Rules
- `email`: Must be a valid email format
- `fullname.firstname`: Minimum 3 characters
- `password`: Minimum 6 characters

### Example Request
```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "123456"
}
```

### Success Response
**Status Code:** 201 (Created)
```json
{
  "token": "JWT_TOKEN_STRING",
  "user": {
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com"
  }
}
```

### Error Responses

#### Validation Error
**Status Code:** 400 (Bad Request)
```json
{
  "errors": [
    {
      "msg": "Invalid Email",
      "param": "email"
    }
  ]
}
```

#### Missing Fields Error
**Status Code:** 400 (Bad Request)
```json
{
  "error": "All fields are required"
}
```

## Login User

Authenticate an existing user and receive an authentication token.

**Endpoint:** `POST /users/login`

### Request Body
```json
{
  "email": "string",
  "password": "string"
}
```

### Example Request
```json
{
  "email": "john.doe@example.com",
  "password": "123456"
}
```

### Success Response
**Status Code:** 200 (OK)
```json
{
  "token": "JWT_TOKEN_STRING",
  "user": {
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com"
  }
}
```

### Error Responses

#### Invalid Credentials
**Status Code:** 401 (Unauthorized)
```json
{
  "message": "Invalid Credentials"
}
```
#### Validation Error
**Status Code:** 400 (Bad Request)# User API Documentation




Get User Profile
Retrieve the profile information of the authenticated user.

Endpoint: GET /users/profile


Success Response
Status Code: 200 (OK)

{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com"
}

Error Responses
Unauthorized
Status Code: 401 (Unauthorized)

{
  "message": "Unauthorized"
}



ogout User
Logout the authenticated user and invalidate the authentication token.

Endpoint: GET /users/logout

Headers
Authorization: Bearer JWT_TOKEN_STRING
Success Response
Status Code: 200 (OK)

{
  "message": "Logged out successfully"
}

Error Responses
No Token Provided
Status Code: 400 (Bad Request)


{
  "message": "No token provided"
}


Server Error
Status Code: 500 (Internal Server Error)

{
  "message": "Something went wrong"
}