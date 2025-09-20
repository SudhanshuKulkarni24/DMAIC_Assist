FROM node:18-alpine as base

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (use npm install for development)
RUN npm install

# Copy source code
COPY . .

# Development stage
FROM base as development
EXPOSE 3000
CMD ["npm", "run", "dev"]

# Build stage
FROM base as build
RUN npm run build

# Production stage
FROM nginx:alpine as production
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]