FROM node:13.10.1 AS build

RUN mkdir /app
COPY package.json package-lock.json /app/
WORKDIR /app
RUN npm ci
COPY  . /app/
# this will build the browser and server files:
RUN npm run build


FROM nginx:1.16.1 AS frontend-browser
COPY --from=build /app/build/ /usr/share/nginx/html
COPY react-server.nginx.conf /etc/nginx/conf.d/default.conf
