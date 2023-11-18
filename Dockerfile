# Use the official Node.js image as base
FROM node:14

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project to the working directory
COPY . .

# Expose the port on which your Nest.js app is running
EXPOSE 3000

# Command to run your Nest.js app
CMD ["npm", "run", "start:prod"]
