FROM node:lts-alpine

WORKDIR /app

COPY ./backend/ ./

RUN npm install

RUN npm run build

ENTRYPOINT [ "node", "dist/main" ]
