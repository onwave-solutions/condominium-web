FROM node:8.11.1-alpine

RUN mkdir -p /user/web/build
WORKDIR /user/web

COPY build ./build
COPY server.js .
COPY tsconfig.json .

RUN yarn add express http-proxy-middleware

CMD node server
