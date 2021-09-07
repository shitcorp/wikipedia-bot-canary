# Alias node base image
FROM node:16.7.0 as node

# Builder image
FROM node as builder

# Create app directory
WORKDIR /app

# # Copy misc yarn files
# COPY .yarn ./
# COPY .yarnrc.yml ./

# # Copy package file
# COPY package.json ./
# # Copy lock file
# COPY yarn.lock ./

# Bundle app source
COPY . .

# Install deps
RUN yarn install --frozen-lockfile
# RUN yarn install

# Only build the wiki project with the "builder" as base
FROM builder as wiki-builder

# build wiki bot
RUN yarn build

# Our minimal node server image
FROM node as server

WORKDIR /app

COPY --from=wiki-builder /app/dist/ /app/

# runs on port 8020 by default
EXPOSE 8020/tcp

ENTRYPOINT ["node", "/app/dist/index.js"]
