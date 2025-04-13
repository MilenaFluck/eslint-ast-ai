# Use a Node.js image to build the backend
FROM node:20 as build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json for dependencies
COPY package*.json ./

# Install global dependencies, including the Nx CLI
RUN npm install -g nx

# Install dependencies, use --production flag for production environments to avoid dev dependencies
RUN npm install

# Copy the rest of the backend project
COPY . .

# Debugging: Verify that the paths and files are correctly copied
RUN nx build rule-creator-api --configuration=production
RUN echo "Current directory: $(pwd)" && ls -alh /app

# Debugging: List contents after copying files
RUN echo "Contents after copying project files:" && ls -alh /app

# Expose the backend port (e.g., 3333)
EXPOSE 3333

# Set environment variable for production (or set NODE_ENV directly when running the container)
ENV NODE_ENV=production

# Start the backend server
CMD ["npm", "run", "start"]
