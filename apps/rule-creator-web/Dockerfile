# Step 1: Build the Angular app using Nx
FROM node:20 AS build

WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package.json package-lock.json ./

# Install global dependencies, including the Nx CLI
RUN npm install -g nx

# Install local dependencies in the workspace (including Nx and app dependencies)
RUN npm install

# Copy the entire workspace (including apps and libs) into the container
COPY . .

# Build the Angular app using Nx
RUN nx build rule-creator-web --prod --verbose

# Step 2: Serve the app using nginx
FROM nginx:alpine

# Copy the build artifacts from the build stage (the output path for Nx apps is typically in dist/apps/<app-name>)
COPY --from=build /app/dist/apps/rule-creator-web /usr/share/nginx/html

# Expose port 80 for the app
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
