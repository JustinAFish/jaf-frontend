# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Accept build arguments for environment variables
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG CLERK_SECRET_KEY

# Set environment variables from build args
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV CLERK_SECRET_KEY=$CLERK_SECRET_KEY

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code (remove .env file copy since we use build args)
COPY . .

# Build application with Webpack (not Turbopack)
ENV NODE_ENV=production
ENV NEXT_TURBO=0
RUN npm run build

# Production stage
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TURBO=0

# Copy built assets
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"] 