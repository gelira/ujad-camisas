FROM node:lts-bookworm-slim

RUN apt update \
    && apt install -y \
        libnss3-dev \
        libgdk-pixbuf2.0-dev \
        libgtk-3-dev \
        libxss-dev \
        libasound2

WORKDIR /app

COPY ./backend/package*.json ./

RUN npm install

COPY ./backend/ ./

RUN npm run build

ENTRYPOINT [ "node", "dist/main" ]
