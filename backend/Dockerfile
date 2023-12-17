FROM node:lts

WORKDIR /app

COPY ./backend/ ./

RUN npm install

RUN npm run build

ENTRYPOINT [ "node", "dist/main" ]
