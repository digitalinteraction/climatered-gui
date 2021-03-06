# Start with a node 10 image with package info
# Installs *all* npm packages and runs build script
FROM node:12-alpine as builder
WORKDIR /app
COPY ["package*.json", "/app/"]
ENV NODE_ENV development
RUN npm ci
COPY [ ".", "/app/" ]
ENV NODE_ENV production
RUN npm run build

# Swaps to nginx and copies the compiled html ready to be serverd
# Uses a configurable nginx which can pass envionment variables to JavaScript
FROM robbj/configurable-nginx:1.0.1
ARG BUILD_NAME
ENV CONFIG_KEYS API_URL,CDN_URL,GA_TOKEN,BUILD_NAME
ENV BUILD_NAME $BUILD_NAME
COPY --from=builder /app/dist /usr/share/nginx/html
