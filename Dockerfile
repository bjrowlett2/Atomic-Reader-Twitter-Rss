FROM node:16.7.0

ENV TWITTER_CLIENT_ID=
ENV TWITTER_CLIENT_SECRET=

WORKDIR /app

COPY [ ".", "./" ]
RUN [ "npm", "install" ]
ENTRYPOINT [ "node", "src/main.js" ]
