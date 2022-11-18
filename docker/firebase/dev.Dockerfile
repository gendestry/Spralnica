FROM node:16-alpine3.11

RUN apk add openjdk11

RUN npm install -g firebase-tools

WORKDIR /usr/src/app


COPY . .

CMD [ "firebase", "emulators:start" ]