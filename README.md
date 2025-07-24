# crm-hotel-cancun

## 🚀 Getting Started

To run this project locally, follow these steps:

### 1. Start the Database with Docker Compose

Navigate to the `./infra` folder and run:


### 2. Run the Full Stack with Docker Compose (dev-preview)

To launch the entire project (database, backend, and frontend) for development in one step:

1. **Navigate to the `infra` folder:**
    ```sh
    cd infra
    ```

2. **Start all services:**
    ```sh
    docker-compose -f docker-compose.dev-preview.yml up
    ```

#### What happens when you run this command?

- **MySQL Database:**
  - The MySQL service starts first, using the configuration defined in the compose file.

- **Backend (Java Spring Boot):**
  - The backend service starts automatically after the database is ready.
  - It uses the existing Java Spring Boot project without any code changes.
  - The backend connects to the MySQL service using the Docker network.

- **Frontend (Next.js):**
  - The frontend service starts after the backend.
  - Before launching, it copies `.env.template` to `.env` in the frontend directory.
  - It then runs `npm install` to install dependencies.
  - Finally, it starts the development server with `npm run dev`.

All services run in the same Docker network, so they can communicate with each other using their service names (e.g., `mysql`, `backend`, `frontend`).


# SQL Queries: User Roles and Mappings

This document contains SQL queries related to user roles and their associations with users.

---

## 🔹 1. Roles with Associated Users

Returns a list of roles along with a comma-separated list of users assigned to each role.


ROLES WITH USERS
```sql
SELECT 
    r.id AS role_id, 
    r.name AS role_name,
    GROUP_CONCAT(u.username ORDER BY u.username SEPARATOR ', ') AS users
FROM user_roles r
JOIN user_roles_map urm ON r.id = urm.role_id
JOIN users u ON urm.user_id = u.id
GROUP BY r.id, r.name
ORDER BY r.name;
```

USERS WITH ROLES
```sql
SELECT 
    r.id AS role_id, 
    r.name AS role_name, 
    u.id AS user_id, 
    u.username, 
    u.email
FROM user_roles r
JOIN user_roles_map urm ON r.id = urm.role_id
JOIN users u ON urm.user_id = u.id
ORDER BY r.name, u.username;
```
