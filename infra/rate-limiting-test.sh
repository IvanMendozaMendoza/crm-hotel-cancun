declare -A status_counts

for i in {1..500}; do
  status=$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTc1Mjc2OTQyNCwiZXhwIjoxNzUyNzcwMzI0fQ.3aAFUvxr4Z3yQFPqwQpT_8tzKKfzwOBWj7g677FlFJ0" http://localhost:8080/api/v1/users/me)
  ((status_counts[$status]++))
done

echo "Response code counts:"
for code in "${!status_counts[@]}"; do
  echo "$code = ${status_counts[$code]}"
done