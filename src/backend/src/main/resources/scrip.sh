#!/bin/bash

# 1. Login and get JWT
echo "--- Logging in as admin ---"
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}')

echo "Login response: $LOGIN_RESPONSE"

JWT=$(echo $LOGIN_RESPONSE | jq -r '.token')

echo "\n--- Extracted JWT ---"
echo "$JWT"

# 2. Use JWT to access a protected endpoint (e.g., get all users)
echo "\n--- Requesting all users with JWT ---"
USERS_RESPONSE=$(curl -s -v -X GET http://localhost:8080/api/v1/users \
  -H "Authorization: Bearer $JWT" 2>&1)
echo "All users response: $USERS_RESPONSE"