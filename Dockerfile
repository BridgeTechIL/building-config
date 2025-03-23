# Use the official Node.js image as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock) to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the React application
RUN npm run build

# Use a lightweight web server to serve the built files
# Install `serve` globally
RUN npm install -g serve

# Expose the port the app runs on
EXPOSE 8080

# Command to serve the app
CMD ["serve", "-s", "build", "-l", "8080"]