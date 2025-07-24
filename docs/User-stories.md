## User Stories for Hotel Management System

### Users Model

- **As an admin, I want to create new user accounts, so that I can onboard staff or other admins.**
  - Endpoint: `POST /api/v1/users`
  - Acceptance Criteria:
    - Only admins can access this endpoint.
    - The system should validate required fields (e.g., username, email, password, roles).
    - On success, a new user is created and returned.

- **As a user, I want to view my own profile information, so that I can see my account details.**
  - Endpoint: `GET /api/v1/users/me`
  - Acceptance Criteria:
    - The user must be authenticated.
    - The system returns the user's id, username, email, and roles.

### Auth Model

- **As a user, I want to log in with my email and password, so that I can access the system securely.**
  - Endpoint: `POST /api/v1/auth/login`
  - Acceptance Criteria:
    - The system validates the email and password.
    - On success, a JWT and refresh token are returned.

<!-- - **As a user, I want to refresh my authentication token, so that I can stay logged in without re-entering my credentials.**
  - Endpoint: `POST /api/v1/auth/refresh`
  - Acceptance Criteria:
    - The system accepts a valid refresh token.
    - On success, a new JWT and refresh token are returned.

--- -->
