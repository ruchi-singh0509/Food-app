FROM node:18-bookworm-slim

WORKDIR /app

# Update OS packages to pull in security fixes and ensure essential certificates are present
RUN apt-get update && apt-get upgrade -y && apt-get install -y --no-install-recommends ca-certificates && rm -rf /var/lib/apt/lists/*

# Copy package.json and package-lock.json
COPY package*.json ./

# Install production dependencies only (safer and smaller image)
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 4000

# Command to run the application
CMD ["npm", "start"]