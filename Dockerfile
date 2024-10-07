# Use the official Node.js image
FROM node:20.12.2 AS build

# Set the working directory inside the container
WORKDIR /src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Expose the port your app runs on
EXPOSE 5000

# Command to run your app
CMD ["npm", "start"]
