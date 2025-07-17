## Auth Endpoints

| Method | Endpoint                | Description                                                                 |
|--------|------------------------|-----------------------------------------------------------------------------|
| POST   | `/api/v1/auth/login`   | Authenticate with email and password.<br>Returns JWT and refresh token.      |
| POST   | `/api/v1/auth/refresh` | Accepts a refresh token.<br>Returns a new JWT and refresh token.             |

---

## User Endpoints

| Method | Endpoint                | Description                                                                 |
|--------|------------------------|-----------------------------------------------------------------------------|
| POST   | `/api/v1/users`        | (Admin only) Create a new user.<br>Requires admin JWT.                      |
| GET    | `/api/v1/users/me`     | Get the current authenticated user's info (id, username, email, roles).     |
