#!/usr/bin/env bash
set -euo pipefail

# Install Docker (Ubuntu/Debian)
if ! command -v docker &>/dev/null; then
  echo "Installing Docker..."
  sudo apt update
  sudo apt install -y ca-certificates curl gnupg
  sudo install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
  echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
    $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
  sudo apt update
  sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
  sudo usermod -aG docker "$USER"
  echo "Docker installed. **Log out / log back in** for group change."
fi

# Sample compose with profiles
cat > docker-compose.yml <<'EOF'
services:
  app:
    image: node:20-alpine
    profiles: ["dev", "test", "prod"]
    working_dir: /app
    volumes:
      - .:/app
    environment:
      - NODE_ENV=development
    ports:
      - "3000:3000"
    command: npm run dev

# Add db, cache, etc. as needed
EOF

echo "Docker ready. Example usage:"
echo "  docker compose --profile dev up"
echo "  docker compose --profile test up"
echo "  docker compose --profile prod up -d"
