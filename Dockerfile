# Use official Node.js image for build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the application source code
COPY . .

# Build the Next.js application
RUN npm run build

# Production image
FROM node:18-alpine

WORKDIR /app

# Copy built assets from the builder stage
COPY --from=builder /app .

# Install only production dependencies
RUN npm ci --omit=dev

# Expose port for the Next.js server
EXPOSE 3000

# Set environment variables for production
ENV NODE_ENV=production

# Start the Next.js application
CMD ["npm", "start"]
