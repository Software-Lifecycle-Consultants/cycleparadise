#!/bin/bash
# Create first admin user for Cycle Paradise
# Run this on the production server: sudo bash scripts/create-admin.sh

set -e

echo "=== Create First Admin User ==="
echo ""

# Prompt for details
read -p "Email address: " EMAIL
read -p "First name: " FIRST_NAME
read -p "Last name: " LAST_NAME
read -s -p "Password: " PASSWORD
echo ""
read -s -p "Confirm password: " PASSWORD_CONFIRM
echo ""

# Validate passwords match
if [ "$PASSWORD" != "$PASSWORD_CONFIRM" ]; then
    echo "ERROR: Passwords do not match"
    exit 1
fi

# Generate password hash using the web container
echo "Generating password hash..."
PASSWORD_HASH=$(docker compose exec -T web node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('${PASSWORD}', 10).then(hash => console.log(hash));")

# Clean up the hash (remove any whitespace/newlines)
PASSWORD_HASH=$(echo "$PASSWORD_HASH" | tr -d '\n\r')

echo "Creating admin user in database..."

# Insert into database
docker compose exec -T db psql -U cycleparadise -d cycleparadise <<EOF
INSERT INTO "AdminUser" (
  id,
  email,
  "passwordHash",
  "firstName",
  "lastName",
  role,
  "isActive",
  "createdAt",
  "updatedAt"
) VALUES (
  gen_random_uuid(),
  '${EMAIL}',
  '${PASSWORD_HASH}',
  '${FIRST_NAME}',
  '${LAST_NAME}',
  'ADMIN',
  true,
  NOW(),
  NOW()
);
EOF

echo ""
echo "✅ Admin user created successfully!"
echo ""
echo "Login at: https://cycleparadise.bike/admin/login"
echo "Email: ${EMAIL}"
echo ""
echo "⚠️  Keep your password secure!"
