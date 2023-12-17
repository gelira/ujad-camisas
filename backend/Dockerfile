FROM node:lts-bookworm-slim

RUN apt update

RUN apt install libnss3-dev libgdk-pixbuf2.0-dev libgtk-3-dev libxss-dev libasound2

WORKDIR /app

COPY ./backend/ ./

RUN npm install

RUN npm run build

ENTRYPOINT [ "node", "dist/main" ]
