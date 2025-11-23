# syntax=docker/dockerfile:1

FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

RUN apk add --no-cache openssl

# Copy source
COPY . .

RUN npx prisma generate

# Build the static site
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

# Tiny static file server
RUN npm install -g serve

COPY --from=builder /app/dist ./dist

ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321

CMD ["serve", "-s", "dist", "-l", "4321"]
