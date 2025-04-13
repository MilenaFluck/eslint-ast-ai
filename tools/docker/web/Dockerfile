# Build Stage
FROM node:16 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build --prod

# Serve Stage
FROM nginx:alpine
COPY --from=build /app/dist/apps/rule-creator-web /usr/share/nginx/html
COPY ./nginx_default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
