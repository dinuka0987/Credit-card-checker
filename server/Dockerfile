# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy the rest of the server code into the container
COPY . .

# Expose port 5000 for the backend server
EXPOSE 5000

# Define the command to run your app
CMD ["npm", "start"]
