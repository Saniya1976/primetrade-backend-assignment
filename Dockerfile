# Use Node.js 20 base image
FROM node:20-slim AS build

# Set working directory
WORKDIR /app

# Copy root package.json and sub-directory package.json files
COPY package.json package-lock.json ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Install root and subdirectory dependencies
RUN npm install
RUN cd backend && npm install
RUN cd frontend && npm install

# Copy the rest of the code
COPY . .

# Generate Prisma Client
RUN cd backend && npx prisma generate

# Build frontend static files
RUN cd frontend && npm run build

# --- Production Image ---
FROM node:20-slim

WORKDIR /app

# Copy built app from build stage
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/backend ./backend
COPY --from=build /app/frontend/out ./frontend/out

# Install only production dependencies in backend
RUN cd backend && npm install --omit=dev

# Expose backend port
EXPOSE 5000

# Set environment
ENV NODE_ENV=production

# Start command
WORKDIR /app/backend
CMD ["npm", "start"]
