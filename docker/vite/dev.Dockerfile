FROM node:16-alpine3.11

WORKDIR /usr/src/app
COPY . .

CMD [ "yarn", "run", "dev" ]