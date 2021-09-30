# Building app
FROM node:14-alpine as builder
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package*.json ./
RUN npm config set unsafe-perm true
USER root
# npm@7 throws circular import error
RUN npm install -g npm@6
USER node
RUN npm install
COPY --chown=node:node . .
RUN npm run lint
RUN npm run test -- --ci
RUN npm run build

# Runtime 
FROM node:14-alpine
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package*.json ./
USER node
RUN npm install --production
COPY --from=builder /home/node/app/build ./build

COPY --chown=node:node .env .

EXPOSE 8080
CMD [ "node", "build/server.js" ]