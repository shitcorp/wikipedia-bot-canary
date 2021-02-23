FROM node:lts-alpine

# create destination directory
WORKDIR /api

# install yarn
RUN apk add yarn python make g++

# install deps
COPY package.json .
RUN yarn

# copy the app
COPY . .

# build necessary, even if no static files are needed,
# since it builds the server as well
RUN yarn run build && \
    node scripts/yarn-prune.cjs && \
    yarn cache clean && \
    apk del python make g++ && \
    rm src -r && \
    rm scripts -r

# expose 5000 on container
EXPOSE 3420

ENV NODE_Env=production

# start the app
CMD [ "yarn", "start" ]
