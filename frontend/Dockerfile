FROM node:lts-alpine as build-stage

WORKDIR /app

COPY ./frontend/package*.json ./

RUN npm install

COPY ./frontend ./

RUN npm run build

FROM nginx:alpine as production-stage

RUN mkdir /app

COPY --from=build-stage /app/dist /app

COPY ./frontend/nginx.conf /etc/nginx/nginx.conf
