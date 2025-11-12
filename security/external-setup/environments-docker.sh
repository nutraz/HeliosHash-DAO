#!/bin/bash

echo "Setting up Docker development environment..."

# Install Docker if not already installed
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    rm get-docker.sh
    
    # Add user to docker group
    sudo usermod -aG docker $USER
    echo "Please log out and back in for group changes to take effect."
fi

# Install Docker Compose if not already installed
if ! command -v docker-compose &> /dev/null; then
    echo "Installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# Create basic docker-compose.yml for development
cat > docker-compose.yml << 'DOCKEREOF'
version: '3.8'

services:
  dev-database:
    image: postgres:15
    environment:
      POSTGRES_DB: devdb
      POSTGRES_USER: developer
      POSTGRES_PASSWORD: devpassword
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
DOCKEREOF

echo "Docker environment setup complete!"
echo "You can start services with: docker compose --profile dev up"
