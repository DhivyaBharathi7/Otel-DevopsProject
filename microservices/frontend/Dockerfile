# ---------- Stage 1: Install dependencies ----------
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package*.json ./
RUN npm ci

# ---------- Stage 2: Build ----------
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat protobuf-dev protoc

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY ./pb ./pb
COPY . .

# Generate gRPC code and build Next.js app
RUN npm run grpc:generate
RUN npm run build

# ---------- Stage 3: Runner ----------
FROM node:20-alpine AS runner
RUN apk add --no-cache libc6-compat

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080
EXPOSE ${PORT}

# Add non-root user
RUN addgroup -g 1001 -S nodejs \
    && adduser -S nextjs -u 1001

# Copy only necessary files from builder
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/utils/telemetry/Instrumentation.js ./utils/telemetry/
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# ✅ Correct way to start Next.js standalone server
CMD ["node", "server.js"]

