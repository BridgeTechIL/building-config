# Use the official Node.js image as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock) to the working directory
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the application code to the working directory
COPY . .

# Build the React application
RUN npm run build

# Install `serve` globally
RUN npm install -g serve

# Expose the port using environment variable
ENV PORT 8080
EXPOSE 8080

# Command to serve the app using the PORT environment variable
CMD serve -s build -l ${PORT}