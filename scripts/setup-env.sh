#!/bin/bash

# Food App Environment Setup Script
# This script helps set up the environment for development or production

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Function to print colored messages
print_message() {
  echo -e "${2}${1}${NC}"
}

# Function to check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Check for required tools
check_requirements() {
  print_message "Checking requirements..." "$YELLOW"
  
  if ! command_exists docker; then
    print_message "Error: Docker is not installed. Please install Docker first." "$RED"
    print_message "Visit https://docs.docker.com/get-docker/ for installation instructions." "$YELLOW"
    exit 1
  fi
  
  if ! command_exists docker-compose; then
    print_message "Error: Docker Compose is not installed. Please install Docker Compose first." "$RED"
    print_message "Visit https://docs.docker.com/compose/install/ for installation instructions." "$YELLOW"
    exit 1
  fi
  
  print_message "All requirements satisfied!" "$GREEN"
}

# Setup environment files
setup_env_files() {
  print_message "Setting up environment files..." "$YELLOW"
  
  # Backend .env
  if [ ! -f "backend/.env" ]; then
    if [ -f "backend/.env.example" ]; then
      cp backend/.env.example backend/.env
      print_message "Created backend/.env from example file" "$GREEN"
    else
      print_message "Warning: backend/.env.example not found. Please create backend/.env manually." "$YELLOW"
    fi
  else
    print_message "backend/.env already exists" "$GREEN"
  fi
  
  # Frontend .env
  if [ ! -f "frontend/.env" ]; then
    if [ -f "frontend/.env.example" ]; then
      cp frontend/.env.example frontend/.env
      print_message "Created frontend/.env from example file" "$GREEN"
    else
      print_message "Warning: frontend/.env.example not found. Please create frontend/.env manually." "$YELLOW"
    fi
  else
    print_message "frontend/.env already exists" "$GREEN"
  fi
  
  # Admin .env
  if [ ! -f "admin/.env" ]; then
    if [ -f "admin/.env.example" ]; then
      cp admin/.env.example admin/.env
      print_message "Created admin/.env from example file" "$GREEN"
    else
      print_message "Warning: admin/.env.example not found. Please create admin/.env manually." "$YELLOW"
    fi
  else
    print_message "admin/.env already exists" "$GREEN"
  fi
  
  # Root .env for production
  if [ "$1" = "production" ] && [ ! -f ".env" ]; then
    cat > .env << EOL
MONGODB_URL=mongodb://mongo:27017/food-app
JWT_SECRET=change_this_to_a_secure_random_string
SESSION_SECRET=change_this_to_another_secure_random_string
STRIPE_KEY=your_stripe_key_here
CORS_ORIGIN=https://example.com,https://www.example.com
API_URL=https://example.com/api
EOL
    print_message "Created root .env file for production" "$GREEN"
    print_message "⚠️  IMPORTANT: Edit the .env file with your production values!" "$YELLOW"
  fi
}

# Create nginx directory if needed
setup_nginx() {
  if [ "$1" = "production" ]; then
    print_message "Setting up Nginx for production..." "$YELLOW"
    
    # Create nginx/ssl directory if it doesn't exist
    if [ ! -d "nginx/ssl" ]; then
      mkdir -p nginx/ssl
      print_message "Created nginx/ssl directory" "$GREEN"
      print_message "⚠️  IMPORTANT: Place your SSL certificates (fullchain.pem and privkey.pem) in the nginx/ssl directory" "$YELLOW"
    fi
    
    # Remind to update domain in nginx.conf
    if [ -f "nginx/nginx.conf" ]; then
      print_message "⚠️  IMPORTANT: Update the domain name in nginx/nginx.conf to match your actual domain" "$YELLOW"
    fi
  fi
}

# Start the application
start_app() {
  if [ "$1" = "production" ]; then
    print_message "Starting the application in production mode..." "$YELLOW"
    docker-compose -f docker-compose.prod.yml up -d
    print_message "Application started in production mode!" "$GREEN"
    print_message "Frontend: https://your-domain.com" "$GREEN"
    print_message "Admin Panel: https://your-domain.com/admin" "$GREEN"
    print_message "API: https://your-domain.com/api" "$GREEN"
  else
    print_message "Starting the application in development mode..." "$YELLOW"
    docker-compose up -d
    print_message "Application started in development mode!" "$GREEN"
    print_message "Backend API: http://localhost:4000" "$GREEN"
    print_message "Frontend: http://localhost:5173" "$GREEN"
    print_message "Admin Panel: http://localhost:5174" "$GREEN"
    print_message "MongoDB: localhost:27017" "$GREEN"
  fi
}

# Main function
main() {
  # Check if environment argument is provided
  if [ "$1" != "development" ] && [ "$1" != "production" ]; then
    print_message "Usage: $0 [development|production]" "$YELLOW"
    print_message "Example: $0 development" "$YELLOW"
    exit 1
  fi
  
  print_message "Setting up Food App for $1 environment" "$GREEN"
  
  # Run the setup steps
  check_requirements
  setup_env_files "$1"
  setup_nginx "$1"
  
  # Ask if user wants to start the application
  read -p "Do you want to start the application now? (y/n): " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    start_app "$1"
  else
    if [ "$1" = "production" ]; then
      print_message "To start the application later, run: docker-compose -f docker-compose.prod.yml up -d" "$YELLOW"
    else
      print_message "To start the application later, run: docker-compose up -d" "$YELLOW"
    fi
  fi
  
  print_message "Setup complete!" "$GREEN"
}

# Run the main function with the provided argument
main "$1"