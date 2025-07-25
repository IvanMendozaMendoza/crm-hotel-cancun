-----

# CRM-Hotel API

-----

## Authentication

### Login

`POST /api/v1/auth/login`

**Body:**

```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

### Refresh Token

`POST /api/v1/auth/refresh`

**Body:**

```json
{
  "refreshToken": "YOUR_REFRESH_TOKEN"
}
```

-----

## Users

### Get My Profile

`GET /api/v1/users/me`

**Authorization:** Bearer Token

### Update My Password

`PATCH /api/v1/users/me/password`

**Authorization:** Bearer Token

**Body:**

```json
{
  "currentPassword": "admin123",
  "password": "new_password",
  "passwordConfirm": "new_password"
}
```

### Update My Profile

`PATCH /api/v1/users/me`

**Authorization:** Bearer Token

**Body:**

```json
{
  "username": "new_username"
}
```

-----

## Admin Actions

### Create User

`POST /api/v1/users`

**Authorization:** Bearer Token

**Body:**

```json
{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "newpassword",
  "roles": ["USER"]
}
```

### Get All Users

`GET /api/v1/users`

**Authorization:** Bearer Token