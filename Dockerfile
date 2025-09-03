# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Accept build arguments for environment variables
ARG NEXT_PUBLIC_AWS_REGION
ARG NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID
ARG NEXT_PUBLIC_AWS_COGNITO_APP_CLIENT_ID
ARG NEXT_PUBLIC_AWS_COGNITO_DOMAIN
ARG NEXT_PUBLIC_COGNITO_REDIRECT_SIGN_IN
ARG NEXT_PUBLIC_COGNITO_REDIRECT_SIGN_OUT
ARG NEXT_PUBLIC_BACKEND_URL

# Set environment variables from build args
ENV NEXT_PUBLIC_AWS_REGION=$NEXT_PUBLIC_AWS_REGION
ENV NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID=$NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID
ENV NEXT_PUBLIC_AWS_COGNITO_APP_CLIENT_ID=$NEXT_PUBLIC_AWS_COGNITO_APP_CLIENT_ID
ENV NEXT_PUBLIC_AWS_COGNITO_DOMAIN=$NEXT_PUBLIC_AWS_COGNITO_DOMAIN
ENV NEXT_PUBLIC_COGNITO_REDIRECT_SIGN_IN=$NEXT_PUBLIC_COGNITO_REDIRECT_SIGN_IN
ENV NEXT_PUBLIC_COGNITO_REDIRECT_SIGN_OUT=$NEXT_PUBLIC_COGNITO_REDIRECT_SIGN_OUT
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
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