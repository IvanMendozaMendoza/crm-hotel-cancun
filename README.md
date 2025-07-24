# crm-hotel-cancun

# SQL Queries: User Roles and Mappings

This document contains SQL queries related to user roles and their associations with users.

---

## 🔹 1. Roles with Associated Users

Returns a list of roles along with a comma-separated list of users assigned to each role.

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
