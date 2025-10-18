# Multi-stage build for Finora

# Stage 1: Backend base
FROM python:3.11-slim as backend-build

WORKDIR /app/api

# Install dependencies
COPY api/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Stage 2: Node base for frontend
FROM node:18-alpine as frontend-build

WORKDIR /app

# Copy and install dependencies
COPY package.json package-lock.json* ./
RUN npm install --frozen-lockfile

# Copy source and build
COPY . .
RUN npm run build

# Stage 3: Final runtime image
FROM node:18-alpine

WORKDIR /app

# Copy node modules and built app
COPY --from=frontend-build /app/node_modules ./node_modules
COPY --from=frontend-build /app/.next ./.next
COPY --from=frontend-build /app/public ./public
COPY package.json ./

# Copy Python and backend
COPY --from=backend-build /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=backend-build /usr/local/bin/python* /usr/local/bin/
COPY api ./api

# Expose ports
EXPOSE 3000 8000

# Set environment variables
ENV NODE_ENV=production
ENV PYTHONUNBUFFERED=1

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start command
CMD ["sh", "-c", "npm start"]
